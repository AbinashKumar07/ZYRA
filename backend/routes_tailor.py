"""Tailoring-partner API. A tailor only ever sees requests offered to them."""
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request

from auth import audit, audit_denial, authorize, require, require_object
from email_service import fire_and_forget, send_booking_alert
from models import AvailabilitySet, Booking, BookingRespond, now_iso

router = APIRouter()


@router.get("/bookings")
async def my_bookings(request: Request, principal: dict = Depends(require("bookings:read_own"))):
    """Open requests in the partner's city plus everything already assigned to them."""
    db = request.app.state.db
    tailor_id = principal.get("tailor_id")
    docs = await db.bookings.find({
        "$or": [
            {"tailor_id": tailor_id},
            {"tailor_id": None, "city": principal.get("city"), "status": "awaiting_tailor",
             "declined_by": {"$ne": tailor_id}},
        ]
    }).sort("date", 1).to_list(300)
    return [Booking.from_mongo(d).model_dump() for d in docs]


@router.get("/availability")
async def my_availability(request: Request, principal: dict = Depends(require("availability:write"))):
    db = request.app.state.db
    docs = await db.availability.find({"tailor_id": principal.get("tailor_id")}, {"_id": 0}).sort("date", 1).to_list(200)
    return docs


@router.put("/availability")
async def set_my_availability(payload: AvailabilitySet, request: Request,
                              principal: dict = Depends(require("availability:write"))):
    db = request.app.state.db
    await db.availability.update_one(
        {"tailor_id": principal.get("tailor_id"), "date": payload.date},
        {"$set": {"slots": payload.slots, "updated_at": now_iso()}},
        upsert=True,
    )
    return {"date": payload.date, "slots": payload.slots}


@router.post("/bookings/{booking_id}/respond")
async def respond(booking_id: str, payload: BookingRespond, request: Request,
                  principal: dict = Depends(require("bookings:respond"))):
    db = request.app.state.db
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=404, detail="Not found")
    doc = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    if doc is not None and authorize(principal, "bookings:respond", doc):
        await audit_denial(db, principal, "bookings:respond", booking_id, "not offered to this partner")
    require_object(principal, "bookings:respond", doc)
    if doc["status"] != "awaiting_tailor":
        raise HTTPException(status_code=409, detail=f"This request is already {doc['status'].replace('_', ' ')}")

    tailor_id = principal.get("tailor_id")
    if payload.action == "decline":
        await db.bookings.update_one(
            {"_id": doc["_id"]},
            {"$addToSet": {"declined_by": tailor_id}, "$set": {"updated_at": now_iso()}},
        )
        await audit(db, principal, "bookings:respond", booking_id, True, "decline")
        return {"id": booking_id, "status": "awaiting_tailor", "your_response": "declined"}

    tailor = await db.tailors.find_one({"_id": ObjectId(tailor_id)}) if ObjectId.is_valid(str(tailor_id)) else None
    if not tailor:
        raise HTTPException(status_code=409, detail="Your partner profile is unavailable. Contact the ZYRA team.")
    updated = await db.bookings.find_one_and_update(
        {"_id": doc["_id"], "status": "awaiting_tailor"},
        {"$set": {"status": "confirmed", "tailor_id": tailor_id,
                  "tailor_name": tailor["name"],
                  "updated_at": now_iso()}},
        return_document=True,
    )
    if not updated:
        raise HTTPException(status_code=409, detail="Another partner accepted this request first")
    booking = Booking.from_mongo(updated).model_dump()
    await audit(db, principal, "bookings:respond", booking_id, True, "accept")
    fire_and_forget(send_booking_alert(
        booking,
        to_customer=True,
        headline="Your custom tailoring appointment is confirmed.",
        note="A ZYRA independent tailoring partner has accepted your request for this date and slot. "
             "The estimate range is indicative and is finalised by the partner after measurements.",
    ))
    return {"id": booking_id, "status": "confirmed", "your_response": "accepted"}
