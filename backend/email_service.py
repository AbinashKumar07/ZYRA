"""Transactional email for ZYRA via the Emergent managed email integration.

Recipients come from server-side config only (LEAD_ALERT_RECIPIENTS); bodies come
from the fixed templates in this module. No route accepts a recipient or HTML.
"""
import asyncio
import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx

logger = logging.getLogger("zyra.email")
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        parsed = urlparse(low)
        if not _host_ok(parsed.hostname or "") or parsed.username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


def alert_recipients() -> list[str]:
    raw = os.environ.get("LEAD_ALERT_RECIPIENTS", "")
    return [a.strip() for a in raw.split(",") if a.strip()]


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": os.environ["EMAIL_FROM_NAME"]}
    reply_to = os.environ.get("EMAIL_REPLY_TO")
    if reply_to:
        payload["contact_email"] = reply_to
    last_error = None
    for attempt in range(3):
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": os.environ["EMERGENT_EMAIL_KEY"]},
                json=payload,
            )
        if resp.status_code != 429:
            resp.raise_for_status()
            return resp.json().get("id")
        last_error = resp
        await asyncio.sleep(2 * (attempt + 1))  # provider rate limit: back off and retry
    last_error.raise_for_status()
    return None


_LEAD_LABEL = {
    "waitlist": "waitlist signup",
    "merchant": "merchant partner application",
    "investor": "investor / partner enquiry",
    "contact": "contact enquiry",
}

_ROW = '<tr><td style="padding:6px 12px 6px 0;color:#73737d;font-size:13px;white-space:nowrap">{k}</td><td style="padding:6px 0;color:#111116;font-size:13px"><strong>{v}</strong></td></tr>'


def _lead_html(lead: dict, brand: str) -> str:
    rows = [
        ("Type", _LEAD_LABEL.get(lead.get("type"), lead.get("type", ""))),
        ("Name", lead.get("name", "")),
        ("Email", lead.get("email", "")),
        ("Phone", lead.get("phone") or "—"),
        ("City", lead.get("city") or "—"),
        ("Source", lead.get("source") or "website"),
        ("Received", lead.get("created_at", "")),
    ]
    for k, v in (lead.get("details") or {}).items():
        rows.append((k.replace("_", " ").title(), str(v)))
    table = "".join(_ROW.format(k=escape(str(k)), v=escape(str(v))) for k, v in rows)
    message = lead.get("message")
    message_block = (
        f'<p style="margin:18px 0 0;color:#111116;font-size:13px;line-height:1.6">'
        f'<span style="color:#73737d">Message</span><br>{escape(message)}</p>'
        if message else ""
    )
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#f5f5f7;padding:24px"><tr><td align="center">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden">'
        '<tr><td style="background:#0b0b0f;padding:20px 24px">'
        f'<span style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;letter-spacing:4px;font-weight:bold">'
        f'{escape(brand.upper())}</span>'
        '<div style="color:#a78bfa;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;margin-top:6px">'
        'NEW LEAD ALERT</div></td></tr>'
        '<tr><td style="padding:24px;font-family:Arial,sans-serif">'
        f'<p style="margin:0 0 16px;color:#111116;font-size:15px">A new '
        f'{escape(_LEAD_LABEL.get(lead.get("type"), "lead"))} just came in.</p>'
        f'<table role="presentation" cellpadding="0" cellspacing="0">{table}</table>'
        f'{message_block}'
        '<p style="margin:22px 0 0;color:#73737d;font-size:12px;line-height:1.6">'
        'Open the ZYRA admin dashboard to review, update the status or reply.</p>'
        f'<p style="margin:18px 0 0;color:#a0a0a8;font-size:11px">Sent by {escape(brand)}. '
        'We never ask for passwords or payment details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )


