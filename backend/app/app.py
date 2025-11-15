from flask import Flask
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
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
    
    # NEW: Add Profile Route
    api.add_resource(VolunteerProfile, '/api/profile')

    return app