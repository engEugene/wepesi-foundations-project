from datetime import datetime, timezone
from app.config.database import db
from .base import BaseModel


class TimeLog(BaseModel):
    __tablename__ = "time_logs"

    participation_id = db.Column(db.String(100), db.ForeignKey('participations.id'), nullable=False)
    user_id = db.Column(db.String(100), db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.String(100), db.ForeignKey('events.id'), nullable=False)
    check_in_time = db.Column(db.DateTime, nullable=False)
    check_out_time = db.Column(db.DateTime, nullable=True)
    hours_worked = db.Column(db.Numeric(5, 2), default=0.00)
    
    participation = db.relationship("Participation", back_populates="time_logs")
    user = db.relationship("User", back_populates="time_logs")
    event = db.relationship("Event", back_populates="time_logs")

    def __repr__(self):
        return f"<TimeLog user={self.user_id} event={self.event_id} hours={self.hours_worked}>"