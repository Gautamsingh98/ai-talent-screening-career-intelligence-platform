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

        # =========================================================
        # 6. TOTAL HIRED
        # =========================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_hired
            FROM applications
            WHERE status = 'Hired'
            """
        )

        hired_result = cursor.fetchone()

        total_hired = hired_result["total_hired"] or 0

        # =========================================================
        # 7. TOTAL INTERVIEWS
        # =========================================================

        cursor.execute(
            """
            SELECT COUNT(*) AS total_interviews
            FROM applications
            WHERE status = 'Interview'
            """
        )

        interviews_result = cursor.fetchone()

        total_interviews = (
            interviews_result["total_interviews"] or 0
        )

        # =========================================================
        # 8. HIRING RATE
        # =========================================================

        hiring_rate = 0

        if total_applications > 0:

            hiring_rate = round(
                (total_hired / total_applications) * 100,
                2
            )

        # =====================================================
        # 7. USER GROWTH
        # =====================================================

        cursor.execute("""
            SELECT
                DATE_FORMAT(created_at, '%b') AS month,
                COUNT(*) AS users
            FROM users
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY
                YEAR(created_at),
                MONTH(created_at),
                DATE_FORMAT(created_at, '%b')
            ORDER BY
                YEAR(created_at),
                MONTH(created_at)
        """)

        user_growth = cursor.fetchall()


        # =====================================================
        # 8. RECRUITMENT PERFORMANCE
        # =====================================================

        cursor.execute("""
            SELECT
                DATE_FORMAT(a.applied_at, '%b') AS month,

                COUNT(a.id) AS applications,

                COUNT(
                    CASE
                        WHEN a.status = 'Interview'
                        THEN a.id
                    END
                ) AS interviews,

                COUNT(
                    CASE
                        WHEN a.status = 'Hired'
                        THEN a.id
                    END
                ) AS hires

            FROM applications a

            WHERE a.applied_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 6 MONTH
            )

            GROUP BY
                YEAR(a.applied_at),
                MONTH(a.applied_at),
                DATE_FORMAT(a.applied_at, '%b')

            ORDER BY
                YEAR(a.applied_at),
                MONTH(a.applied_at)
        """)

        recruiter_performance = cursor.fetchall()
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
                    total_hired,

                "total_interviews":
                    total_interviews,

                "hiring_rate":
                    hiring_rate
            },
                "user_growth": user_growth,
                "recruiter_performance": recruiter_performance
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
# ADMIN ANALYTICS CHART DATA
# =========================================================

@admin_bp.route("/charts", methods=["GET"])
@token_required
@role_required("Admin")
def admin_charts():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # 1. USER GROWTH - LAST 6 MONTHS
        # =====================================================

        cursor.execute("""
            SELECT
                DATE_FORMAT(created_at, '%b') AS month,
                COUNT(*) AS users
            FROM users
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY
                YEAR(created_at),
                MONTH(created_at)
            ORDER BY
                YEAR(created_at),
                MONTH(created_at)
        """)

        user_growth = cursor.fetchall()

        # =====================================================
        # 2. MONTHLY APPLICATIONS
        # =====================================================

        cursor.execute("""
            SELECT
                DATE_FORMAT(applied_at, '%b') AS month,
                COUNT(*) AS applications
            FROM applications
            WHERE applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY
                YEAR(applied_at),
                MONTH(applied_at)
            ORDER BY
                YEAR(applied_at),
                MONTH(applied_at)
        """)

        monthly_applications = cursor.fetchall()

        # =====================================================
        # 3. MONTHLY INTERVIEWS
        # =====================================================

        cursor.execute("""
            SELECT
                DATE_FORMAT(applied_at, '%b') AS month,
                COUNT(*) AS interviews
            FROM applications
            WHERE status = 'Interview'
            AND applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY
                YEAR(applied_at),
                MONTH(applied_at)
            ORDER BY
                YEAR(applied_at),
                MONTH(applied_at)
        """)

        monthly_interviews = cursor.fetchall()

        # =====================================================
        # 4. MONTHLY HIRES
        # =====================================================

        cursor.execute("""
            SELECT
                DATE_FORMAT(applied_at, '%b') AS month,
                COUNT(*) AS hires
            FROM applications
            WHERE status = 'Hired'
            AND applied_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY
                YEAR(applied_at),
                MONTH(applied_at)
            ORDER BY
                YEAR(applied_at),
                MONTH(applied_at)
        """)

        monthly_hires = cursor.fetchall()

        # =====================================================
        # 5. APPLICATION STATUS
        # =====================================================

        cursor.execute("""
            SELECT
                status,
                COUNT(*) AS total
            FROM applications
            GROUP BY status
            ORDER BY total DESC
        """)

        application_status = cursor.fetchall()

        # =====================================================
        # 6. JOBS BY RECRUITER
        # =====================================================

        cursor.execute("""
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
        """)

        jobs_by_recruiter = cursor.fetchall()

        # =====================================================
        # DEBUG
        # =====================================================

        print("======================================")
        print("ADMIN CHART DATA")
        print("USER GROWTH:", user_growth)
        print("APPLICATIONS:", monthly_applications)
        print("INTERVIEWS:", monthly_interviews)
        print("HIRES:", monthly_hires)
        print("STATUS:", application_status)
        print("RECRUITERS:", jobs_by_recruiter)
        print("======================================")

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message": "Admin chart data fetched successfully",

            "user_growth": user_growth,

            "monthly_applications": monthly_applications,

            "monthly_interviews": monthly_interviews,

            "monthly_hires": monthly_hires,

            "application_status": application_status,

            "jobs_by_recruiter": jobs_by_recruiter

        }), 200

    except Exception as e:

        print("ADMIN CHARTS ERROR:", str(e))

        return jsonify({

            "message": "Failed to fetch admin chart data",

            "error": str(e)

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

# =====================================================
# ADMIN ANALYTICS
# =====================================================

@admin_bp.route("/analytics", methods=["GET"])
@token_required
@role_required("Admin")
def admin_analytics():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # 1. CURRENT TOTAL USERS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_users
            FROM users
        """)

        total_users = cursor.fetchone()["total_users"] or 0

        # =====================================================
        # 2. CURRENT TOTAL CANDIDATES
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_candidates
            FROM users
            WHERE role = 'Candidate'
        """)

        total_candidates = (
            cursor.fetchone()["total_candidates"] or 0
        )

        # =====================================================
        # 3. CURRENT TOTAL RECRUITERS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_recruiters
            FROM users
            WHERE role = 'Recruiter'
        """)

        total_recruiters = (
            cursor.fetchone()["total_recruiters"] or 0
        )

        # =====================================================
        # 4. CURRENT TOTAL JOBS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_jobs
            FROM jobs
        """)

        total_jobs = cursor.fetchone()["total_jobs"] or 0

        # =====================================================
        # 5. CURRENT TOTAL APPLICATIONS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_applications
            FROM applications
        """)

        total_applications = (
            cursor.fetchone()["total_applications"] or 0
        )

        # =====================================================
        # 6. CURRENT TOTAL INTERVIEWS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_interviews
            FROM applications
            WHERE status = 'Interview'
        """)

        total_interviews = (
            cursor.fetchone()["total_interviews"] or 0
        )

        # =====================================================
        # 7. CURRENT TOTAL HIRED
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total_hired
            FROM applications
            WHERE status = 'Hired'
        """)

        total_hired = (
            cursor.fetchone()["total_hired"] or 0
        )

        # =====================================================
        # 8. HIRING RATE
        # =====================================================

        hiring_rate = 0

        if total_applications > 0:

            hiring_rate = round(
                (total_hired / total_applications) * 100,
                2
            )

        # =====================================================
        # 9. USER GROWTH
        # =====================================================

        cursor.execute("""
            SELECT
                COUNT(*) AS current_users
            FROM users
            WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        """)

        current_users = cursor.fetchone()["current_users"] or 0

        cursor.execute("""
            SELECT
                COUNT(*) AS previous_users
            FROM users
            WHERE created_at >= DATE_FORMAT(
                DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
                '%Y-%m-01'
            )
            AND created_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_users = cursor.fetchone()["previous_users"] or 0

        user_growth = 0

        if previous_users > 0:
            user_growth = round(
                ((current_users - previous_users) / previous_users) * 100,
                2
            )


        # =====================================================
        # 10. CANDIDATE GROWTH
        # =====================================================

        cursor.execute("""
            SELECT
                COUNT(*) AS current_candidates
            FROM users
            WHERE role = 'Candidate'
            AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        """)

        current_candidates = (
            cursor.fetchone()["current_candidates"] or 0
        )

        cursor.execute("""
            SELECT
                COUNT(*) AS previous_candidates
            FROM users
            WHERE role = 'Candidate'
            AND created_at >= DATE_FORMAT(
                DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
                '%Y-%m-01'
            )
            AND created_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_candidates = (
            cursor.fetchone()["previous_candidates"] or 0
        )

        candidate_growth = 0

        if previous_candidates > 0:
            candidate_growth = round(
                (
                    (current_candidates - previous_candidates)
                    / previous_candidates
                ) * 100,
                2
            )


        # =====================================================
        # 11. ACTIVE JOBS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS active_jobs
            FROM jobs
            WHERE status = 'Active'
        """)

        active_jobs = cursor.fetchone()["active_jobs"] or 0


        # =====================================================
        # 12. APPLICATION GROWTH
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS current_applications
            FROM applications
            WHERE applied_at >= DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        current_applications = (
            cursor.fetchone()["current_applications"] or 0
        )

        cursor.execute("""
            SELECT COUNT(*) AS previous_applications
            FROM applications
            WHERE applied_at >= DATE_FORMAT(
                DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
                '%Y-%m-01'
            )
            AND applied_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_applications = (
            cursor.fetchone()["previous_applications"] or 0
        )

        application_growth = 0

        if previous_applications > 0:
            application_growth = round(
                (
                    (current_applications - previous_applications)
                    / previous_applications
                ) * 100,
                2
            )


        # =====================================================
        # 13. TOP RECRUITERS
        # =====================================================

        cursor.execute("""
            SELECT
                users.id,
                users.name AS recruiter,
                COUNT(DISTINCT jobs.id) AS jobs_posted,

                COUNT(
                    CASE
                        WHEN applications.status = 'Hired'
                        THEN applications.id
                    END
                ) AS hires

            FROM users

            INNER JOIN jobs
                ON jobs.recruiter_id = users.id

            LEFT JOIN applications
                ON applications.job_id = jobs.id

            WHERE users.role = 'Recruiter'

            GROUP BY
                users.id,
                users.name

            ORDER BY
                hires DESC,
                jobs_posted DESC

            LIMIT 5
        """)

        top_recruiters = cursor.fetchall()


        # =====================================================
        # 14. TOP PERFORMING JOBS
        # =====================================================

        cursor.execute("""
            SELECT
                jobs.id,
                jobs.title,

                COUNT(applications.id) AS applications,

                COUNT(
                    CASE
                        WHEN applications.status = 'Hired'
                        THEN applications.id
                    END
                ) AS hires

            FROM jobs

            LEFT JOIN applications
                ON applications.job_id = jobs.id

            GROUP BY
                jobs.id,
                jobs.title

            ORDER BY
                applications DESC,
                hires DESC

            LIMIT 5
        """)

        top_jobs = cursor.fetchall()

        # =====================================================
        # 9. PREVIOUS MONTH TOTAL USERS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_users
            FROM users
            WHERE created_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_users = (
            cursor.fetchone()["previous_users"] or 0
        )

        # =====================================================
        # 10. PREVIOUS MONTH CANDIDATES
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_candidates
            FROM users
            WHERE role = 'Candidate'
            AND created_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_candidates = (
            cursor.fetchone()["previous_candidates"] or 0
        )

        # =====================================================
        # 11. PREVIOUS MONTH RECRUITERS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_recruiters
            FROM users
            WHERE role = 'Recruiter'
            AND created_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_recruiters = (
            cursor.fetchone()["previous_recruiters"] or 0
        )

        # =====================================================
        # 12. PREVIOUS MONTH JOBS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_jobs
            FROM jobs
            WHERE created_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_jobs = (
            cursor.fetchone()["previous_jobs"] or 0
        )

        # =====================================================
        # 13. PREVIOUS MONTH APPLICATIONS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_applications
            FROM applications
            WHERE applied_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_applications = (
            cursor.fetchone()["previous_applications"] or 0
        )

        # =====================================================
        # 14. PREVIOUS MONTH INTERVIEWS
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_interviews
            FROM applications
            WHERE status = 'Interview'
            AND applied_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_interviews = (
            cursor.fetchone()["previous_interviews"] or 0
        )

        # =====================================================
        # 15. PREVIOUS MONTH HIRED
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS previous_hired
            FROM applications
            WHERE status = 'Hired'
            AND applied_at < DATE_FORMAT(
                CURDATE(),
                '%Y-%m-01'
            )
        """)

        previous_hired = (
            cursor.fetchone()["previous_hired"] or 0
        )

        # =====================================================
        # 16. DYNAMIC PERCENTAGE CALCULATION
        # =====================================================

        def calculate_growth(current, previous):

            if previous == 0:

                if current > 0:
                    return 100

                return 0

            return round(
                ((current - previous) / previous) * 100,
                2
            )

        # =====================================================
        # 17. CALCULATE GROWTH
        # =====================================================

        users_growth = calculate_growth(
            total_users,
            previous_users
        )

        candidates_growth = calculate_growth(
            total_candidates,
            previous_candidates
        )

        recruiters_growth = calculate_growth(
            total_recruiters,
            previous_recruiters
        )

        jobs_growth = calculate_growth(
            total_jobs,
            previous_jobs
        )

        applications_growth = calculate_growth(
            total_applications,
            previous_applications
        )

        interviews_growth = calculate_growth(
            total_interviews,
            previous_interviews
        )

        hired_growth = calculate_growth(
            total_hired,
            previous_hired
        )

        # =====================================================
        # 18. RESPONSE
        # =====================================================

        return jsonify({

            "message": "Admin analytics fetched successfully",

            "overview": {

                "total_users": total_users,

                "total_candidates": total_candidates,

                "total_recruiters": total_recruiters,

                "total_jobs": total_jobs,

                "total_applications": total_applications,

                "total_interviews": total_interviews,

                "total_hired": total_hired,

                "hiring_rate": hiring_rate,

                # =============================================
                # DYNAMIC GROWTH VALUES
                # =============================================

                "growth": {

                    "users": users_growth,

                    "candidates": candidates_growth,

                    "recruiters": recruiters_growth,

                    "jobs": jobs_growth,

                    "applications": applications_growth,

                    "interviews": interviews_growth,

                    "hired": hired_growth
                }
            }

        }), 200

    except Exception as e:

        print("ADMIN ANALYTICS ERROR:", str(e))

        return jsonify({

            "message": "Failed to fetch admin analytics",

            "error": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN TOP PERFORMERS
# =========================================================

@admin_bp.route("/top-performers", methods=["GET"])
@token_required
@role_required("Admin")
def admin_top_performers():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # 1. TOP RECRUITERS
        # =====================================================

        cursor.execute("""
            SELECT
                users.id AS recruiter_id,
                users.name AS recruiter,
                COUNT(DISTINCT jobs.id) AS jobs_posted,

                COUNT(
                    CASE
                        WHEN applications.status = 'Hired'
                        THEN applications.id
                    END
                ) AS hires

            FROM users

            INNER JOIN jobs
                ON jobs.recruiter_id = users.id

            LEFT JOIN applications
                ON applications.job_id = jobs.id

            WHERE users.role = 'Recruiter'

            GROUP BY
                users.id,
                users.name

            ORDER BY
                hires DESC,
                jobs_posted DESC

            LIMIT 5
        """)

        top_recruiters = cursor.fetchall()

        # =====================================================
        # 2. TOP PERFORMING JOBS
        # =====================================================

        cursor.execute("""
            SELECT
                jobs.id AS job_id,
                jobs.title AS job_title,

                COUNT(applications.id) AS applications,

                COUNT(
                    CASE
                        WHEN applications.status = 'Hired'
                        THEN applications.id
                    END
                ) AS hires

            FROM jobs

            LEFT JOIN applications
                ON applications.job_id = jobs.id

            GROUP BY
                jobs.id,
                jobs.title

            ORDER BY
                applications DESC,
                hires DESC

            LIMIT 5
        """)

        top_jobs = cursor.fetchall()

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message": "Admin top performers fetched successfully",

            "top_recruiters": top_recruiters,

            "top_jobs": top_jobs

        }), 200

    except Exception as e:

        print("ADMIN TOP PERFORMERS ERROR:", str(e))

        return jsonify({

            "message": "Failed to fetch top performers",

            "error": str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN SETTINGS - GET
# =========================================================

@admin_bp.route("/settings", methods=["GET"])
@token_required
@role_required("Admin")
def get_admin_settings():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                platform_name,
                platform_email,
                candidate_registration,
                recruiter_registration,
                maintenance_mode,
                min_password_length,
                two_factor_auth,
                session_timeout,
                email_notifications,
                new_user_registrations,
                new_job_postings,
                new_applications,
                hiring_notifications,
                system_alerts,
                administrator_name,
                administrator_email,
                phone_number,
                created_at,
                updated_at
            FROM admin_settings
            ORDER BY id DESC
            LIMIT 1
        """)

        settings = cursor.fetchone()

        if not settings:
            return jsonify({
                "message": "Admin settings not found"
            }), 404

        return jsonify({
            "message": "Admin settings fetched successfully",
            "settings": settings
        }), 200

    except Exception as e:

        print("ADMIN SETTINGS GET ERROR:", str(e))

        return jsonify({
            "message": "Failed to fetch admin settings",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# ADMIN SETTINGS - UPDATE
# =========================================================

@admin_bp.route("/settings", methods=["PUT"])
@token_required
@role_required("Admin")
def update_admin_settings():

    connection = None
    cursor = None

    try:

        data = request.get_json()

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE admin_settings
            SET
                platform_name = %s,
                platform_email = %s,
                candidate_registration = %s,
                recruiter_registration = %s,
                maintenance_mode = %s,
                min_password_length = %s,
                two_factor_auth = %s,
                session_timeout = %s,
                email_notifications = %s,
                new_user_registrations = %s,
                new_job_postings = %s,
                new_applications = %s,
                hiring_notifications = %s,
                system_alerts = %s,
                administrator_name = %s,
                administrator_email = %s,
                phone_number = %s
            WHERE id = (
                SELECT id FROM (
                    SELECT id
                    FROM admin_settings
                    ORDER BY id DESC
                    LIMIT 1
                ) AS latest_settings
            )
        """, (
            data.get("platform_name"),
            data.get("platform_email"),
            data.get("candidate_registration"),
            data.get("recruiter_registration"),
            data.get("maintenance_mode"),
            data.get("min_password_length"),
            data.get("two_factor_auth"),
            data.get("session_timeout"),
            data.get("email_notifications"),
            data.get("new_user_registrations"),
            data.get("new_job_postings"),
            data.get("new_applications"),
            data.get("hiring_notifications"),
            data.get("system_alerts"),
            data.get("administrator_name"),
            data.get("administrator_email"),
            data.get("phone_number")
        ))

        connection.commit()

        return jsonify({
            "message": "Admin settings updated successfully"
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("ADMIN SETTINGS UPDATE ERROR:", str(e))

        return jsonify({
            "message": "Failed to update admin settings",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()