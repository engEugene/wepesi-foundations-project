from datetime import datetime, timezone
from app import db

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.String(100), primary_key=True)
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

    # Relationship with Organization model
    organization = db.relationship('Organization', backref='events')