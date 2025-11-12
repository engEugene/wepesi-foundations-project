from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config.database import db, bcrypt

from .models.users import User
from .models.organizations import Organization
from .models.events import Event
from .models.participations import Participation
from .models.badges import Badge
from .models.user_badges import UserBadge

from .routes.auth import RegisterUser, LoginUser, LogoutUser, OnboardOrganisation
from .routes.organization import EventManagement
from .routes.participation import ApplyToEvent

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
  

    # Register JWT user loader
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

    return app
