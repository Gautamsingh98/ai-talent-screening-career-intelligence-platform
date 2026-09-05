from flask import Blueprint, jsonify, request, send_file
import os

from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required
from job_matcher import calculate_job_match


recruiter_bp = Blueprint("recruiter", __name__)


# =========================================================
# RECRUITER DASHBOARD
# =========================================================

@recruiter_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_dashboard():

    connection = None
    cursor = None

    try:
        # Connect to database
        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]

        # =====================================================
        # JOBS POSTED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_jobs
            FROM jobs
            WHERE recruiter_id = %s
            """,
            (recruiter_id,)
        )

        jobs_result = cursor.fetchone()

        jobs_posted = jobs_result["total_jobs"] or 0

        # =====================================================
        # TOTAL APPLICANTS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_applicants
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            """,
            (recruiter_id,)
        )

        applicants_result = cursor.fetchone()

        applicants = applicants_result["total_applicants"] or 0

        # =====================================================
        # SHORTLISTED CANDIDATES
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_shortlisted
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Shortlisted'
            """,
            (recruiter_id,)
        )

        shortlisted_result = cursor.fetchone()

        shortlisted = shortlisted_result["total_shortlisted"] or 0

        # =====================================================
        # HIRED CANDIDATES
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_hired
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Hired'
            """,
            (recruiter_id,)
        )

        hired_result = cursor.fetchone()

        hired = hired_result["total_hired"] or 0

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message": "Recruiter dashboard data fetched successfully",

            "jobs_posted": jobs_posted,

            "applicants": applicants,

            "shortlisted": shortlisted,

            "hired": hired

        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch recruiter dashboard data",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# RECRUITER DASHBOARD CHART DATA
# =========================================================

@recruiter_bp.route("/dashboard/charts", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_dashboard_charts():

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]

        # =====================================================
        # APPLICATIONS TREND - LAST 6 MONTHS
        # =====================================================

        cursor.execute(
            """
            SELECT
                DATE_FORMAT(applications.applied_at, '%b') AS month,
                COUNT(*) AS applications
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.applied_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 6 MONTH
            )
            GROUP BY
                YEAR(applications.applied_at),
                MONTH(applications.applied_at),
                DATE_FORMAT(applications.applied_at, '%b')
            ORDER BY
                YEAR(applications.applied_at),
                MONTH(applications.applied_at)
            """,
            (recruiter_id,)
        )

        application_data = cursor.fetchall()

        # =====================================================
        # HIRING SUCCESS - HIRED CANDIDATES BY JOB
        # =====================================================

        cursor.execute(
            """
            SELECT
                jobs.title AS role,
                COUNT(applications.id) AS hired
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Hired'
            GROUP BY jobs.id, jobs.title
            ORDER BY hired DESC
            """,
            (recruiter_id,)
        )

        hiring_data = cursor.fetchall()

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({
            "message": "Recruiter dashboard chart data fetched successfully",
            "application_data": application_data,
            "hiring_data": hiring_data
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch recruiter dashboard chart data",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# CREATE JOB
# =========================================================

@recruiter_bp.route("/jobs", methods=["POST"])
@token_required
def create_job():

    # Check recruiter role
    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can create jobs"
        }), 403

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

    # Validation
    if not title or not description:

        return jsonify({
            "message": "Title and description are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

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


# =========================================================
# GET RECRUITER JOBS
# =========================================================

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
        jobs.id,
        jobs.title,
        jobs.description,
        jobs.required_skills,
        jobs.experience,
        jobs.location,
        jobs.salary,
        jobs.status,
        jobs.created_at,

        COUNT(applications.id) AS applications

    FROM jobs

    LEFT JOIN applications
        ON applications.job_id = jobs.id

    WHERE jobs.recruiter_id = %s

    GROUP BY
        jobs.id,
        jobs.title,
        jobs.description,
        jobs.required_skills,
        jobs.experience,
        jobs.location,
        jobs.salary,
        jobs.status,
        jobs.created_at

    ORDER BY jobs.created_at DESC
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


# =========================================================
# GET RECRUITER APPLICANTS
# =========================================================

@recruiter_bp.route("/applicants", methods=["GET"])
@token_required
def get_applicants():

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can access applicants"
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


# =========================================================
# UPDATE APPLICATION STATUS
# =========================================================

@recruiter_bp.route(
    "/applicants/<int:application_id>/status",
    methods=["PUT"]
)
@token_required
def update_application_status(application_id):

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can update application status"
        }), 403

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "Request body is required"
        }), 400

    status = data.get("status")

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

        if application["recruiter_id"] != request.user["user_id"]:

            return jsonify({
                "message": "You cannot update this application"
            }), 403

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


# =========================================================
# VIEW CANDIDATE RESUME INFORMATION
# =========================================================

