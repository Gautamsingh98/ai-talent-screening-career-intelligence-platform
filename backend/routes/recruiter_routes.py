from flask import Blueprint, jsonify, request
from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


recruiter_bp = Blueprint("recruiter", __name__)


# =========================
# RECRUITER DASHBOARD
# =========================

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

    # =========================
    # CHECK RECRUITER ROLE
    # =========================

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can create jobs"
        }), 403


    # =========================
    # GET REQUEST DATA
    # =========================

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "Request body is required"
        }), 400


    title = data.get("title")
    description = data.get("description")
    required_skills = data.get("required_skills")
    experience = data.get("experience")
    location = data.get("location")
    salary = data.get("salary")


    # =========================
    # VALIDATION
    # =========================

    if not title or not description:

        return jsonify({
            "message": "Title and description are required"
        }), 400


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


        # =========================
        # SUCCESS RESPONSE
        # =========================

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


# =========================
# GET RECRUITER JOBS
# =========================

@recruiter_bp.route("/jobs", methods=["GET"])
@token_required
def get_recruiter_jobs():

    # =========================
    # CHECK RECRUITER ROLE
    # =========================

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
# GET RECRUITER APPLICANTS
# =========================

@recruiter_bp.route("/applicants", methods=["GET"])
@token_required
def get_applicants():

    # =========================
    # CHECK RECRUITER ROLE
    # =========================

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can access applicants"
        }), 403


    connection = None
    cursor = None


    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)


        # =========================
        # GET APPLICANTS
        # =========================

        cursor.execute(
            """
            SELECT
                applications.id,
                users.name AS candidate_name,
                users.email AS candidate_email,
                jobs.title AS job_title,
                applications.status,
                applications.applied_at

            FROM applications

            INNER JOIN users
                ON applications.candidate_id = users.id

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            WHERE jobs.recruiter_id = %s

            ORDER BY applications.applied_at DESC
            """,
            (request.user["user_id"],)
        )


        applicants = cursor.fetchall()


        return jsonify({
            "applicants": applicants
        }), 200


    except Exception as e:

        return jsonify({
            "message": "Failed to fetch applicants",
            "error": str(e)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================
# UPDATE APPLICATION STATUS
# =========================

@recruiter_bp.route(
    "/applicants/<int:application_id>/status",
    methods=["PUT"]
)
@token_required
def update_application_status(application_id):

    # =========================
    # CHECK RECRUITER ROLE
    # =========================

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can update application status"
        }), 403


    # =========================
    # GET REQUEST DATA
    # =========================

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "Request body is required"
        }), 400


    status = data.get("status")


    # =========================
    # VALID STATUSES
    # =========================

    allowed_statuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Hired"
    ]


    if status not in allowed_statuses:

        return jsonify({
            "message": "Invalid application status"
        }), 400


    connection = None
    cursor = None


    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)


        # =========================
        # CHECK APPLICATION
        # =========================

        cursor.execute(
            """
            SELECT
                applications.id,
                applications.job_id,
                jobs.recruiter_id

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            WHERE applications.id = %s
            """,
            (application_id,)
        )


        application = cursor.fetchone()


        if not application:

            return jsonify({
                "message": "Application not found"
            }), 404


        # =========================
        # CHECK JOB OWNER
        # =========================

        if application["recruiter_id"] != request.user["user_id"]:

            return jsonify({
                "message": "You cannot update this application"
            }), 403


        # =========================
        # UPDATE STATUS
        # =========================

        cursor.execute(
            """
            UPDATE applications

            SET status = %s

            WHERE id = %s
            """,
            (
                status,
                application_id
            )
        )


        connection.commit()


        # =========================
        # SUCCESS RESPONSE
        # =========================

        return jsonify({

            "message": "Application status updated successfully",

            "application_id": application_id,

            "status": status

        }), 200


    except Exception as e:

        if connection:
            connection.rollback()


        return jsonify({

            "message": "Failed to update application status",

            "error": str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================
# VIEW CANDIDATE RESUME
# =========================

@recruiter_bp.route(
    "/applicants/<int:application_id>/resume",
    methods=["GET"]
)
@token_required
def view_candidate_resume(application_id):

    # =========================
    # CHECK RECRUITER ROLE
    # =========================

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can view candidate resumes"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # =========================
        # GET CANDIDATE RESUME
        # =========================

        cursor.execute(
            """
            SELECT
                applications.id AS application_id,
                users.id AS candidate_id,
                users.name AS candidate_name,
                users.email AS candidate_email,
                resumes.original_filename,
                resumes.filename,
                resumes.uploaded_at

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            INNER JOIN users
                ON applications.candidate_id = users.id

            LEFT JOIN resumes
                ON resumes.user_id = users.id

            WHERE applications.id = %s
            AND jobs.recruiter_id = %s
            """,
            (
                application_id,
                request.user["user_id"]
            )
        )

        resume = cursor.fetchone()

        if not resume:

            return jsonify({
                "message": "Application or resume not found"
            }), 404

        return jsonify({
            "resume": resume
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch candidate resume",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()