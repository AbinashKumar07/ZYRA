"""Authenticated admin API: leads, CMS content, tailors, availability, pricing, team."""
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request

from auth import PERMISSIONS, audit, get_principal, hash_password, require
from email_service import alert_recipients
from models import (
    CONTENT_TYPES, LEAD_TYPES,
    AvailabilitySet, Booking, ContentCreate, ContentItem, ContentUpdate, Lead, LeadStatusUpdate,
    PriceBandUpsert, ReorderRequest, Tailor, TailorCreate, TeamMemberCreate, now_iso,
)

router = APIRouter()


def _oid(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=404, detail="Not found")
    return ObjectId(value)


@router.get("/me")
async def me(principal: dict = Depends(get_principal)):
    return principal


# ---------- Leads ----------
@router.get("/leads")
async def list_leads(request: Request, type: str | None = None, principal: dict = Depends(require("leads:read"))):
    db = request.app.state.db
    query = {"type": type} if type in LEAD_TYPES else {}
    docs = await db.leads.find(query).sort("created_at", -1).to_list(500)
    return [Lead.from_mongo(d).model_dump() for d in docs]


@router.get("/stats")
async def stats(request: Request, principal: dict = Depends(require("leads:read"))):
    db = request.app.state.db
    counts = {t: await db.leads.count_documents({"type": t}) for t in LEAD_TYPES}
    counts["total"] = sum(counts.values())
    counts["bookings"] = await db.bookings.count_documents({})
    counts["bookings_awaiting"] = await db.bookings.count_documents({"status": "awaiting_tailor"})
    counts["alert_recipients"] = len(alert_recipients())
    return counts


