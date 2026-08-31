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

# =========================
# APPLY FOR JOB
# =========================

@candidate_bp.route("/apply", methods=["POST"])
@token_required
def apply_for_job():

    # =========================
    # CHECK ROLE
    # =========================

    if request.user["role"] != "Candidate":

        return jsonify({
            "message": "Only candidates can apply for jobs"
        }), 403


    data = request.get_json()

    job_id = data.get("job_id")


    # =========================
    # VALIDATE JOB ID
    # =========================

    if not job_id:

        return jsonify({
            "message": "Job ID is required"
        }), 400


    connection = None
    cursor = None


    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)


        # =========================
        # CHECK JOB
        # =========================

        cursor.execute(
            """
            SELECT id, title
            FROM jobs
            WHERE id = %s
            AND status = 'Active'
            """,
            (job_id,)
        )

        job = cursor.fetchone()


        if not job:

            return jsonify({
                "message": "Job not found or inactive"
            }), 404


        # =========================
        # CHECK EXISTING APPLICATION
        # =========================

        cursor.execute(
            """
            SELECT id
            FROM applications
            WHERE candidate_id = %s
            AND job_id = %s
            """,
            (
                request.user["user_id"],
                job_id
            )
        )

        existing_application = cursor.fetchone()


        if existing_application:

            return jsonify({
                "message": "You have already applied for this job"
            }), 409


        # =========================
        # INSERT APPLICATION
        # =========================

        cursor.execute(
            """
            INSERT INTO applications
            (
                candidate_id,
                job_id,
                status
            )
            VALUES (%s, %s, %s)
            """,
            (
                request.user["user_id"],
                job_id,
                "Applied"
            )
        )


        connection.commit()


        return jsonify({

            "message": "Application submitted successfully",

            "application_id": cursor.lastrowid,

            "job": {
                "id": job["id"],
                "title": job["title"]
            }

        }), 201


    except Exception as e:

        if connection:
            connection.rollback()


        return jsonify({

            "message": "Failed to submit application",

            "error": str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================
# GET AVAILABLE JOBS
# =========================

@candidate_bp.route("/jobs", methods=["GET"])
@token_required
def get_available_jobs():

    # =========================
    # CHECK CANDIDATE ROLE
    # =========================

    if request.user["role"] != "Candidate":

        return jsonify({
            "message": "Only candidates can view jobs"
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

# =========================
# GET APPLIED JOBS
# =========================

@candidate_bp.route("/applied-jobs", methods=["GET"])
@token_required
def get_applied_jobs():

    # =========================
    # CHECK CANDIDATE ROLE
    # =========================

    if request.user["role"] != "Candidate":

        return jsonify({
            "message": "Only candidates can access applied jobs"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                applications.id,
                applications.job_id,
                applications.status,
                applications.applied_at,

                jobs.title,
                jobs.description,
                jobs.required_skills,
                jobs.experience,
                jobs.location,
                jobs.salary

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            WHERE applications.candidate_id = %s

            ORDER BY applications.applied_at DESC
            """,
            (request.user["user_id"],)
        )

        applications = cursor.fetchall()

        return jsonify({
            "applications": applications
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch applied jobs",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close() 