from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_current_user, get_jwt_identity
from app.config.database import db
from app.models.events import Event
from app.models.organizations import Organization
from datetime import datetime

class EventManagement(Resource):
    @jwt_required()
    def post(self):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401
        
        if user.role != "organization":
            return {"message": "Only organization accounts can create events."}, 403
        
        organization = Organization.query.filter_by(owner_id=user.id).first()
        if not organization:
            return {"message": "Organization not found."}, 404

        data = request.get_json()

        title = data.get("title")
        description = data.get("description")
        location = data.get("location")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        max_participants = data.get("max_participants")

        if not all([title, description, location, start_time, end_time, max_participants]):
            return {"message": "All fields are required."}, 400

        try:
            start_time = datetime.fromisoformat(start_time)
            end_time = datetime.fromisoformat(end_time)
        except ValueError:
            return {"message": "Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SS)."}, 400

        if end_time <= start_time:
            return {"message": "End time must be after start time."}, 400

        event = Event(
            organization_id=organization.id,
            title=title,
            description=description,
            location=location,
            start_time=start_time,
            end_time=end_time,
            max_participants=max_participants
        )

        db.session.add(event)
        db.session.commit()

        return {"message": "Event created successfully!"}, 201


    def get(self):
        events = Event.query.all()

        if not events:
            return {"message": "No events found for this organization."}, 404

        result = []
        for e in events:
            result.append({
                "id": e.id,
                "title": e.title,
                "description": e.description,
                "location": e.location,
                "start_time": e.start_time.isoformat(),
                "end_time": e.end_time.isoformat(),
                "max_participants": e.max_participants,
                "created_at": e.created_at.isoformat(),
                "updated_at": e.updated_at.isoformat()
            })

        return jsonify({
            "message": "Events retrieved successfully.",
            "events": result
        })