@router.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, payload: LeadStatusUpdate, request: Request,
                      principal: dict = Depends(require("leads:write"))):
    db = request.app.state.db
    res = await db.leads.update_one({"_id": _oid(lead_id)}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    await audit(db, principal, "leads:write", lead_id, True, f"status={payload.status}")
    return {"id": lead_id, "status": payload.status}


# ---------- CMS content ----------
@router.get("/content")
async def list_content(request: Request, type: str | None = None,
                       principal: dict = Depends(require("content:read"))):
    db = request.app.state.db
    query = {"type": type} if type in CONTENT_TYPES else {}
    docs = await db.content.find(query).sort([("type", 1), ("order", 1)]).to_list(2000)
    return [ContentItem.from_mongo(d).model_dump() for d in docs]


@router.post("/content", status_code=201)
async def create_content(payload: ContentCreate, request: Request,
                         principal: dict = Depends(require("content:write"))):
    db = request.app.state.db
    if await db.content.find_one({"type": payload.type, "slug": payload.slug}):
        raise HTTPException(status_code=409, detail=f"A {payload.type} with slug '{payload.slug}' already exists")
    item = ContentItem(**payload.model_dump())
    result = await db.content.insert_one(item.to_mongo())
    await audit(db, principal, "content:write", str(result.inserted_id), True, f"create {payload.type}")
    stored = item.model_dump()
    stored["id"] = str(result.inserted_id)
    return stored


@router.post("/content/bulk", status_code=201)
async def bulk_import(items: list[ContentCreate], request: Request,
                      principal: dict = Depends(require("content:write"))):
    """Import the preview catalogue. Skips any (type, slug) that already exists."""
    db = request.app.state.db
    created = 0
    for payload in items:
        if await db.content.find_one({"type": payload.type, "slug": payload.slug}):
            continue
        await db.content.insert_one(ContentItem(**payload.model_dump()).to_mongo())
        created += 1
    await audit(db, principal, "content:write", None, True, f"bulk import {created}/{len(items)}")
    return {"created": created, "skipped": len(items) - created}


@router.patch("/content/{item_id}")
async def update_content(item_id: str, payload: ContentUpdate, request: Request,
                         principal: dict = Depends(require("content:write"))):
    db = request.app.state.db
    changes = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    if not changes:
        raise HTTPException(status_code=422, detail="Nothing to update")
    changes["updated_at"] = now_iso()
    res = await db.content.find_one_and_update({"_id": _oid(item_id)}, {"$set": changes}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Not found")
    await audit(db, principal, "content:write", item_id, True, f"update {list(changes)}")
    return ContentItem.from_mongo(res).model_dump()


@router.post("/content/reorder")
async def reorder_content(payload: ReorderRequest, request: Request,
                          principal: dict = Depends(require("content:write"))):
    db = request.app.state.db
    for item in payload.items:
        await db.content.update_one({"_id": _oid(item.id)}, {"$set": {"order": item.order, "updated_at": now_iso()}})
    await audit(db, principal, "content:write", None, True, f"reorder {len(payload.items)}")
    return {"updated": len(payload.items)}


@router.delete("/content/{item_id}")
async def delete_content(item_id: str, request: Request, principal: dict = Depends(require("content:write"))):
    db = request.app.state.db
    res = await db.content.delete_one({"_id": _oid(item_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    await audit(db, principal, "content:write", item_id, True, "delete")
    return {"deleted": item_id}


# ---------- Tailors, availability, pricing ----------
@router.get("/tailors")
async def list_tailors(request: Request, principal: dict = Depends(require("tailors:read"))):
    db = request.app.state.db
    docs = await db.tailors.find().sort("name", 1).to_list(300)
    out = []
    for d in docs:
        t = Tailor.from_mongo(d).model_dump()
        t["open_dates"] = await db.availability.count_documents({"tailor_id": t["id"], "slots": {"$ne": []}})
        out.append(t)
    return out


@router.post("/tailors", status_code=201)
async def create_tailor(payload: TailorCreate, request: Request,
                        principal: dict = Depends(require("tailors:write"))):
    db = request.app.state.db
    email = payload.email.lower()
    if await db.tailors.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="A tailoring partner with that email already exists")
    tailor = Tailor(**{**payload.model_dump(), "email": email})
    result = await db.tailors.insert_one(tailor.to_mongo())
    await audit(db, principal, "tailors:write", str(result.inserted_id), True, "create tailor")
    stored = tailor.model_dump()
    stored["id"] = str(result.inserted_id)
    return stored


@router.patch("/tailors/{tailor_id}")
async def toggle_tailor(tailor_id: str, request: Request, active: bool,
                        principal: dict = Depends(require("tailors:write"))):
    db = request.app.state.db
    res = await db.tailors.update_one({"_id": _oid(tailor_id)}, {"$set": {"active": active}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    await audit(db, principal, "tailors:write", tailor_id, True, f"active={active}")
    return {"id": tailor_id, "active": active}


@router.put("/tailors/{tailor_id}/availability")
async def set_tailor_availability(tailor_id: str, payload: AvailabilitySet, request: Request,
                                  principal: dict = Depends(require("tailors:write"))):
    db = request.app.state.db
    if not await db.tailors.find_one({"_id": _oid(tailor_id)}):
        raise HTTPException(status_code=404, detail="Not found")
    await db.availability.update_one(
        {"tailor_id": tailor_id, "date": payload.date},
        {"$set": {"slots": payload.slots, "updated_at": now_iso()}},
        upsert=True,
    )
    return {"tailor_id": tailor_id, "date": payload.date, "slots": payload.slots}


@router.get("/pricing")
async def list_pricing(request: Request, principal: dict = Depends(require("pricing:read"))):
    db = request.app.state.db
    docs = await db.pricing.find({}, {"_id": 0}).to_list(500)
    return docs


@router.put("/pricing")
async def upsert_pricing(payload: PriceBandUpsert, request: Request,
                         principal: dict = Depends(require("pricing:write"))):
    db = request.app.state.db
    if payload.max_price < payload.min_price:
        raise HTTPException(status_code=422, detail="Maximum must be greater than the minimum")
    await db.pricing.update_one(
        {"garment": payload.garment, "service": payload.service, "city": payload.city},
        {"$set": {**payload.model_dump(), "updated_at": now_iso()}},
        upsert=True,
    )
    await audit(db, principal, "pricing:write", None, True, f"{payload.garment}/{payload.service}/{payload.city}")
    return payload.model_dump()


# ---------- Bookings (read across all; tailors respond via /tailor) ----------
@router.get("/bookings")
async def list_bookings(request: Request, status: str | None = None,
                        principal: dict = Depends(require("bookings:read"))):
    db = request.app.state.db
    query = {"status": status} if status else {}
    docs = await db.bookings.find(query).sort("created_at", -1).to_list(500)
    return [Booking.from_mongo(d).model_dump() for d in docs]


# ---------- Team ----------
@router.get("/team")
async def list_team(request: Request, principal: dict = Depends(require("team:read"))):
    db = request.app.state.db
    docs = await db.users.find({}, {"password_hash": 0}).sort("email", 1).to_list(200)
    return [{"id": str(d["_id"]), "email": d["email"], "name": d.get("name"), "role": d.get("role"),
             "city": d.get("city"), "active": d.get("active", True)} for d in docs]


@router.post("/team", status_code=201)
async def create_team_member(payload: TeamMemberCreate, request: Request,
                             principal: dict = Depends(require("team:write"))):
    db = request.app.state.db
    if payload.role not in PERMISSIONS:
        raise HTTPException(status_code=422, detail="Unknown role")
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="That email already has an account")
    doc = {
        "email": email, "name": payload.name, "role": payload.role, "city": payload.city,
        "password_hash": hash_password(payload.password), "active": True, "created_at": now_iso(),
    }
    if payload.role == "tailor":
        tailor = await db.tailors.find_one({"email": email})
        if not tailor:
            raise HTTPException(status_code=422, detail="Create the tailoring partner record first, using the same email")
        doc["tailor_id"] = str(tailor["_id"])
        doc["city"] = tailor["city"]
    result = await db.users.insert_one(doc)
    await audit(db, principal, "team:write", str(result.inserted_id), True, f"create {payload.role}")
    return {"id": str(result.inserted_id), "email": email, "role": payload.role}


@router.patch("/team/{user_id}")
async def set_member_active(user_id: str, request: Request, active: bool,
                            principal: dict = Depends(require("team:write"))):
    db = request.app.state.db
    if user_id == principal["user_id"]:
        raise HTTPException(status_code=422, detail="You cannot deactivate your own account")
    res = await db.users.update_one({"_id": _oid(user_id)}, {"$set": {"active": active}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    await audit(db, principal, "team:write", user_id, True, f"active={active}")
    return {"id": user_id, "active": active}
