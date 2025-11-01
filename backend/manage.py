from app.app import create_app
from app.config.database import db
from flask_migrate import Migrate

app = create_app()

migrate = Migrate(app,db)

if __name__ == "__main__": 
    app.run()