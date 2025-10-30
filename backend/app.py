from flask import Flask
from flask_restful import Resource, Api
from flask_migrate import Migrate
from config.database import db, bcrypt


app = Flask(__name__)
api = Api(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///volunteer.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

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