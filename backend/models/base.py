import uuid
from app import db

class BaseModel(db.Model):
    __abstract__ = True  

    id = db.Column(
        db.String(100),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

