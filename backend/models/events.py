from datetime import datetime, timezone
from app import db
from .base import BaseModel

class Event(BaseModel):
    __tablename__ = "events"

    organization_id = db.Column(db.String(100), db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    max_participants = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

   
    organization = db.relationship("Organization", back_populates="events")
    participations = db.relationship("Participation", back_populates="event", lazy=True)
    user_badges = db.relationship("UserBadge", back_populates="event", lazy=True)