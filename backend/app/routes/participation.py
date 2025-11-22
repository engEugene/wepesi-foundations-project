from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_current_user, get_jwt_identity
from app.config.database import db
from app.models.events import Event
from app.models.participations import Participation
from app.models.organizations import Organization
from app.models.users import User
from app.utils.badge_helper import check_and_award_badges
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


class CompleteParticipation(Resource):
    @jwt_required()
    def put(self, participation_id):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401
        
        if user.role != "volunteer":
            return {"message": "Only volunteers can complete events."}, 403

        participation = Participation.query.get(participation_id)
        if not participation:
            return {"message": "Participation not found."}, 404

        # Check if participation belongs to this user
        if participation.user_id != user.id:
            return {"message": "You can only complete your own participations."}, 403

        # Check if participation is approved
        if participation.status != "approved":
            return {"message": "Participation must be approved before completion."}, 400

        # Check if already completed
        if participation.status == "completed":
            return {"message": "Participation already completed."}, 409

        # Get the event
        event = participation.event
        if not event:
            return {"message": "Event not found."}, 404

        # Check if event has ended
        now = datetime.now(timezone.utc)
        if event.end_time > now:
            return {"message": "Event has not ended yet."}, 400

        # Calculate hours from event duration
        event_duration = event.end_time - event.start_time
        hours = event_duration.total_seconds() / 3600  # Convert to hours

        # Update participation
        participation.status = "completed"
        participation.volunteer_hours = int(hours)  # Store as integer
        participation.completed_at = now

        # Update user's total volunteer hours
        current_total = float(user.total_volunteer_hours) if user.total_volunteer_hours else 0
        user.total_volunteer_hours = current_total + hours

        # Check and award badges based on new total hours
        check_and_award_badges(user)

        db.session.commit()

        return {
            "message": "Event completed successfully!",
            "hours_logged": hours,
            "total_hours": float(user.total_volunteer_hours)
        }, 200

class EventApplications(Resource):
    @jwt_required()
    def get(self, event_id):
        user = get_current_user()

        # 1. Security Check: Only organizations can view applicant lists
        if user.role != "organization":
            return {"message": "Access denied. Only organizations can view applications."}, 403

        event = Event.query.get(event_id)
        if not event:
            return {"message": "Event not found."}, 404

        # 2. Ownership Check: Ensure this event belongs to the logged-in user's organization
        if event.organization.owner_id != user.id:
            return {"message": "Unauthorized. You can only view applications for your own events."}, 403

        # 3. Fetch Participations
        # For now, we return ALL applications so you can see pending vs approved
        participations = Participation.query.filter_by(event_id=event_id).all()

        # 4. Serialize Data
        results = []
        for p in participations:
            results.append({
                "participation_id": p.id,  # <--- THIS ID is what you send to the Approve endpoint
                "status": p.status,
                "applied_at": p.applied_at.isoformat() if p.applied_at else None,
                "approved_at": p.approved_at.isoformat() if p.approved_at else None,
                "volunteer": {
                    "id": p.user.id,
                    "name": p.user.name,
                    "email": p.user.email,
                    "phone": p.user.phone_number,
                    "total_hours": float(p.user.total_volunteer_hours or 0)
                }
            })

        return {
            "event_title": event.title,
            "count": len(results),
            "applications": results
        }, 200