async def send_lead_alert(lead: dict) -> None:
    """Fire-and-forget alert to the configured internal recipients."""
    recipients = alert_recipients()
    if not recipients:
        logger.warning("LEAD_ALERT_RECIPIENTS is empty — skipping lead alert email")
        return
    brand = os.environ["EMAIL_FROM_NAME"]
    subject = f"New {_LEAD_LABEL.get(lead.get('type'), 'lead')} — {lead.get('name', 'ZYRA')}"
    html = _lead_html(lead, brand)
    for address in recipients:
        try:
            await send_email(to=address, subject=subject, html=html)
            logger.info("Lead alert sent to %s", address)
        except httpx.HTTPStatusError as exc:
            if exc.response.status_code == 422:
                logger.info("Lead alert to %s not delivered (recipient not allow-listed yet)", address)
            else:
                logger.error("Lead alert to %s failed: %s", address, exc)
        except Exception as exc:  # never break the public form on an email failure
            logger.error("Lead alert to %s failed: %s", address, exc)


def _booking_html(booking: dict, brand: str, headline: str, note: str) -> str:
    rows = [
        ("Reference", booking.get("reference", "")),
        ("Garment", booking.get("garment", "")),
        ("Service", booking.get("service", "")),
        ("Preferred date", booking.get("date", "")),
        ("Time slot", booking.get("slot", "")),
        ("City", booking.get("city", "")),
        ("Measurements", booking.get("measurement_method", "")),
        ("Customer", booking.get("name", "")),
        ("Email", booking.get("email", "")),
        ("Phone", booking.get("phone", "")),
        ("Status", booking.get("status", "")),
    ]
    if booking.get("tailor_name"):
        rows.append(("Tailoring partner", booking["tailor_name"]))
    if booking.get("estimate_min") and booking.get("estimate_max"):
        rows.append(("Estimate range", f"Rs {booking['estimate_min']:,} - Rs {booking['estimate_max']:,}"))
    table = "".join(_ROW.format(k=escape(str(k)), v=escape(str(v))) for k, v in rows)
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#f5f5f7;padding:24px"><tr><td align="center">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden">'
        '<tr><td style="background:#0b0b0f;padding:20px 24px">'
        f'<span style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;letter-spacing:4px;font-weight:bold">'
        f'{escape(brand.upper())}</span>'
        '<div style="color:#a78bfa;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;margin-top:6px">'
        'CUSTOM TAILORING</div></td></tr>'
        '<tr><td style="padding:24px;font-family:Arial,sans-serif">'
        f'<p style="margin:0 0 16px;color:#111116;font-size:15px">{escape(headline)}</p>'
        f'<table role="presentation" cellpadding="0" cellspacing="0">{table}</table>'
        f'<p style="margin:22px 0 0;color:#73737d;font-size:12px;line-height:1.6">{escape(note)}</p>'
        f'<p style="margin:18px 0 0;color:#a0a0a8;font-size:11px">Sent by {escape(brand)}. '
        'We never ask for passwords or payment details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )


async def send_booking_alert(booking: dict, *, to_customer: bool, headline: str, note: str) -> None:
    brand = os.environ["EMAIL_FROM_NAME"]
    subject = f"Custom tailoring {booking.get('reference', '')} — {booking.get('status', '').replace('_', ' ')}"
    html = _booking_html(booking, brand, headline, note)
    targets = list(alert_recipients())
    if to_customer and booking.get("email") and booking["email"] not in targets:
        targets.insert(0, booking["email"])
    for address in targets:
        try:
            await send_email(to=address, subject=subject, html=html)
            logger.info("Booking alert sent to %s", address)
        except httpx.HTTPStatusError as exc:
            # The managed integration only delivers to allow-listed recipients while
            # the sending domain is unverified: not an application error.
            if exc.response.status_code == 422:
                logger.info("Booking alert to %s not delivered (recipient not allow-listed yet)", address)
            else:
                logger.error("Booking alert to %s failed: %s", address, exc)
        except Exception as exc:
            logger.error("Booking alert to %s failed: %s", address, exc)


def fire_and_forget(coro) -> None:
    """Schedule an email send without blocking the API response."""
    task = asyncio.create_task(coro)
    task.add_done_callback(lambda t: t.exception() and logger.error("email task failed: %s", t.exception()))
