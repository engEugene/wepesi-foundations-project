from flask import Flask
from flask_restful import Resource, Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config.database import db, bcrypt


app = Flask(__name__)
api = Api(app)

#temp database configurations
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///volunteer.db" 
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = "super-secret" # will later change this 
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token"
app.config["JWT_REFRESH_COOKIE_NAME"] = "refresh_token"
app.config["JWT_COOKIE_SECURE"] = False                    
app.config["JWT_COOKIE_SAMESITE"] = "None"                 
app.config["JWT_COOKIE_HTTPONLY"] = True                   
app.config["JWT_COOKIE_CSRF_PROTECT"] = False

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


# import models for migrations to run
from models.users import User
from models.organizations import Organization
from models.events import Event
from models.participations import Participation
from models.badges import Badge
from models.user_badges import UserBadge

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]        
    return User.query.get(identity)

# import route resources
from routes.auth import RegisterUser, LoginUser, LogoutUser, OnboardOrganisation


# authentication resource registrations
api.add_resource(RegisterUser, '/api/auth/register')
api.add_resource(LoginUser, '/api/auth/login')
api.add_resource(LogoutUser, '/api/auth/logout')
api.add_resource(OnboardOrganisation, '/api/auth/onboard-organization')



if __name__ == '__main__':
    app.run(debug=True)