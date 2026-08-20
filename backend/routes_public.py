"""Public (unauthenticated) ZYRA API: leads, published CMS content, tailoring booking."""
import random
import string
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request

from auth import client_ip
from email_service import fire_and_forget, send_booking_alert, send_lead_alert
from models import (
    CITIES, GARMENTS, MEASUREMENT_METHODS, SERVICES,
    Booking, BookingCreate, ContentItem, Lead, LeadCreate, now_iso,
)

router = APIRouter()

_hits: dict = {}


def rate_limit(request: Request, bucket: str, limit: int, window_sec: int = 300):
    key = f"{bucket}:{client_ip(request)}"
    now = datetime.now(timezone.utc).timestamp()
    recent = [t for t in _hits.get(key, []) if now - t < window_sec]
    if len(recent) >= limit:
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")
    recent.append(now)
    _hits[key] = recent


@router.get("/")
async def root():
    return {"service": "ZYRA API", "status": "ok"}


# ---------- Leads ----------
@router.post("/leads", status_code=201)
async def create_lead(payload: LeadCreate, request: Request):
    rate_limit(request, "leads", 12)
    db = request.app.state.db
    lead = Lead(**payload.model_dump())
    result = await db.leads.insert_one(lead.to_mongo())
    stored = lead.model_dump()
    stored["id"] = str(result.inserted_id)
    fire_and_forget(send_lead_alert(stored))
    return {"id": stored["id"], "type": lead.type}


# ---------- Published content ----------
@router.get("/content")
async def public_content(request: Request, type: str | None = None):
    db = request.app.state.db
    query = {"status": "published"}
    if type:
        query["type"] = type
    docs = await db.content.find(query).sort([("type", 1), ("order", 1)]).to_list(1000)
    return [ContentItem.from_mongo(d).model_dump() for d in docs]


# ---------- Tailoring ----------
@router.get("/tailoring/options")
async def tailoring_options(request: Request):
    db = request.app.state.db
    bands = await db.pricing.find({}, {"_id": 0}).to_list(500)
    return {
        "garments": GARMENTS,
        "services": SERVICES,
        "measurement_methods": MEASUREMENT_METHODS,
        "cities": CITIES,
        "pricing": bands,
    }


async def _available_tailors(db, city: str, date: str, slot: str | None = None):
    tailors = await db.tailors.find({"city": city, "active": True}).to_list(200)
    out = []
    for t in tailors:
        av = await db.availability.find_one({"tailor_id": str(t["_id"]), "date": date})
        slots = (av or {}).get("slots", [])
        if slot is None or slot in slots:
            out.append({"id": str(t["_id"]), "name": t["name"], "slots": slots})
    return out


@router.get("/tailoring/slots")
async def tailoring_slots(request: Request, city: str, date: str):
    """Slots a tailoring partner has actually opened for that date in that city."""
    db = request.app.state.db
    tailors = await _available_tailors(db, city, date)
    counts: dict[str, int] = {}
    for t in tailors:
        for s in t["slots"]:
            counts[s] = counts.get(s, 0) + 1
    slots = [{"slot": s, "partners_available": c} for s, c in sorted(counts.items())]
    return {"city": city, "date": date, "slots": slots, "any_available": bool(slots)}


def _reference() -> str:
    return "ZT-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


@router.post("/tailoring/bookings", status_code=201)
async def request_booking(payload: BookingCreate, request: Request):
    rate_limit(request, "bookings", 8)
    db = request.app.state.db
    if payload.garment not in GARMENTS or payload.service not in SERVICES:
        raise HTTPException(status_code=422, detail="Unknown garment or service")
    if payload.measurement_method not in MEASUREMENT_METHODS or payload.city not in CITIES:
        raise HTTPException(status_code=422, detail="Unknown city or measurement method")

    candidates = await _available_tailors(db, payload.city, payload.date, payload.slot)
    if not candidates:
        raise HTTPException(
            status_code=409,
            detail="No tailoring partner is available for that slot. Please choose another date or time.",
        )

    band = await db.pricing.find_one({"garment": payload.garment, "service": payload.service, "city": payload.city})
    if not band:
        band = await db.pricing.find_one({"garment": payload.garment, "service": payload.service, "city": CITIES[0]})

    booking = Booking(
        reference=_reference(),
        **payload.model_dump(),
        estimate_min=(band or {}).get("min_price"),
        estimate_max=(band or {}).get("max_price"),
    )
    result = await db.bookings.insert_one(booking.to_mongo())
    stored = booking.model_dump()
    stored["id"] = str(result.inserted_id)
    fire_and_forget(send_booking_alert(
        stored,
        to_customer=True,
        headline="We've received your custom tailoring request. It is not confirmed yet.",
        note="A ZYRA independent tailoring partner must accept this request before it is confirmed. "
             "We'll email you the moment that happens. The estimate range is indicative and is finalised "
             "by the partner after measurements.",
    ))
    return {
        "reference": booking.reference,
        "status": booking.status,
        "estimate_min": booking.estimate_min,
        "estimate_max": booking.estimate_max,
        "partners_notified": len(candidates),
    }


@router.get("/tailoring/bookings/{reference}")
async def track_booking(reference: str, request: Request):
    db = request.app.state.db
    doc = await db.bookings.find_one({"reference": reference.upper()})
    if not doc:
        raise HTTPException(status_code=404, detail="No request found with that reference")
    b = Booking.from_mongo(doc).model_dump()
    return {
        "reference": b["reference"], "status": b["status"], "garment": b["garment"], "service": b["service"],
        "date": b["date"], "slot": b["slot"], "city": b["city"], "tailor_name": b.get("tailor_name"),
        "estimate_min": b.get("estimate_min"), "estimate_max": b.get("estimate_max"),
        "created_at": b["created_at"], "updated_at": b["updated_at"],
    }
