from datetime import datetime, timezone
from config.database import db
from .base import BaseModel

class Organization(BaseModel):
    __tablename__ = "organizations"

    owner_id = db.Column(db.String(100), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    contact_email = db.Column(db.String(120), unique=True, nullable=False)
    website = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    
    owner = db.relationship("User", back_populates="organizations")
    events = db.relationship("Event", back_populates="organization", lazy=True)

    def __repr__(self):
        return f"<Organization {self.name}>"