from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_current_user, get_jwt_identity
from app.config.database import db
from app.models.events import Event
from app.models.participations import Participation
from app.models.organizations import Organization
from datetime import datetime, timezone

class ApplyToEvent(Resource):
    @jwt_required()
    def post(self, event_id):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401
        
        if user.role != "volunteer":
            return {"message": "Only volunteers can apply to events."}, 403

        event = Event.query.get(event_id)
        if not event:
            return {"message": "Event not found."}, 404

        # Check if user already applied
        existing = Participation.query.filter_by(
            user_id=user.id,
            event_id=event_id
        ).first()
        
        if existing:
            return {"message": "You have already applied to this event."}, 409

        # Check if event has space
        current_participants = Participation.query.filter_by(
            event_id=event_id,
            status="approved"
        ).count()
        
        if current_participants >= event.max_participants:
            return {"message": "Event is full."}, 400

        # Create participation
        participation = Participation(
            user_id=user.id,
            event_id=event_id,
            status="pending"
        )

        db.session.add(participation)
        db.session.commit()

        return {"message": "Application submitted successfully!"}, 201


class ApproveParticipation(Resource):
    @jwt_required()
    def put(self, participation_id):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401
        
        if user.role != "organization":
            return {"message": "Only organizations can approve applications."}, 403

        organization = Organization.query.filter_by(owner_id=user.id).first()
        if not organization:
            return {"message": "Organization not found."}, 404

        participation = Participation.query.get(participation_id)
        if not participation:
            return {"message": "Participation not found."}, 404

        # Check if event belongs to this organization
        if participation.event.organization_id != organization.id:
            return {"message": "You can only approve applications for your own events."}, 403

        # Check if already approved
        if participation.status == "approved":
            return {"message": "Application already approved."}, 409

        # Check if event still has space
        current_participants = Participation.query.filter_by(
            event_id=participation.event_id,
            status="approved"
        ).count()
        
        if current_participants >= participation.event.max_participants:
            return {"message": "Event is full."}, 400

        # Update participation
        participation.status = "approved"
        participation.approved_at = datetime.now(timezone.utc)

        db.session.commit()

        return {"message": "Application approved successfully!"}, 200

