from flask import Blueprint, jsonify, request
from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


candidate_bp = Blueprint("candidate", __name__)


@candidate_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_dashboard():

    return jsonify({
        "message": "Candidate dashboard data",
        "user": request.user
    }), 200

# =========================
# GET ACTIVE JOBS
# =========================

@candidate_bp.route("/jobs", methods=["GET"])
@token_required
def get_jobs():

    if request.user["role"] != "Candidate":

        return jsonify({
            "message": "Only candidates can access jobs"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                title,
                description,
                required_skills,
                experience,
                location,
                salary,
                status,
                created_at
            FROM jobs
            WHERE status = 'Active'
            ORDER BY created_at DESC
            """
        )

        jobs = cursor.fetchall()

        return jsonify({
            "jobs": jobs
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch jobs",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()