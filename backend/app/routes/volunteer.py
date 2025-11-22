from datetime import datetime, timezone
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required, get_current_user
from flask import jsonify
from app.models.events import Event
from app.models.participations import Participation
from app.models.time_logs import TimeLog
from app.config.database import db


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
            # Check if there's an active time log session (checked in but not checked out)
            active_log = TimeLog.query.filter_by(
                participation_id=p.id, check_out_time=None
            ).first()
            
            events_data.append(
                {
                    "participation_id": p.id,
                    "event_id": e.id,
                    "organization_id": e.organization_id,
                    "title": e.title,
                    "description": e.description,
                    "location": e.location,
                    "start_time": e.start_time.isoformat(),
                    "end_time": e.end_time.isoformat(),
                    "status": p.status,  # Applied / Approved / Completed
                    "volunteer_hours": float(p.volunteer_hours or 0),
                    "is_checked_in": active_log is not None,
                    "applied_at": p.applied_at.isoformat() if p.applied_at else None,
                    "approved_at": p.approved_at.isoformat() if p.approved_at else None,
                    "completed_at": (
                        p.completed_at.isoformat() if p.completed_at else None
                    ),
                }
            )

        return {
            "message": "Volunteer events retrieved successfully",
            "count": len(events_data),
            "events": events_data,
        }, 200


class VolunteerCheckIn(Resource):
    @jwt_required()
    def post(self, participation_id):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401

        # 1. Get Participation Record
        participation = Participation.query.get(participation_id)
        if not participation:
            return {"message": "Participation record not found."}, 404

        # 2. Security: Ensure user owns this participation
        if participation.user_id != user.id:
            return {
                "message": "Unauthorized. You can only check in to your own events."
            }, 403

        # 3. Status Guard: Must be approved
        if participation.status != "approved":
            return {
                "message": f"Cannot check in. Your application status is {participation.status}."
            }, 400

        # 4. Prevent Double Check-in
        # Look for a TimeLog for this participation that has NO check_out_time
        active_log = TimeLog.query.filter_by(
            participation_id=participation_id, check_out_time=None
        ).first()

        if active_log:
            return {
                "message": "You are already checked in. Please check out first."
            }, 409

        # 5. Create New TimeLog
        # We deliberately explicitly fill user_id and event_id for the analytics benefits
        new_log = TimeLog(
            participation_id=participation.id,
            user_id=participation.user_id,
            event_id=participation.event_id,
            check_in_time=datetime.now(timezone.utc),
        )

        db.session.add(new_log)
        db.session.commit()

        return {
            "message": "Checked in successfully!",
            "session_id": new_log.id,
            "start_time": new_log.check_in_time.isoformat(),
        }, 201


class VolunteerCheckOut(Resource):
    @jwt_required()
    def post(self, participation_id):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401

        # 1. Get Participation
        participation = Participation.query.get(participation_id)
        if not participation:
            return {"message": "Participation record not found."}, 404

        if participation.user_id != user.id:
            return {"message": "Unauthorized."}, 403

        # 2. Find the Active Session
        active_log = TimeLog.query.filter_by(
            participation_id=participation_id, check_out_time=None
        ).first()

        if not active_log:
            return {"message": "You are not checked in."}, 400

        # 3. Calculate Duration
        now = datetime.now(timezone.utc)
        check_in = active_log.check_in_time
        if check_in.tzinfo is None:
            check_in = check_in.replace(tzinfo=timezone.utc)

        duration = now - check_in

        # Convert seconds to hours (float)
        hours_worked = duration.total_seconds() / 3600

        # 4. Sanity Check (Anti-Abuse)
        # If a user forgets to checkout and does so 3 days later, cap it at 12 hours
        if hours_worked > 12:
            hours_worked = 12.0

        # If they check out instantly (e.g. accidental click), ensure at least 0.01 or 0
        if hours_worked < 0:
            hours_worked = 0

        # 5. Update The TimeLog (Close the session)
        active_log.check_out_time = now
        active_log.hours_worked = round(hours_worked, 2)

        # 6. Update Participation Running Total
        # We treat participation.volunteer_hours as a cache
        current_event_total = float(participation.volunteer_hours or 0)
        participation.volunteer_hours = current_event_total + hours_worked

        # 7. Update User Grand Total
        current_user_total = float(user.total_volunteer_hours or 0)
        user.total_volunteer_hours = current_user_total + hours_worked

        # 8. Gamification Trigger
        # new_badges = check_and_award_badges(user)

        db.session.commit()

        return {
            "message": "Checked out successfully!",
            "session_hours": float(active_log.hours_worked),
            "event_total_hours": float(participation.volunteer_hours),
            "user_total_hours": float(user.total_volunteer_hours),
        }, 200
