"""ZYRA backend API tests: leads, auth, admin."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback to frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@zyra.app"
ADMIN_PASSWORD = "ZyraAdmin2026"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def created_lead_ids():
    return []


# ---------- Leads ----------
@pytest.mark.parametrize("ltype", ["waitlist", "merchant", "investor", "contact"])
def test_create_lead_each_type(s, ltype, created_lead_ids):
    r = s.post(f"{API}/leads", json={
        "type": ltype,
        "name": f"TEST_{ltype}",
        "email": f"test_{ltype}_{uuid.uuid4().hex[:6]}@example.com",
        "phone": "9999999999",
        "city": "Delhi",
        "message": "hello",
    })
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["type"] == ltype
    assert "id" in data
    created_lead_ids.append(data["id"])


def test_lead_invalid_email(s):
    r = s.post(f"{API}/leads", json={"type": "waitlist", "name": "TEST", "email": "not-an-email"})
    assert r.status_code == 422


def test_lead_missing_name(s):
    r = s.post(f"{API}/leads", json={"type": "waitlist", "email": "a@b.com"})
    assert r.status_code == 422


def test_lead_invalid_type(s):
    r = s.post(f"{API}/leads", json={"type": "bogus", "name": "x", "email": "a@b.com"})
    assert r.status_code == 422


# ---------- Auth ----------
def test_login_wrong_password(s):
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-xxx"})
    assert r.status_code == 401


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    return data["access_token"]


def test_login_success(admin_token):
    assert isinstance(admin_token, str) and len(admin_token) > 20


def test_lockout_triggers_eventually():
    """Lockout uses request.client.host which is the ingress IP (not real client IP).
    Because ingress load-balances across replicas the counter is not per-user reliable.
    We still expect a 429 to trigger within a reasonable number of attempts."""
    fake_email = f"lockout_{uuid.uuid4().hex[:6]}@example.com"
    statuses = []
    for _ in range(20):
        r = requests.post(f"{API}/auth/login", json={"email": fake_email, "password": "bad"})
        statuses.append(r.status_code)
        if r.status_code == 429:
            break
    assert 429 in statuses, f"No 429 within 20 attempts: {statuses}"


# ---------- Admin ----------
def test_admin_leads_requires_auth():
    r = requests.get(f"{API}/admin/leads")
    assert r.status_code == 401


def test_admin_stats_requires_auth():
    r = requests.get(f"{API}/admin/stats")
    assert r.status_code == 401


def test_admin_leads_with_token(admin_token):
    r = requests.get(f"{API}/admin/leads", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    leads = r.json()
    assert isinstance(leads, list)
    # ensure _id is not leaking as ObjectId (should be string id)
    if leads:
        assert "id" in leads[0]


def test_admin_stats_with_token(admin_token):
    r = requests.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    data = r.json()
    for t in ("waitlist", "merchant", "investor", "contact", "total"):
        assert t in data


def test_admin_patch_updates_status(admin_token, created_lead_ids):
    assert created_lead_ids, "no lead created"
    lead_id = created_lead_ids[0]
    headers = {"Authorization": f"Bearer {admin_token}"}
    r = requests.patch(f"{API}/admin/leads/{lead_id}", json={"status": "reviewed"}, headers=headers)
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "reviewed"
    # verify persistence
    r2 = requests.get(f"{API}/admin/leads", headers=headers)
    matched = [l for l in r2.json() if l["id"] == lead_id]
    assert matched and matched[0]["status"] == "reviewed"


def test_admin_patch_requires_auth(created_lead_ids):
    lead_id = created_lead_ids[0] if created_lead_ids else "507f1f77bcf86cd799439011"
    r = requests.patch(f"{API}/admin/leads/{lead_id}", json={"status": "reviewed"})
    assert r.status_code == 401
