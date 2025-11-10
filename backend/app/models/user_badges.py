from datetime import datetime, timezone
from app.config.database import db
from .base import BaseModel

class UserBadge(BaseModel):
    __tablename__ = "user_badges"

    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.String(100), db.ForeignKey('badges.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    event_id = db.Column(db.String(100), db.ForeignKey('events.id'), nullable=True)

    # Relationships
    user = db.relationship("User", back_populates="user_badges")
    badge = db.relationship("Badge", back_populates="user_badges")
    event = db.relationship("Event", back_populates="user_badges")

    def __repr__(self):
        return f"<UserBadge user={self.user_id} badge={self.badge_id}>"