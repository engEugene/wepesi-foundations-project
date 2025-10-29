from datetime import datetime, timezone
from app import db, bcrypt
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.Integer, unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(
        db.Enum("volunteer", "organization", "admin", name="user_roles"),
        nullable=False,
        default="volunteer"
    )
    total_volunteer_hours = db.Column(db.Numeric(5,2), default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    
    organizations = db.relationship("Organization", back_populates="owner", lazy=True)
    participations = db.relationship("Participation", back_populates="user", lazy=True)
    user_badges = db.relationship("UserBadge", back_populates="user", lazy=True)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f"<User {self.name} ({self.role})>"
