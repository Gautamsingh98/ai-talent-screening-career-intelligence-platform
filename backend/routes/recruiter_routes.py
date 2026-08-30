from flask import Blueprint, jsonify, request
from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


recruiter_bp = Blueprint("recruiter", __name__)


@recruiter_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_dashboard():

    return jsonify({
        "message": "Recruiter dashboard data",
        "user": request.user
    }), 200

# =========================
# CREATE JOB
# =========================

@recruiter_bp.route("/jobs", methods=["POST"])
@token_required
def create_job():

    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    required_skills = data.get("required_skills")
    experience = data.get("experience")
    location = data.get("location")
    salary = data.get("salary")


# =========================
# GET RECRUITER JOBS
# =========================

@recruiter_bp.route("/jobs", methods=["GET"])
@token_required
def get_recruiter_jobs():

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can access jobs"
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
            WHERE recruiter_id = %s
            ORDER BY created_at DESC
            """,
            (request.user["user_id"],)
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

    # =========================
    # VALIDATION
    # =========================

    if not title or not description:

        return jsonify({
            "message": "Title and description are required"
        }), 400


    # =========================
    # CHECK ROLE
    # =========================

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can create jobs"
        }), 403


    connection = None
    cursor = None


    try:

        connection = get_db_connection()

        cursor = connection.cursor()


        # =========================
        # INSERT JOB
        # =========================

        cursor.execute(
            """
            INSERT INTO jobs
            (
                recruiter_id,
                title,
                description,
                required_skills,
                experience,
                location,
                salary
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                request.user["user_id"],
                title,
                description,
                required_skills,
                experience,
                location,
                salary
            )
        )


        connection.commit()


        return jsonify({

            "message": "Job created successfully",

            "job_id": cursor.lastrowid

        }), 201


    except Exception as e:

        if connection:
            connection.rollback()


        return jsonify({

            "message": "Failed to create job",

            "error": str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()