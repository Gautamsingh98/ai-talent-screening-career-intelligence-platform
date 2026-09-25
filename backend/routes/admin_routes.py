from flask import Blueprint, jsonify, request

from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required


admin_bp = Blueprint("admin", __name__)

# =========================================================
# ADMIN DASHBOARD
# =========================================================

@admin_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Admin")
def admin_dashboard():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT DATABASE
        # =====================================================

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # 1. TOTAL USERS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_users
            FROM users
            """
        )

        users_result = cursor.fetchone()

        total_users = users_result["total_users"] or 0

        # =====================================================
        # 2. TOTAL CANDIDATES
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_candidates
            FROM users
            WHERE role = 'Candidate'
            """
        )

        candidates_result = cursor.fetchone()

        total_candidates = (
            candidates_result["total_candidates"] or 0
        )

        # =====================================================
        # 3. TOTAL RECRUITERS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_recruiters
            FROM users
            WHERE role = 'Recruiter'
            """
        )

        recruiters_result = cursor.fetchone()

        total_recruiters = (
            recruiters_result["total_recruiters"] or 0
        )

        # =====================================================
        # 4. TOTAL JOBS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_jobs
            FROM jobs
            """
        )

        jobs_result = cursor.fetchone()

        total_jobs = jobs_result["total_jobs"] or 0

        # =====================================================
        # 5. TOTAL APPLICATIONS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_applications
            FROM applications
            """
        )

        applications_result = cursor.fetchone()

        total_applications = (
            applications_result["total_applications"] or 0
        )

        # =====================================================
        # 6. TOTAL HIRED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_hired
            FROM applications
            WHERE status = 'Hired'
            """
        )

        hired_result = cursor.fetchone()

        total_hired = hired_result["total_hired"] or 0

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Admin dashboard data fetched successfully",

            "overview": {

                "total_users":
                    total_users,

                "total_candidates":
                    total_candidates,

                "total_recruiters":
                    total_recruiters,

                "total_jobs":
                    total_jobs,

                "total_applications":
                    total_applications,

                "total_hired":
                    total_hired

            }

        }), 200

    except Exception as e:

        return jsonify({

            "message":
                "Failed to fetch admin dashboard data",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN CHART DATA
# =========================================================

@admin_bp.route("/charts", methods=["GET"])
@token_required
@role_required("Admin")
def admin_charts():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT DATABASE
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # 1. MONTHLY USER GROWTH
        # =====================================================

        cursor.execute(
            """
            SELECT
                DATE_FORMAT(created_at, '%b') AS month,
                COUNT(*) AS users

            FROM users

            WHERE created_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 6 MONTH
            )

            GROUP BY
                YEAR(created_at),
                MONTH(created_at),
                DATE_FORMAT(created_at, '%b')

            ORDER BY
                YEAR(created_at),
                MONTH(created_at)
            """
        )

        user_growth = cursor.fetchall()

        # =====================================================
        # 2. MONTHLY APPLICATIONS
        # =====================================================

        cursor.execute(
            """
            SELECT
                DATE_FORMAT(applications.applied_at, '%b') AS month,
                COUNT(applications.id) AS applications

            FROM applications

            WHERE applications.applied_at >= DATE_SUB(
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
            """
        )

        monthly_applications = cursor.fetchall()

        # =====================================================
        # 3. APPLICATION STATUS DISTRIBUTION
        # =====================================================

        cursor.execute(
            """
            SELECT
                status,
                COUNT(*) AS total

            FROM applications

            GROUP BY status

            ORDER BY total DESC
            """
        )

        application_status = cursor.fetchall()

        # =====================================================
        # 4. JOBS BY RECRUITER
        # =====================================================

        cursor.execute(
            """
            SELECT
                users.name AS recruiter,
                COUNT(jobs.id) AS jobs

            FROM jobs

            INNER JOIN users
                ON jobs.recruiter_id = users.id

            GROUP BY
                users.id,
                users.name

            ORDER BY jobs DESC
            """
        )

        jobs_by_recruiter = cursor.fetchall()

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message": "Admin chart data fetched successfully",

            "user_growth":
                user_growth,

            "monthly_applications":
                monthly_applications,

            "application_status":
                application_status,

            "jobs_by_recruiter":
                jobs_by_recruiter

        }), 200

    except Exception as e:

        return jsonify({

            "message":
                "Failed to fetch admin chart data",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN RECENT USERS
# =========================================================

@admin_bp.route("/users/recent", methods=["GET"])
@token_required
@role_required("Admin")
def admin_recent_users():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT DATABASE
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # GET RECENT USERS
        # =====================================================

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                role,
                created_at

            FROM users

            ORDER BY created_at DESC

            LIMIT 8
            """
        )

        users = cursor.fetchall()

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Recent users fetched successfully",

            "users":
                users

        }), 200

    except Exception as e:

        return jsonify({

            "message":
                "Failed to fetch recent users",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN RECENT PLATFORM ACTIVITY
# =========================================================

@admin_bp.route("/activity", methods=["GET"])
@token_required
@role_required("Admin")
def admin_recent_activity():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        activities = []

        # =====================================================
        # 1. NEW USERS
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
        """)

        users = cursor.fetchall()

        for user in users:

            activities.append({
                "type": "user",
                "title": f"New {user['role']} Registered",
                "description": f"{user['name']} created a {user['role'].lower()} account.",
                "created_at": user["created_at"]
            })

        # =====================================================
        # 2. NEW JOBS
        # =====================================================

        cursor.execute("""
            SELECT
                jobs.id,
                jobs.title,
                jobs.created_at,
                users.name AS recruiter_name
            FROM jobs
            INNER JOIN users
                ON jobs.recruiter_id = users.id
            ORDER BY jobs.created_at DESC
            LIMIT 10
        """)

        jobs = cursor.fetchall()

        for job in jobs:

            activities.append({
                "type": "job",
                "title": "New Job Posted",
                "description": (
                    f"{job['recruiter_name']} posted a "
                    f"{job['title']} position."
                ),
                "created_at": job["created_at"]
            })

        # =====================================================
        # 3. NEW APPLICATIONS
        # =====================================================

        cursor.execute("""
            SELECT
                applications.id,
                applications.applied_at,
                jobs.title AS job_title
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            ORDER BY applications.applied_at DESC
            LIMIT 10
        """)

        applications = cursor.fetchall()

        for application in applications:

            activities.append({
                "type": "application",
                "title": "New Application",
                "description": (
                    f"A candidate applied for "
                    f"{application['job_title']}."
                ),
                "created_at": application["applied_at"]
            })

        # =====================================================
        # 4. HIRED CANDIDATES
        # =====================================================

        cursor.execute("""
            SELECT
                applications.id,
                applications.applied_at,
                jobs.title AS job_title,
                users.name AS candidate_name
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            INNER JOIN users
                ON applications.candidate_id = users.id
            WHERE applications.status = 'Hired'
            ORDER BY applications.applied_at DESC
            LIMIT 10
        """)

        hired = cursor.fetchall()

        for hire in hired:

            activities.append({
                "type": "hire",
                "title": "Candidate Hired",
                "description": (
                    f"{hire['candidate_name']} was hired "
                    f"for {hire['job_title']}."
                ),
                "created_at": hire["applied_at"]
            })

        # =====================================================
        # 5. SORT ALL ACTIVITIES
        # =====================================================

        activities.sort(
            key=lambda x: x["created_at"]
            if x["created_at"]
            else "",
            reverse=True
        )

        # Show latest 10 activities

        activities = activities[:10]

        # =====================================================
        # 6. RETURN RESPONSE
        # =====================================================

        return jsonify({
            "message": "Admin activity fetched successfully",
            "activities": activities
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch admin activity",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN USERS
# =========================================================

@admin_bp.route("/users", methods=["GET"])
@token_required
@role_required("Admin")
def admin_users():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            WHERE role != 'Admin'
            ORDER BY created_at DESC
        """)

        users = cursor.fetchall()

        return jsonify({
            "message": "Users fetched successfully",
            "users": users
        }), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch users",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ACTIVATE / DEACTIVATE USER
# =========================================================

@admin_bp.route("/users/<int:user_id>/status", methods=["PUT"])
@token_required
@role_required("Admin")
def update_user_status(user_id):

    connection = None
    cursor = None

    try:

        data = request.get_json()

        status = data.get("status")

        if status not in ["Active", "Inactive"]:
            return jsonify({
                "message": "Invalid status"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # Prevent changing Admin status
        cursor.execute("""
            SELECT role
            FROM users
            WHERE id = %s
        """, (user_id,))

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "message": "User not found"
            }), 404

        if user[0] == "Admin":
            return jsonify({
                "message": "Admin status cannot be changed"
            }), 403

        cursor.execute("""
            UPDATE users
            SET status = %s
            WHERE id = %s
        """, (status, user_id))

        connection.commit()

        return jsonify({
            "message": f"User status changed to {status}",
            "status": status
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        return jsonify({
            "message": "Failed to update user status",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN - GET ALL JOBS
# =========================================================

@admin_bp.route("/jobs", methods=["GET"])
@token_required
@role_required("Admin")
def admin_get_jobs():

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

                users.id AS recruiter_id,
                users.name AS recruiter_name,
                users.email AS recruiter_email,

                COUNT(applications.id) AS applications

            FROM jobs

            LEFT JOIN users
                ON jobs.recruiter_id = users.id

            LEFT JOIN applications
                ON applications.job_id = jobs.id

            GROUP BY
                jobs.id,
                jobs.title,
                jobs.description,
                jobs.required_skills,
                jobs.experience,
                jobs.location,
                jobs.salary,
                jobs.status,
                jobs.created_at,
                users.id,
                users.name,
                users.email

            ORDER BY jobs.created_at DESC
            """
        )

        jobs = cursor.fetchall()

        return jsonify({
            "message": "Admin jobs fetched successfully",
            "jobs": jobs
        }), 200

    except Exception as e:

        print("ADMIN GET JOBS ERROR:", str(e))

        return jsonify({
            "message": "Failed to fetch admin jobs",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# ADMIN - DELETE JOB
# =========================================================

@admin_bp.route("/jobs/<int:job_id>", methods=["DELETE"])
@token_required
@role_required("Admin")
def admin_delete_job(job_id):

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # CHECK JOB EXISTS
        # =====================================================

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        job = cursor.fetchone()

        if not job:

            return jsonify({
                "message": "Job not found"
            }), 404

        # =====================================================
        # DELETE APPLICATIONS FIRST
        # =====================================================

        cursor.execute(
            """
            DELETE FROM applications
            WHERE job_id = %s
            """,
            (job_id,)
        )

        # =====================================================
        # DELETE JOB
        # =====================================================

        cursor.execute(
            """
            DELETE FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        connection.commit()

        return jsonify({
            "message": "Job deleted successfully",
            "job_id": job_id
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("ADMIN DELETE JOB ERROR:", str(e))

        return jsonify({
            "message": "Failed to delete job",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()