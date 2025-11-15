from flask import Flask
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config.database import db, bcrypt

# Models
from .models.users import User
from .models.organizations import Organization
from .models.events import Event
from .models.participations import Participation
from .models.badges import Badge
from .models.user_badges import UserBadge

# Routes
from .routes.auth import RegisterUser, LoginUser, LogoutUser, OnboardOrganisation
from .routes.organization import EventManagement
from .routes.participation import ApplyToEvent, ApproveParticipation, CompleteParticipation

# NEW: Profile Resource
class VolunteerProfile(Resource):
    def get(self):
        # Mock current user ID = 1 (replace with JWT later)
        user = User.query.get(1)
        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user.id,
            "name": user.name,
            "title": user.title or "Volunteer",
            "bio": user.bio or "No bio yet.",
            "hours": user.hours or 0,
            "completedActivities": user.completed_activities or 0,
            "badges": [ub.badge.name for ub in user.user_badges] if user.user_badges else [],
            "avatar": user.avatar or "/static/images/default-avatar.png",
            "impactStats": {
                "treesPlanted": user.trees_planted or 0,
                "workshopsLed": user.workshops_led or 0,
                "plasticCollectedKg": user.plastic_collected_kg or 0
            },
            "socials": {
                "instagram": user.instagram or "",
                "linkedin": user.linkedin or "",
                "x": user.twitter or ""
            }
        }

def create_app(config_class="app.config.settings.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"],  # your React dev URL
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
) 
    

    # Initialize extensions
    
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)
    api = Api(app)
  

    # JWT user loader
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return User.query.get(identity)

    # Register routes
    api.add_resource(RegisterUser, '/api/auth/register')
    api.add_resource(LoginUser, '/api/auth/login')
    api.add_resource(LogoutUser, '/api/auth/logout')
    api.add_resource(OnboardOrganisation, '/api/auth/onboard-organization')
    api.add_resource(EventManagement, '/api/event')
    api.add_resource(ApplyToEvent, '/api/event/<string:event_id>/apply')
    api.add_resource(ApproveParticipation, '/api/participation/<string:participation_id>/approve')
    api.add_resource(CompleteParticipation, '/api/participation/<string:participation_id>/complete')
    
    # NEW: Add Profile Route
    api.add_resource(VolunteerProfile, '/api/profile')

    return app