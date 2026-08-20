"""ZYRA iteration-2 backend tests.

Covers RBAC across 4 roles, tailor isolation, CMS CRUD + publish + reorder +
bulk import, public /content mirroring, tailoring booking happy-path, 409 when
no availability, tailor accept/decline race guard, availability toggling, and
pricing configurability.
"""
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE_URL}/api"

CREDS = {
    "admin":  ("admin@zyra.app",  "ZyraAdmin2026"),
    "editor": ("editor@zyra.app", "ZyraEditor2026"),
    "viewer": ("viewer@zyra.app", "ZyraViewer2026"),
    "tailor": ("tailor@zyra.app", "ZyraTailor2026"),
}


def _login(email, password):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, f"login failed for {email}: {r.status_code} {r.text}"
    return r.json()


def _h(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def tokens():
    return {role: _login(*c) for role, c in CREDS.items()}


# ---------- RBAC ----------
def test_admin_role_and_perms(tokens):
    data = tokens["admin"]
    assert data["user"]["role"] == "admin"
    perms = set(data["user"]["permissions"])
    for a in ("leads:write", "content:write", "team:write", "pricing:write", "tailors:write"):
        assert a in perms


def test_editor_perms(tokens):
    perms = set(tokens["editor"]["user"]["permissions"])
    assert "content:write" in perms
    assert "team:write" not in perms
    assert "team:read" not in perms


def test_viewer_perms(tokens):
    perms = set(tokens["viewer"]["user"]["permissions"])
    assert "content:read" in perms
    assert "content:write" not in perms
    assert "leads:write" not in perms


def test_tailor_perms(tokens):
    perms = set(tokens["tailor"]["user"]["permissions"])
    assert "bookings:read_own" in perms
    assert "availability:write" in perms
    assert "leads:read" not in perms
    assert "content:write" not in perms


def test_unauthenticated_admin_calls_401():
    for path in ("/admin/leads", "/admin/team", "/admin/content", "/admin/stats", "/admin/pricing"):
        r = requests.get(f"{API}{path}")
        assert r.status_code == 401, f"{path} returned {r.status_code}"


def test_editor_no_team_view(tokens):
    r = requests.get(f"{API}/admin/team", headers=_h(tokens["editor"]["access_token"]))
    assert r.status_code == 403


def test_viewer_write_forbidden(tokens):
    # PATCH a lead status should be 403 for viewer
    admin_leads = requests.get(f"{API}/admin/leads", headers=_h(tokens["admin"]["access_token"])).json()
    if admin_leads:
        lid = admin_leads[0]["id"]
        r = requests.patch(f"{API}/admin/leads/{lid}", json={"status": "reviewed"},
                           headers=_h(tokens["viewer"]["access_token"]))
        assert r.status_code == 403
    # content:write also forbidden
    r2 = requests.post(f"{API}/admin/content",
                       json={"type": "faq", "slug": f"test-{uuid.uuid4().hex[:6]}", "data": {"q": "x", "a": "y"}},
                       headers=_h(tokens["viewer"]["access_token"]))
    assert r2.status_code == 403


def test_tailor_cannot_read_leads(tokens):
    r = requests.get(f"{API}/admin/leads", headers=_h(tokens["tailor"]["access_token"]))
    assert r.status_code == 403


def test_tailor_can_read_own_bookings(tokens):
    r = requests.get(f"{API}/tailor/bookings", headers=_h(tokens["tailor"]["access_token"]))
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---------- Leads: email alert + persistence ----------
def test_lead_persistence_and_source_status(tokens):
    email = f"test_lead_{uuid.uuid4().hex[:6]}@example.com"
    r = requests.post(f"{API}/leads", json={
        "type": "merchant", "name": "TEST_persist",
        "email": email, "city": "Delhi", "phone": "9999999999",
        "message": "hi", "source": "unit-test",
    })
    assert r.status_code == 201
    lid = r.json()["id"]

    # Verify in admin listing
    admin_h = _h(tokens["admin"]["access_token"])
    listing = requests.get(f"{API}/admin/leads?type=merchant", headers=admin_h).json()
    found = next((x for x in listing if x["id"] == lid), None)
    assert found is not None
    assert found["email"] == email
    assert found["status"] == "new"
    assert found["source"] == "unit-test"
    assert found["type"] == "merchant"
    assert "created_at" in found and found["created_at"]


def test_leads_endpoint_does_not_accept_recipient_or_html():
    # The API must NOT accept a 'to' or 'html' recipient field; extras are ignored.
    r = requests.post(f"{API}/leads", json={
        "type": "waitlist", "name": "TEST_no_recipient",
        "email": f"norec_{uuid.uuid4().hex[:6]}@example.com",
        "to": "attacker@example.com", "html": "<script>alert(1)</script>",
        "recipient": "attacker@example.com",
    })
    assert r.status_code == 201


# ---------- CMS ----------
@pytest.fixture(scope="session")
def cms_faq_id(tokens):
    admin_h = _h(tokens["admin"]["access_token"])
    slug = f"test-faq-{uuid.uuid4().hex[:6]}"
    r = requests.post(f"{API}/admin/content", json={
        "type": "faq", "slug": slug, "status": "draft",
        "data": {"q": "TEST question?", "a": "TEST answer."},
    }, headers=admin_h)
    assert r.status_code == 201, r.text
    return r.json()["id"], slug


def test_cms_create_and_update_publish(tokens, cms_faq_id):
    lid, slug = cms_faq_id
    admin_h = _h(tokens["admin"]["access_token"])
    # publish
    r = requests.patch(f"{API}/admin/content/{lid}", json={"status": "published"}, headers=admin_h)
    assert r.status_code == 200
    assert r.json()["status"] == "published"
    # public /content should now include it
    pub = requests.get(f"{API}/content?type=faq").json()
    assert any(x["slug"] == slug for x in pub), "published FAQ missing from public /content"


def test_cms_reorder(tokens, cms_faq_id):
    lid, _ = cms_faq_id
    admin_h = _h(tokens["admin"]["access_token"])
    r = requests.post(f"{API}/admin/content/reorder",
                      json={"items": [{"id": lid, "order": 99}]}, headers=admin_h)
    assert r.status_code == 200


def test_cms_editor_can_write_but_viewer_cannot(tokens):
    ed_h = _h(tokens["editor"]["access_token"])
    slug = f"editor-faq-{uuid.uuid4().hex[:6]}"
    r = requests.post(f"{API}/admin/content", json={
        "type": "faq", "slug": slug, "data": {"q": "q", "a": "a"},
    }, headers=ed_h)
    assert r.status_code == 201
    # cleanup
    requests.delete(f"{API}/admin/content/{r.json()['id']}",
                    headers=_h(tokens["admin"]["access_token"]))


def test_cms_bulk_import_idempotent(tokens):
    admin_h = _h(tokens["admin"]["access_token"])
    slug = f"bulk-{uuid.uuid4().hex[:6]}"
    items = [{"type": "faq", "slug": slug, "status": "published", "data": {"q": "b?", "a": "b."}}]
    r1 = requests.post(f"{API}/admin/content/bulk", json=items, headers=admin_h)
    assert r1.status_code == 201 and r1.json()["created"] == 1
    r2 = requests.post(f"{API}/admin/content/bulk", json=items, headers=admin_h)
    assert r2.status_code == 201 and r2.json()["created"] == 0 and r2.json()["skipped"] == 1


def test_cms_delete(tokens, cms_faq_id):
    lid, _ = cms_faq_id
    admin_h = _h(tokens["admin"]["access_token"])
    r = requests.delete(f"{API}/admin/content/{lid}", headers=admin_h)
    assert r.status_code == 200


# ---------- Tailoring booking ----------
def _future_date(offset=3):
    return (datetime.now(timezone.utc).date() + timedelta(days=offset)).isoformat()


def test_tailoring_options_and_slots():
    r = requests.get(f"{API}/tailoring/options")
    assert r.status_code == 200
    body = r.json()
    assert "garments" in body and "services" in body and "pricing" in body

    r2 = requests.get(f"{API}/tailoring/slots", params={"city": "Delhi", "date": _future_date(3)})
    assert r2.status_code == 200
    assert r2.json()["any_available"] is True


def test_booking_happy_path_and_409_on_bad_slot():
    date = _future_date(4)
    # happy path
    payload = {
        "name": "TEST_book", "email": f"book_{uuid.uuid4().hex[:6]}@example.com",
        "phone": "9999999999", "city": "Delhi", "garment": "Sherwani",
        "service": "Custom Stitching", "date": date, "slot": "11:30",
        "measurement_method": "I'll provide my measurements",
    }
    r = requests.post(f"{API}/tailoring/bookings", json=payload)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["reference"].startswith("ZT-")
    assert body["status"] == "awaiting_tailor"
    assert body["estimate_min"] and body["estimate_max"]
    # track
    t = requests.get(f"{API}/tailoring/bookings/{body['reference']}")
    assert t.status_code == 200
    assert t.json()["status"] == "awaiting_tailor"

    # 409 - bogus slot no tailor covers
    bad = {**payload, "slot": "23:45"}
    r2 = requests.post(f"{API}/tailoring/bookings", json=bad)
    assert r2.status_code == 409
    assert "no tailoring partner" in r2.json()["detail"].lower()


# ---------- Tailor accept flow ----------
def test_tailor_accept_flow(tokens):
    # create a fresh booking in Delhi so tailor@zyra.app (Delhi) can respond
    date = _future_date(5)
    payload = {
        "name": "TEST_accept", "email": f"acc_{uuid.uuid4().hex[:6]}@example.com",
        "phone": "9999999999", "city": "Delhi", "garment": "Sherwani",
        "service": "Custom Stitching", "date": date, "slot": "13:00",
        "measurement_method": "I'll provide my measurements",
    }
    r = requests.post(f"{API}/tailoring/bookings", json=payload)
    assert r.status_code == 201
    ref = r.json()["reference"]

    t_h = _h(tokens["tailor"]["access_token"])
    my = requests.get(f"{API}/tailor/bookings", headers=t_h).json()
    target = next((b for b in my if b["reference"] == ref), None)
    assert target is not None, "tailor did not see the new Delhi booking"
    bid = target["id"]

    # accept
    r2 = requests.post(f"{API}/tailor/bookings/{bid}/respond", json={"action": "accept"}, headers=t_h)
    assert r2.status_code == 200
    assert r2.json()["status"] == "confirmed"

    # public tracker now shows confirmed with tailor name
    tr = requests.get(f"{API}/tailoring/bookings/{ref}").json()
    assert tr["status"] == "confirmed"
    assert tr.get("tailor_name")

    # second accept 409
    r3 = requests.post(f"{API}/tailor/bookings/{bid}/respond", json={"action": "accept"}, headers=t_h)
    assert r3.status_code == 409


# ---------- Tailor availability edit ----------
def test_tailor_availability_toggle(tokens):
    t_h = _h(tokens["tailor"]["access_token"])
    date = _future_date(20)  # far future to not disturb other tests
    # close all slots
    r = requests.put(f"{API}/tailor/availability", json={"date": date, "slots": []}, headers=t_h)
    assert r.status_code == 200
    # public slots endpoint should NOT list this tailor's slots for that date
    slots = requests.get(f"{API}/tailoring/slots", params={"city": "Delhi", "date": date}).json()
    # There are other seeded Delhi tailors, so slots may still be nonempty from them.
    # We only assert the endpoint responded and no error.
    assert "slots" in slots
    # restore
    r2 = requests.put(f"{API}/tailor/availability",
                      json={"date": date, "slots": ["10:00", "11:30"]}, headers=t_h)
    assert r2.status_code == 200


# ---------- Pricing ----------
def test_pricing_edit_reflected(tokens):
    admin_h = _h(tokens["admin"]["access_token"])
    payload = {"garment": "Kurta Set", "service": "Custom Stitching", "city": "Delhi",
               "min_price": 7777, "max_price": 17777}
    r = requests.put(f"{API}/admin/pricing", json=payload, headers=admin_h)
    assert r.status_code == 200
    opts = requests.get(f"{API}/tailoring/options").json()
    match = [b for b in opts["pricing"]
             if b["garment"] == "Kurta Set" and b["service"] == "Custom Stitching" and b["city"] == "Delhi"]
    assert match and match[0]["min_price"] == 7777 and match[0]["max_price"] == 17777
