import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import APIRouter, FastAPI, HTTPException, Request  # noqa: E402
from motor.motor_asyncio import AsyncIOMotorClient  # noqa: E402
from pydantic import BaseModel, EmailStr  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402

import routes_admin  # noqa: E402
import routes_public  # noqa: E402
import routes_tailor  # noqa: E402
from auth import (  # noqa: E402
    PERMISSIONS, client_ip, create_access_token, hash_password, verify_password,
)
from models import CITIES, GARMENTS, SERVICES, now_iso  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("zyra")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="ZYRA API")
app.state.db = db

api_router = APIRouter(prefix="/api")


class LoginInput(BaseModel):
    email: EmailStr
    password: str


async def check_lockout(identifier: str):
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("count", 0) >= 5:
        locked_until = datetime.fromisoformat(rec["last_at"]) + timedelta(minutes=15)
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in a few minutes.")


@api_router.post("/auth/login")
async def login(payload: LoginInput, request: Request):
    email = payload.email.lower()
    identifier = f"{client_ip(request)}:{email}"
    await check_lockout(identifier)
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_at": now_iso()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("active", True):
        raise HTTPException(status_code=403, detail="This account has been deactivated")
    await db.login_attempts.delete_one({"identifier": identifier})
    return {
        "access_token": create_access_token(str(user["_id"]), email),
        "user": {
            "id": str(user["_id"]), "email": email, "name": user.get("name"),
            "role": user["role"], "city": user.get("city"),
            "permissions": sorted(PERMISSIONS[user["role"]]),
        },
    }


api_router.include_router(routes_public.router)
api_router.include_router(routes_admin.router, prefix="/admin")
api_router.include_router(routes_tailor.router, prefix="/tailor")
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_SLOTS = ["10:00", "11:30", "13:00", "15:00", "16:30", "18:00"]

SEED_PRICING = [
    ("Sherwani", "Custom Stitching", 18000, 42000),
    ("Sherwani", "Made to Measure", 22000, 55000),
    ("Suit (2-piece)", "Custom Stitching", 14000, 32000),
    ("Suit (2-piece)", "Made to Measure", 18000, 40000),
    ("Suit (3-piece)", "Custom Stitching", 19000, 45000),
    ("Tuxedo", "Made to Measure", 24000, 60000),
    ("Bridal Wear", "Bridal Fitting", 35000, 120000),
    ("Kurta Set", "Custom Stitching", 6000, 16000),
    ("Major Alteration", "Major Alteration", 1200, 6000),
    ("Custom Stitching", "Custom Stitching", 5000, 20000),
]

SEED_TAILORS = [
    ("Atelier Partner — Delhi Central", "partner.delhi@zyra.app", "Delhi", ["Sherwani", "Suit (2-piece)", "Kurta Set"]),
    ("Atelier Partner — Gurugram", "partner.gurugram@zyra.app", "Gurugram", ["Suit (3-piece)", "Tuxedo", "Major Alteration"]),
    ("Atelier Partner — Noida", "partner.noida@zyra.app", "Noida", ["Bridal Wear", "Kurta Set", "Custom Stitching"]),
]


async def seed_user(email_key: str, password_key: str, role: str, name: str, city: str | None = None,
                    tailor_id: str | None = None):
    email = os.environ.get(email_key, "").lower()
    password = os.environ.get(password_key)
    if not email or not password:
        return
    existing = await db.users.find_one({"email": email})
    doc = {"email": email, "name": name, "role": role, "active": True, "city": city}
    if tailor_id:
        doc["tailor_id"] = tailor_id
    if existing is None:
        await db.users.insert_one({**doc, "password_hash": hash_password(password), "created_at": now_iso()})
        logger.info("Seeded %s user %s", role, email)
    else:
        update = dict(doc)
        if not verify_password(password, existing["password_hash"]):
            update["password_hash"] = hash_password(password)
        await db.users.update_one({"email": email}, {"$set": update})


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.leads.create_index("created_at")
    await db.content.create_index([("type", 1), ("slug", 1)], unique=True)
    await db.content.create_index([("type", 1), ("status", 1), ("order", 1)])
    await db.bookings.create_index("reference", unique=True)
    await db.availability.create_index([("tailor_id", 1), ("date", 1)], unique=True)
    await db.pricing.create_index([("garment", 1), ("service", 1), ("city", 1)], unique=True)

    for garment, service, low, high in SEED_PRICING:
        for city in CITIES:
            await db.pricing.update_one(
                {"garment": garment, "service": service, "city": city},
                {"$setOnInsert": {"garment": garment, "service": service, "city": city,
                                  "min_price": low, "max_price": high, "updated_at": now_iso()}},
                upsert=True,
            )

    first_tailor_id = None
    for name, email, city, specialities in SEED_TAILORS:
        await db.tailors.update_one(
            {"email": email},
            {"$setOnInsert": {"name": name, "email": email, "city": city, "specialities": specialities,
                              "active": True, "created_at": now_iso()}},
            upsert=True,
        )
        tailor = await db.tailors.find_one({"email": email})
        tailor_id = str(tailor["_id"])
        if first_tailor_id is None:
            first_tailor_id = tailor_id
        # open the next 21 days so the public booking flow has real slots to offer
        today = datetime.now(timezone.utc).date()
        for offset in range(1, 22):
            date = (today + timedelta(days=offset)).isoformat()
            await db.availability.update_one(
                {"tailor_id": tailor_id, "date": date},
                {"$setOnInsert": {"slots": DEFAULT_SLOTS, "updated_at": now_iso()}},
                upsert=True,
            )

    await seed_user("ADMIN_EMAIL", "ADMIN_PASSWORD", "admin", "ZYRA Admin")
    await seed_user("EDITOR_EMAIL", "EDITOR_PASSWORD", "editor", "ZYRA Editor")
    await seed_user("VIEWER_EMAIL", "VIEWER_PASSWORD", "viewer", "ZYRA Viewer")
    tailor_email = os.environ.get("TAILOR_EMAIL", "").lower()
    if tailor_email:
        await db.tailors.update_one(
            {"email": tailor_email},
            {"$setOnInsert": {"name": "Independent Tailoring Partner — Delhi", "email": tailor_email,
                              "city": "Delhi", "specialities": GARMENTS[:3], "active": True,
                              "created_at": now_iso()}},
            upsert=True,
        )
        t = await db.tailors.find_one({"email": tailor_email})
        today = datetime.now(timezone.utc).date()
        for offset in range(1, 22):
            await db.availability.update_one(
                {"tailor_id": str(t["_id"]), "date": (today + timedelta(days=offset)).isoformat()},
                {"$setOnInsert": {"slots": DEFAULT_SLOTS, "updated_at": now_iso()}},
                upsert=True,
            )
        await seed_user("TAILOR_EMAIL", "TAILOR_PASSWORD", "tailor",
                        "Independent Tailoring Partner", "Delhi", str(t["_id"]))
    logger.info("Startup seeding complete. Services=%s", len(SERVICES))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
