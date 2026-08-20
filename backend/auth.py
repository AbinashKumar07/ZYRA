"""Authentication + single-decision RBAC authorization for the ZYRA admin surface.

One shared organisation (no tenancy). Layer 1 = role/action. Layer 3 = object
ownership, used for tailors acting on their own bookings only.
"""
import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from bson import ObjectId
from fastapi import Depends, HTTPException, Request

JWT_ALGORITHM = "HS256"
TOKEN_HOURS = 8

PERMISSIONS = {
    "admin": {
        "leads:read", "leads:write",
        "content:read", "content:write",
        "bookings:read", "bookings:write",
        "tailors:read", "tailors:write",
        "pricing:read", "pricing:write",
        "team:read", "team:write",
    },
    "editor": {"leads:read", "content:read", "content:write", "bookings:read", "pricing:read", "tailors:read"},
    "viewer": {"leads:read", "content:read", "bookings:read", "tailors:read", "pricing:read", "team:read"},
    "tailor": {"bookings:read_own", "bookings:respond", "availability:write"},
}

FORBIDDEN = "forbidden"
NOT_VISIBLE = "not_visible"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _bearer(request: Request) -> str | None:
    token = request.cookies.get("access_token")
    if token:
        return token
    header = request.headers.get("Authorization", "")
    return header[7:] if header.startswith("Bearer ") else None


async def get_principal(request: Request) -> dict:
    """Build the principal from the verified token, re-reading the role from the DB
    so a revoked or changed role takes effect immediately."""
    token = _bearer(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access" or not ObjectId.is_valid(payload.get("sub", "")):
        raise HTTPException(status_code=401, detail="Invalid token")

    db = request.app.state.db
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or not user.get("active", True) or user.get("role") not in PERMISSIONS:
        raise HTTPException(status_code=401, detail="Account is not active")
    return {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
        "role": user["role"],
        "city": user.get("city"),
        "tailor_id": user.get("tailor_id"),
        "permissions": sorted(PERMISSIONS[user["role"]]),
    }


def authorize(principal: dict, action: str, resource: dict | None = None) -> str | None:
    """Deny-by-default. Returns None on allow, or a denial kind."""
    perms = PERMISSIONS.get(principal.get("role"))
    if not perms or action not in perms:
        return FORBIDDEN
    if resource is not None and action in ("bookings:read_own", "bookings:respond"):
        # Layer 3: a tailor may only touch bookings offered to them.
        assigned = resource.get("tailor_id")
        if assigned and assigned != principal.get("tailor_id"):
            return NOT_VISIBLE
        if not assigned and resource.get("city") != principal.get("city"):
            return NOT_VISIBLE
    return None


def _raise(kind: str):
    if kind == NOT_VISIBLE:
        raise HTTPException(status_code=404, detail="Not found")
    raise HTTPException(status_code=403, detail="You don't have permission to do that")


async def audit_denial(db, principal: dict, action: str, resource_id: str | None, reason: str):
    await audit(db, principal, action, resource_id, False, reason)


def require(action: str):
    """Route dependency. Un-annotated routes get no access by construction."""

    async def dependency(principal: dict = Depends(get_principal)) -> dict:
        denial = authorize(principal, action)
        if denial:
            _raise(denial)
        return principal

    return dependency


def require_object(principal: dict, action: str, resource: dict | None):
    if resource is None:
        raise HTTPException(status_code=404, detail="Not found")
    denial = authorize(principal, action, resource)
    if denial:
        _raise(denial)


async def audit(db, principal: dict, action: str, resource_id: str | None, allowed: bool, reason: str = ""):
    await db.audit_log.insert_one({
        "user_id": principal.get("user_id"),
        "email": principal.get("email"),
        "role": principal.get("role"),
        "action": action,
        "resource_id": resource_id,
        "allowed": allowed,
        "reason": reason,
        "at": datetime.now(timezone.utc).isoformat(),
    })
