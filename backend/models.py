from datetime import datetime, timezone
from typing import Annotated, Literal, Optional

from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field


def _to_str(v):
    return str(v) if isinstance(v, ObjectId) else v


PyObjectId = Annotated[str, BeforeValidator(_to_str)]

LEAD_TYPES = ("waitlist", "merchant", "investor", "contact")
CONTENT_TYPES = ("product", "pair", "look", "theme", "faq", "home")
LeadType = Literal["waitlist", "merchant", "investor", "contact"]
ContentType = Literal["product", "pair", "look", "theme", "faq", "home"]
Status = Literal["draft", "published", "archived"]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        doc = self.model_dump(by_alias=True, exclude_none=True)
        doc.pop("_id", None)
        return doc

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls.model_validate(doc)


# ---------- Leads ----------
class Lead(BaseDocument):
    type: LeadType
    name: str
    email: str
    phone: Optional[str] = None
    city: Optional[str] = None
    message: Optional[str] = None
    details: dict = Field(default_factory=dict)
    source: str = "website"
    status: str = "new"
    created_at: str = Field(default_factory=now_iso)


class LeadCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    type: LeadType
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    city: Optional[str] = Field(default=None, max_length=80)
    message: Optional[str] = Field(default=None, max_length=2000)
    details: dict = Field(default_factory=dict)
    source: Optional[str] = Field(default="website", max_length=60)


class LeadStatusUpdate(BaseModel):
    status: Literal["new", "reviewed", "contacted", "archived"]


# ---------- CMS content ----------
class ContentItem(BaseDocument):
    type: ContentType
    slug: str
    status: Status = "draft"
    order: int = 0
    data: dict = Field(default_factory=dict)
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class ContentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    type: ContentType
    slug: str = Field(min_length=1, max_length=120, pattern=r"^[a-z0-9][a-z0-9-]*$")
    status: Status = "draft"
    order: int = 0
    data: dict = Field(default_factory=dict)


class ContentUpdate(BaseModel):
    slug: Optional[str] = Field(default=None, min_length=1, max_length=120, pattern=r"^[a-z0-9][a-z0-9-]*$")
    status: Optional[Status] = None
    order: Optional[int] = None
    data: Optional[dict] = None


class ReorderItem(BaseModel):
    id: str
    order: int


class ReorderRequest(BaseModel):
    items: list[ReorderItem]


# ---------- Tailoring ----------
GARMENTS = ["Sherwani", "Suit (2-piece)", "Suit (3-piece)", "Tuxedo", "Bridal Wear", "Kurta Set", "Major Alteration", "Custom Stitching"]
SERVICES = ["Custom Stitching", "Made to Measure", "Major Alteration", "Bridal Fitting"]
MEASUREMENT_METHODS = ["I'll provide my measurements", "Request a measurement visit", "Use an existing garment as reference"]
CITIES = ["Delhi", "Gurugram", "Noida"]


class Tailor(BaseDocument):
    name: str
    email: str
    city: str
    specialities: list[str] = Field(default_factory=list)
    active: bool = True
    created_at: str = Field(default_factory=now_iso)


class TailorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    city: str
    specialities: list[str] = Field(default_factory=list)
    active: bool = True


class Availability(BaseDocument):
    tailor_id: str
    date: str  # ISO date, YYYY-MM-DD
    slots: list[str] = Field(default_factory=list)
    updated_at: str = Field(default_factory=now_iso)


class AvailabilitySet(BaseModel):
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    slots: list[str] = Field(default_factory=list)


class PriceBand(BaseDocument):
    garment: str
    service: str
    city: str
    min_price: int
    max_price: int
    updated_at: str = Field(default_factory=now_iso)


class PriceBandUpsert(BaseModel):
    garment: str
    service: str
    city: str
    min_price: int = Field(ge=0)
    max_price: int = Field(ge=0)


class Booking(BaseDocument):
    reference: str
    name: str
    email: str
    phone: str
    city: str
    garment: str
    service: str
    date: str
    slot: str
    measurement_method: str
    notes: Optional[str] = None
    estimate_min: Optional[int] = None
    estimate_max: Optional[int] = None
    status: str = "awaiting_tailor"  # awaiting_tailor | confirmed | declined | cancelled | completed
    tailor_id: Optional[str] = None
    tailor_name: Optional[str] = None
    declined_by: list[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class BookingCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30)
    city: str
    garment: str
    service: str
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    slot: str
    measurement_method: str
    notes: Optional[str] = Field(default=None, max_length=1000)


class BookingRespond(BaseModel):
    action: Literal["accept", "decline"]


# ---------- Team ----------
ROLES = ("admin", "editor", "viewer", "tailor")


class TeamMemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["admin", "editor", "viewer", "tailor"]
    city: Optional[str] = None
