from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

from database import get_db_connection


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

SECRET_KEY = "your-secret-key-change-this-later"


# =========================
# REGISTER
# =========================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "Candidate")

    if not name or not email or not password:
        return jsonify({
            "message": "Name, email and password are required"
        }), 400

    if role not in ["Candidate", "Recruiter"]:
        return jsonify({
            "message": "Invalid role"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "message": "Email already registered"
            }), 409

        hashed_password = generate_password_hash(password)

        cursor.execute(
            """
            INSERT INTO users
            (name, email, password, role)
            VALUES (%s, %s, %s, %s)
            """,
            (name, email, hashed_password, role)
        )

        connection.commit()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except Exception as e:

        return jsonify({
            "message": "Registration failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================
# LOGIN
# =========================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, name, email, password, role, status
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        if not check_password_hash(
            user["password"],
            password
        ):
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        if user["status"] != "Active":
            return jsonify({
                "message": "Your account is inactive"
            }), 403

        token = jwt.encode(
            {
                "user_id": user["id"],
                "email": user["email"],
                "role": user["role"],
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Login failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()