@recruiter_bp.route(
    "/applicants/<int:application_id>/resume",
    methods=["GET"]
)
@token_required
def view_candidate_resume(application_id):

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can view candidate resumes"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # GET CANDIDATE + JOB + RESUME INFORMATION
        # =====================================================

        cursor.execute(
            """
            SELECT
                applications.id AS application_id,
                applications.status AS application_status,

                users.id AS candidate_id,
                users.name AS candidate_name,
                users.email AS candidate_email,

                jobs.id AS job_id,
                jobs.title AS job_title,
                jobs.required_skills,

                resumes.original_filename,
                resumes.stored_filename,
                resumes.file_path,
                resumes.extracted_text,
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

            ORDER BY resumes.uploaded_at DESC

            LIMIT 1
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

        # =====================================================
        # EXTRACT SKILLS FROM RESUME
        # =====================================================

        extracted_text = resume["extracted_text"] or ""

        skill_list = [
            "Python",
            "Java",
            "JavaScript",
            "React",
            "Node.js",
            "HTML",
            "CSS",
            "SQL",
            "MySQL",
            "MongoDB",
            "Pandas",
            "NumPy",
            "Matplotlib",
            "Scikit-learn",
            "Machine Learning",
            "Deep Learning",
            "Artificial Intelligence",
            "Data Science",
            "Flask",
            "Django",
            "Git",
            "GitHub",
            "Docker",
            "AWS"
        ]

        resume_skills = []

        for skill in skill_list:

            if skill.lower() in extracted_text.lower():

                resume_skills.append(skill)

        # =====================================================
        # CALCULATE JOB MATCH
        # =====================================================

        match_result = calculate_job_match(
            resume_skills,
            resume["required_skills"]
        )

        # =====================================================
        # ADD MATCH INFORMATION
        # =====================================================

        resume["match_percentage"] = (
            match_result["match_percentage"]
        )

        resume["matched_skills"] = (
            match_result["matched_skills"]
        )

        resume["missing_skills"] = (
            match_result["missing_skills"]
        )

        # Remove extracted text from response
        # because frontend does not need the full resume text
        resume.pop("extracted_text", None)

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Candidate resume and match information fetched successfully",

            "resume": resume

        }), 200

    except Exception as e:

        return jsonify({

            "message":
                "Failed to fetch candidate resume",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# VIEW / OPEN CANDIDATE RESUME FILE
# =========================================================

@recruiter_bp.route(
    "/applicants/<int:application_id>/resume/file",
    methods=["GET"]
)
@token_required
def view_candidate_resume_file(application_id):

    # Check recruiter role
    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can view candidate resumes"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Get resume file path
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                resumes.file_path,
                resumes.original_filename

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            INNER JOIN resumes
                ON resumes.user_id = applications.candidate_id

            WHERE applications.id = %s
            AND jobs.recruiter_id = %s

            ORDER BY resumes.uploaded_at DESC

            LIMIT 1
            """,
            (
                application_id,
                request.user["user_id"]
            )
        )

        resume = cursor.fetchone()

        # -------------------------------------------------
        # Resume not found
        # -------------------------------------------------

        if not resume:

            return jsonify({
                "message": "Resume not found"
            }), 404

        file_path = resume["file_path"]

        # -------------------------------------------------
        # Check file path
        # -------------------------------------------------

        if not file_path:

            return jsonify({
                "message": "Resume file path is empty"
            }), 404

        # -------------------------------------------------
        # Check whether file exists
        # -------------------------------------------------

        if not os.path.exists(file_path):

            return jsonify({
                "message": "Resume file does not exist",
                "file_path": file_path
            }), 404

        # -------------------------------------------------
        # Send resume to browser
        # -------------------------------------------------

        return send_file(
            file_path,
            as_attachment=False,
            download_name=resume["original_filename"]
        )

    except Exception as e:

        return jsonify({

            "message": "Failed to open resume",

            "error": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# CANDIDATE RANKING
# =========================================================

@recruiter_bp.route(
    "/jobs/<int:job_id>/ranking",
    methods=["GET"]
)
@token_required
def candidate_ranking(job_id):

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can access candidate ranking"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Get job
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                title,
                required_skills
            FROM jobs
            WHERE id = %s
            AND recruiter_id = %s
            """,
            (
                job_id,
                request.user["user_id"]
            )
        )

        job = cursor.fetchone()

        if not job:

            return jsonify({
                "message": "Job not found or you do not own this job"
            }), 404

        # -------------------------------------------------
        # Get applicants + resumes
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                applications.id AS application_id,
                applications.candidate_id,

                users.name AS candidate_name,
                users.email AS candidate_email,

                resumes.extracted_text

            FROM applications

            INNER JOIN users
                ON applications.candidate_id = users.id

            LEFT JOIN resumes
                ON applications.candidate_id = resumes.user_id

            WHERE applications.job_id = %s

            ORDER BY applications.applied_at DESC
            """,
            (job_id,)
        )

        applicants = cursor.fetchall()

        rankings = []

        # -------------------------------------------------
        # Supported skills
        # -------------------------------------------------

        skill_list = [
            "Python",
            "Java",
            "JavaScript",
            "React",
            "Node.js",
            "HTML",
            "CSS",
            "SQL",
            "MySQL",
            "MongoDB",
            "Pandas",
            "NumPy",
            "Matplotlib",
            "Scikit-learn",
            "Machine Learning",
            "Deep Learning",
            "Artificial Intelligence",
            "Data Science",
            "Flask",
            "Django",
            "Git",
            "GitHub",
            "Docker",
            "AWS"
        ]

        # -------------------------------------------------
        # Calculate ranking
        # -------------------------------------------------

        for applicant in applicants:

            extracted_text = applicant["extracted_text"] or ""

            resume_skills = []

            for skill in skill_list:

                if skill.lower() in extracted_text.lower():

                    resume_skills.append(skill)

            match_result = calculate_job_match(
                resume_skills,
                job["required_skills"]
            )

            rankings.append({

                "application_id":
                    applicant["application_id"],

                "candidate_id":
                    applicant["candidate_id"],

                "candidate_name":
                    applicant["candidate_name"],

                "candidate_email":
                    applicant["candidate_email"],

                "match_percentage":
                    match_result["match_percentage"],

                "matched_skills":
                    match_result["matched_skills"],

                "missing_skills":
                    match_result["missing_skills"]

            })

        # -------------------------------------------------
        # Sort by match percentage
        # -------------------------------------------------

        rankings.sort(
            key=lambda x: x["match_percentage"],
            reverse=True
        )

        # -------------------------------------------------
        # Assign rank
        # -------------------------------------------------

        for index, candidate in enumerate(
            rankings,
            start=1
        ):

            candidate["rank"] = index

        # -------------------------------------------------
        # Return ranking
        # -------------------------------------------------

        return jsonify({

            "message":
                "Candidate ranking generated successfully",

            "job": {

                "id":
                    job["id"],

                "title":
                    job["title"],

                "required_skills":
                    job["required_skills"]

            },

            "candidates":
                rankings

        }), 200

    except Exception as e:

        return jsonify({

            "message":
                "Failed to generate candidate ranking",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# UPDATE JOB
# =========================================================

@recruiter_bp.route(
    "/jobs/<int:job_id>",
    methods=["PUT"]
)
@token_required
def update_job(job_id):

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can update jobs"
        }), 403

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "No data provided"
        }), 400

    title = data.get("title")
    description = data.get("description")
    required_skills = data.get("required_skills")
    experience = data.get("experience")
    location = data.get("location")
    salary = data.get("salary")

    if not title or not description:

        return jsonify({
            "message": "Title and description are required"
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Check job ownership
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            AND recruiter_id = %s
            """,
            (
                job_id,
                request.user["user_id"]
            )
        )

        job = cursor.fetchone()

        if not job:

            return jsonify({
                "message": "Job not found"
            }), 404

        # -------------------------------------------------
        # Update job
        # -------------------------------------------------

        cursor.execute(
            """
            UPDATE jobs
            SET
                title = %s,
                description = %s,
                required_skills = %s,
                experience = %s,
                location = %s,
                salary = %s
            WHERE id = %s
            AND recruiter_id = %s
            """,
            (
                title,
                description,
                required_skills,
                experience,
                location,
                salary,
                job_id,
                request.user["user_id"]
            )
        )

        connection.commit()

        return jsonify({

            "message": "Job updated successfully"

        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        return jsonify({

            "message": "Failed to update job",

            "error": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# DELETE JOB
# =========================================================

@recruiter_bp.route(
    "/jobs/<int:job_id>",
    methods=["DELETE"]
)
@token_required
def delete_job(job_id):

    if request.user["role"] != "Recruiter":

        return jsonify({
            "message": "Only recruiters can delete jobs"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # Check job ownership
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            AND recruiter_id = %s
            """,
            (
                job_id,
                request.user["user_id"]
            )
        )

        job = cursor.fetchone()

        if not job:

            return jsonify({
                "message": "Job not found"
            }), 404

        # -------------------------------------------------
        # Delete job
        # -------------------------------------------------

        cursor.execute(
            """
            DELETE FROM jobs
            WHERE id = %s
            AND recruiter_id = %s
            """,
            (
                job_id,
                request.user["user_id"]
            )
        )

        connection.commit()

        return jsonify({

            "message": "Job deleted successfully"

        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        return jsonify({

            "message": "Failed to delete job",

            "error": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()