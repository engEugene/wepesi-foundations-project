from datetime import datetime, timezone
from app import db

class UserBadge(db.Model):
    __tablename__ = "user_badges"

    id = db.Column(db.String(100), primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.String(100), db.ForeignKey('badges.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    event_id = db.Column(db.String(100), db.ForeignKey('events.id'), nullable=True)

    # Relationships
    badge = db.relationship('Badge', backref=db.backref('user_badges', lazy=True))
    user = db.relationship('User', backref=db.backref('user_badges', lazy=True))
    event = db.relationship('Event', backref=db.backref('user_badges', lazy=True))