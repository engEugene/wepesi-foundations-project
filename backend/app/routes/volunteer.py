from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required, get_current_user
from flask import jsonify
from app.models.events import Event
from app.models.participations import Participation

class VolunteerEvents(Resource):
    @jwt_required()
    def get(self):
        """
        Returns all events the current volunteer has participated in,
        including applied, ongoing, or completed events.
        """
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401

        # Ensure the user is a volunteer
        if user.role != "volunteer":
            return {"message": "Only volunteers can access their events."}, 403

        # Fetch all participations of this user
        participations = Participation.query.filter_by(user_id=user.id).all()

        events_data = []
        for p in participations:
            e = p.event
            events_data.append({
                "event_id": e.id,
                "organization_id": e.organization_id,
                "title": e.title,
                "description": e.description,
                "location": e.location,
                "start_time": e.start_time.isoformat(),
                "end_time": e.end_time.isoformat(),
                "status": p.status,  # Applied / Approved / Completed
                "volunteer_hours": p.volunteer_hours,
                "applied_at": p.applied_at.isoformat() if p.applied_at else None,
                "approved_at": p.approved_at.isoformat() if p.approved_at else None,
                "completed_at": p.completed_at.isoformat() if p.completed_at else None
            })

        return {
            "message": "Volunteer events retrieved successfully",
            "count": len(events_data),
            "events": events_data
        }, 200
