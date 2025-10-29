from flask import Flask
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from config import Config

app = Flask(__name__)
api = Api(app)

# Load configuration from config.py
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

# import models for migrations to run
from models.users import User
from models.organizations import Organization
from models.events import Event
from models.participations import Participation
from models.badges import Badge
from models.user_badges import UserBadge

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)