from flask import request, jsonify
from datetime import timedelta
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_current_user, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, create_refresh_token
from config.database import db
from models.users import User

class RegisterUser(Resource):
    def post(self):
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        username = data.get("username")
        phone_number = data.get("phone_number")
        password = data.get("password")
        role = data.get("role")

        if not name or not email or not username or not password:
            return {"message": "Name, email, username, and password are required."}, 400
  
        if User.query.filter(
            (User.email == email) | (User.username == username)
        ).first():
            return {"message": "User with that email or username already exists."}, 409
        
        user = User(
            name=name,
            email=email,
            username=username,
            phone_number=phone_number,
            role = role
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return {"message": "User registered successfully!"}, 201
        
class LoginUser(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return {"message": "username and password are required."}, 400

        user = User.query.filter(
            User.username == username
        ).first()

        if not user or not user.check_password(password):
            return {"message": "Invalid credentials."}, 401

        response = jsonify({
            "message": "Login successful.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "username": user.username,
                "role": user.role,
                "is_org_onboarded": user.is_org_onboarded
            }})

        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(hours=2)
        )
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=7)
        )
        set_access_cookies(response,access_token)
        set_refresh_cookies(response, refresh_token)
        response.status_code = 200

        return response
    
class LogoutUser(Resource):
    @jwt_required()
    def post(self):
        user = get_current_user()
        current_user_id = get_jwt_identity()

        if user.id != current_user_id:
            return {"message": "Unauthorized"}, 401
        
        response = jsonify({
            "message": f"User logged out successfully"
        })
        unset_jwt_cookies(response)  
        response.status_code = 200
        return response
    
# TODO Refrsh resource 