from datetime import datetime, timezone
from app import db
from .base import BaseModel

class Participation(BaseModel):
    __tablename__ = "participations"

    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.String(100), db.ForeignKey('events.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    volunteer_hours = db.Column(db.Integer)
    applied_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    approved_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)

    #Relationships
    user = db.relationship("User", back_populates="participations")
    event = db.relationship("Event", back_populates="participations")