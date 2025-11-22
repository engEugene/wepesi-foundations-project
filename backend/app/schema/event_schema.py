from flask_marshmallow import Marshmallow
from app.models.events import Event

ma = Marshmallow()

class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        

event_schema = EventSchema()
events_schema = EventSchema(many=True) 