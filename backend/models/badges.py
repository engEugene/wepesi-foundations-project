from datetime import datetime, timezone
from config.database import db
from .base import BaseModel

class Badge(BaseModel):
    __tablename__ = "badges"

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    criteria = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

   
    user_badges = db.relationship("UserBadge", back_populates="badge", lazy=True)

    def __repr__(self):
        return f"<Badge {self.name}>"