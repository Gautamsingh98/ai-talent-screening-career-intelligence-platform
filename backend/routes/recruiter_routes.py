from flask import Blueprint, jsonify, request, send_file
import os
import io
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER

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
# RECRUITER REPORT SUMMARY DATA
# =========================================================

@recruiter_bp.route("/reports", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_report_summary():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT DATABASE
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # GET LOGGED-IN RECRUITER ID
        # =====================================================

        recruiter_id = request.user["user_id"]

        print("========================================")
        print("RECRUITER REPORT REQUEST")
        print("Logged-in recruiter ID:", recruiter_id)
        print("Logged-in user:", request.user)
        print("========================================")

        # =====================================================
        # 1. JOBS POSTED
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

        total_jobs = jobs_result["total_jobs"] or 0

        # =====================================================
        # 2. TOTAL APPLICATIONS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_applications
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            """,
            (recruiter_id,)
        )

        applications_result = cursor.fetchone()

        total_applications = (
            applications_result["total_applications"] or 0
        )

        # =====================================================
        # 3. SHORTLISTED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS shortlisted
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Shortlisted'
            """,
            (recruiter_id,)
        )

        shortlisted_result = cursor.fetchone()

        shortlisted = (
            shortlisted_result["shortlisted"] or 0
        )

        # =====================================================
        # 4. HIRED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS hired
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Hired'
            """,
            (recruiter_id,)
        )

        hired_result = cursor.fetchone()

        hired = hired_result["hired"] or 0

        # =====================================================
        # 5. SUCCESS RATE
        # =====================================================

        success_rate = 0

        if total_applications > 0:

            success_rate = round(
                (hired / total_applications) * 100,
                2
            )

        # =====================================================
        # DEBUG OUTPUT
        # =====================================================

        print("Total Jobs:", total_jobs)
        print("Total Applications:", total_applications)
        print("Shortlisted:", shortlisted)
        print("Hired:", hired)
        print("Success Rate:", success_rate)
        print("========================================")

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Recruiter report summary fetched successfully",

            "total_jobs":
                total_jobs,

            "total_applications":
                total_applications,

            "shortlisted":
                shortlisted,

            "hired":
                hired,

            "success_rate":
                success_rate

        }), 200

    except Exception as e:

        print("RECRUITER REPORT ERROR:", str(e))

        return jsonify({

            "message":
                "Failed to fetch recruiter report summary",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# RECRUITER REPORT CHART DATA
# =========================================================

@recruiter_bp.route("/reports/charts", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_report_charts():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT TO DATABASE
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]

        # =====================================================
        # 1. HIRING TREND
        # =====================================================
        # Count hired applications by month.
        #
        # We use applied_at because your applications table
        # already uses this field in the existing routes.
        # =====================================================

        cursor.execute(
            """
            SELECT
                DATE_FORMAT(applications.applied_at, '%b') AS month,
                COUNT(*) AS hired

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            WHERE jobs.recruiter_id = %s

            AND applications.status = 'Hired'

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

        hiring_trend = cursor.fetchall()

        # =====================================================
        # 2. APPLICATIONS BY JOB ROLE
        # =====================================================

        cursor.execute(
            """
            SELECT
                jobs.title AS role,
                COUNT(applications.id) AS applications

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            WHERE jobs.recruiter_id = %s

            GROUP BY
                jobs.id,
                jobs.title

            ORDER BY
                applications DESC
            """,
            (recruiter_id,)
        )

        applications_by_role = cursor.fetchall()

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Recruiter report chart data fetched successfully",

            "hiring_trend":
                hiring_trend,

            "applications_by_role":
                applications_by_role

        }), 200

    # =========================================================
    # ERROR
    # =========================================================

    except Exception as e:

        return jsonify({

            "message":
                "Failed to fetch recruiter report chart data",

            "error":
                str(e)

        }), 500

    # =========================================================
    # CLOSE DATABASE
    # =========================================================

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# DOWNLOAD RECRUITER RECRUITMENT REPORT
# =========================================================

@recruiter_bp.route("/reports/download", methods=["GET"])
@token_required
@role_required("Recruiter")
def download_recruiter_report():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT TO DATABASE
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]

        # =====================================================
        # 1. JOBS POSTED
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
        total_jobs = jobs_result["total_jobs"] or 0

        # =====================================================
        # 2. TOTAL APPLICATIONS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_applications
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            """,
            (recruiter_id,)
        )

        applications_result = cursor.fetchone()

        total_applications = (
            applications_result["total_applications"] or 0
        )

        # =====================================================
        # 3. SHORTLISTED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS shortlisted
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Shortlisted'
            """,
            (recruiter_id,)
        )

        shortlisted_result = cursor.fetchone()

        shortlisted = (
            shortlisted_result["shortlisted"] or 0
        )

        # =====================================================
        # 4. HIRED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS hired
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Hired'
            """,
            (recruiter_id,)
        )

        hired_result = cursor.fetchone()

        hired = hired_result["hired"] or 0

        # =====================================================
        # 5. SUCCESS RATE
        # =====================================================

        success_rate = 0

        if total_applications > 0:

            success_rate = round(
                (hired / total_applications) * 100,
                2
            )

        # =====================================================
        # 6. APPLICATIONS BY JOB ROLE
        # =====================================================

        cursor.execute(
            """
            SELECT
                jobs.title AS role,
                COUNT(applications.id) AS applications
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            GROUP BY jobs.id, jobs.title
            ORDER BY applications DESC
            """,
            (recruiter_id,)
        )

        applications_by_role = cursor.fetchall()

        # =====================================================
        # CREATE PDF
        # =====================================================

        pdf_buffer = BytesIO()

        document = SimpleDocTemplate(
            pdf_buffer,
            pagesize=A4,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()

        title_style = styles["Title"]
        title_style.alignment = TA_CENTER

        normal_style = styles["Normal"]

        content = []

        # =====================================================
        # TITLE
        # =====================================================

        content.append(
            Paragraph(
                "Recruiter Recruitment Report",
                title_style
            )
        )

        content.append(Spacer(1, 20))

        content.append(
            Paragraph(
                "AI Talent Screening & Career Intelligence Platform",
                normal_style
            )
        )

        content.append(Spacer(1, 20))

        # =====================================================
        # SUMMARY
        # =====================================================

        summary_data = [
            ["Metric", "Value"],
            ["Jobs Posted", str(total_jobs)],
            ["Applications", str(total_applications)],
            ["Shortlisted", str(shortlisted)],
            ["Hired", str(hired)],
            ["Success Rate", f"{success_rate}%"]
        ]

        summary_table = Table(
            summary_data,
            colWidths=[250, 150]
        )

        summary_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (1, 1), (1, -1), "CENTER"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
            ])
        )

        content.append(
            Paragraph(
                "Recruitment Summary",
                styles["Heading2"]
            )
        )

        content.append(Spacer(1, 10))

        content.append(summary_table)

        content.append(Spacer(1, 25))

        # =====================================================
        # APPLICATIONS BY JOB ROLE
        # =====================================================

        content.append(
            Paragraph(
                "Applications by Job Role",
                styles["Heading2"]
            )
        )

        content.append(Spacer(1, 10))

        role_data = [
            ["Job Role", "Applications"]
        ]

        for row in applications_by_role:

            role_data.append([
                row["role"],
                str(row["applications"])
            ])

        if len(role_data) == 1:

            role_data.append([
                "No applications",
                "0"
            ])

        role_table = Table(
            role_data,
            colWidths=[250, 150]
        )

        role_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (1, 1), (1, -1), "CENTER"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
            ])
        )

        content.append(role_table)

        content.append(Spacer(1, 25))

        # =====================================================
        # FOOTER INFORMATION
        # =====================================================

        content.append(
            Paragraph(
                "Generated by AI Talent Screening & Career Intelligence Platform",
                normal_style
            )
        )

        # =====================================================
        # BUILD PDF
        # =====================================================

        document.build(content)

        pdf_buffer.seek(0)

        # =====================================================
        # SEND PDF TO FRONTEND
        # =====================================================

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="Recruiter_Recruitment_Report.pdf"
        )

    except Exception as e:

        return jsonify({
            "message": "Failed to generate recruiter recruitment report",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()
        if connection:
            connection.close()

# =========================================================
# RECRUITER ANALYTICS
# =========================================================

@recruiter_bp.route("/analytics", methods=["GET"])
@token_required
@role_required("Recruiter")
def recruiter_analytics():

    connection = None
    cursor = None

    try:

        # =====================================================
        # CONNECT DATABASE
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]

        # =====================================================
        # 1. TOTAL JOBS
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

        total_jobs = jobs_result["total_jobs"] or 0

        # =====================================================
        # 2. TOTAL APPLICATIONS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_applications
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            """,
            (recruiter_id,)
        )

        applications_result = cursor.fetchone()

        total_applications = (
            applications_result["total_applications"] or 0
        )

        # =====================================================
        # 3. TOTAL HIRED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_hired
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Hired'
            """,
            (recruiter_id,)
        )

        hired_result = cursor.fetchone()

        total_hired = (
            hired_result["total_hired"] or 0
        )

        # =====================================================
        # 4. TOTAL SHORTLISTED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_shortlisted
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Shortlisted'
            """,
            (recruiter_id,)
        )

        shortlisted_result = cursor.fetchone()

        total_shortlisted = (
            shortlisted_result["total_shortlisted"] or 0
        )

        # =====================================================
        # 5. TOTAL INTERVIEWS
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_interviews
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Interview'
            """,
            (recruiter_id,)
        )

        interview_result = cursor.fetchone()

        total_interviews = (
            interview_result["total_interviews"] or 0
        )

        # =====================================================
        # 6. TOTAL REJECTED
        # =====================================================

        cursor.execute(
            """
            SELECT COUNT(applications.id) AS total_rejected
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE jobs.recruiter_id = %s
            AND applications.status = 'Rejected'
            """,
            (recruiter_id,)
        )

        rejected_result = cursor.fetchone()

        total_rejected = (
            rejected_result["total_rejected"] or 0
        )

        # =====================================================
        # 7. HIRING RATE
        # =====================================================

        hiring_rate = 0

        if total_applications > 0:

            hiring_rate = round(
                (total_hired / total_applications) * 100,
                2
            )

        # =====================================================
        # 8. APPLICATION STATUS DISTRIBUTION
        # =====================================================

        cursor.execute(
            """
            SELECT
                applications.status,
                COUNT(applications.id) AS total

            FROM applications

            INNER JOIN jobs
                ON applications.job_id = jobs.id

            WHERE jobs.recruiter_id = %s

            GROUP BY applications.status
            """,
            (recruiter_id,)
        )

        status_distribution = cursor.fetchall()

        # =====================================================
        # 9. APPLICATIONS BY JOB
        # =====================================================

        cursor.execute(
            """
            SELECT
                jobs.id AS job_id,
                jobs.title AS job_title,
                COUNT(applications.id) AS applications

            FROM jobs

            LEFT JOIN applications
                ON applications.job_id = jobs.id

            WHERE jobs.recruiter_id = %s

            GROUP BY
                jobs.id,
                jobs.title

            ORDER BY applications DESC
            """,
            (recruiter_id,)
        )

        applications_by_job = cursor.fetchall()

        # =====================================================
        # 10. HIRED CANDIDATES BY JOB
        # =====================================================

        cursor.execute(
            """
            SELECT
                jobs.id AS job_id,
                jobs.title AS job_title,

                COUNT(applications.id) AS hired

            FROM jobs

            LEFT JOIN applications
                ON applications.job_id = jobs.id
                AND applications.status = 'Hired'

            WHERE jobs.recruiter_id = %s

            GROUP BY
                jobs.id,
                jobs.title

            ORDER BY hired DESC
            """,
            (recruiter_id,)
        )

        hired_by_job = cursor.fetchall()

        # =====================================================
        # 11. RECRUITMENT FUNNEL
        # =====================================================

        recruitment_funnel = [

            {
                "stage": "Applied",
                "count": total_applications
            },

            {
                "stage": "Shortlisted",
                "count": total_shortlisted
            },

            {
                "stage": "Interview",
                "count": total_interviews
            },

            {
                "stage": "Hired",
                "count": total_hired
            }

        ]

        # =====================================================
        # 12. MONTHLY RECRUITMENT PERFORMANCE
        # =====================================================

        cursor.execute(
            """
            SELECT

                DATE_FORMAT(
                    applications.applied_at,
                    '%b'
                ) AS month,

                YEAR(applications.applied_at) AS year,

                MONTH(applications.applied_at) AS month_number,

                COUNT(applications.id) AS applications,

                SUM(
                    CASE
                        WHEN applications.status = 'Interview'
                        THEN 1
                        ELSE 0
                    END
                ) AS interviews,

                SUM(
                    CASE
                        WHEN applications.status = 'Hired'
                        THEN 1
                        ELSE 0
                    END
                ) AS hired

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
                DATE_FORMAT(
                    applications.applied_at,
                    '%b'
                )

            ORDER BY
                YEAR(applications.applied_at),
                MONTH(applications.applied_at)
            """,
            (recruiter_id,)
        )

        monthly_data = cursor.fetchall()

        # =====================================================
        # CALCULATE MONTHLY SUCCESS RATE
        # =====================================================

        for row in monthly_data:

            applications = row["applications"] or 0
            hired = row["hired"] or 0

            if applications > 0:

                row["success_rate"] = round(
                    (hired / applications) * 100,
                    2
                )

            else:

                row["success_rate"] = 0

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Recruiter analytics fetched successfully",

            "overview": {

                "total_jobs":
                    total_jobs,

                "total_applications":
                    total_applications,

                "total_shortlisted":
                    total_shortlisted,

                "total_interviews":
                    total_interviews,

                "total_hired":
                    total_hired,

                "total_rejected":
                    total_rejected,

                "hiring_rate":
                    hiring_rate
            },

            "status_distribution":
                status_distribution,

            "applications_by_job":
                applications_by_job,

            "hired_by_job":
                hired_by_job,

            "recruitment_funnel":
                recruitment_funnel,

            "monthly_data":
                monthly_data

        }), 200

    # =========================================================
    # ERROR
    # =========================================================

    except Exception as e:

        return jsonify({

            "message":
                "Failed to fetch recruiter analytics",

            "error":
                str(e)

        }), 500

    # =========================================================
    # CLOSE DATABASE
    # =========================================================

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
# GET RECRUITER JOBS / SEARCH JOBS
# =========================================================

@recruiter_bp.route("/jobs", methods=["GET"])
@token_required
def get_recruiter_jobs():

    if request.user["role"] != "Recruiter":

        return jsonify({
            "success": False,
            "message": "Only recruiters can access jobs"
        }), 403

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]

        # =====================================================
        # GET SEARCH VALUE
        # =====================================================

        search = request.args.get("search", "").strip()

        # =====================================================
        # NO SEARCH
        # =====================================================

        if not search:

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
                (recruiter_id,)
            )

        # =====================================================
        # SEARCH JOBS
        # =====================================================

        else:

            search_value = f"%{search}%"

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

                AND (
                    jobs.title LIKE %s
                    OR jobs.description LIKE %s
                    OR jobs.required_skills LIKE %s
                    OR jobs.experience LIKE %s
                    OR jobs.location LIKE %s
                )

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
                (
                    recruiter_id,
                    search_value,
                    search_value,
                    search_value,
                    search_value,
                    search_value
                )
            )

        jobs = cursor.fetchall()

        return jsonify({
            "success": True,
            "jobs": jobs
        }), 200

    except Exception as e:

        print("RECRUITER JOB SEARCH ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Failed to fetch jobs",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# RECRUITER GLOBAL SEARCH
# Search jobs, candidates, applications, and resumes
# =========================================================

@recruiter_bp.route("/search", methods=["GET"])
@token_required
def recruiter_global_search():

    if request.user["role"] != "Recruiter":
        return jsonify({
            "success": False,
            "message": "Only recruiters can use global search"
        }), 403

    connection = None
    cursor = None

    try:
        search = request.args.get("q", "").strip()

        if not search:
            return jsonify({
                "success": True,
                "results": []
            }), 200

        search_value = f"%{search}%"

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        recruiter_id = request.user["user_id"]
        results = []

        # -------------------------------------------------
        # 1. SEARCH JOBS OWNED BY THIS RECRUITER
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                title,
                description,
                location,
                required_skills,
                status
            FROM jobs
            WHERE recruiter_id = %s
            AND (
                title LIKE %s
                OR description LIKE %s
                OR location LIKE %s
                OR required_skills LIKE %s
            )
            LIMIT 10
            """,
            (
                recruiter_id,
                search_value,
                search_value,
                search_value,
                search_value
            )
        )

        for job in cursor.fetchall():
            results.append({
                "id": job["id"],
                "title": job["title"],
                "description": job["description"],
                "location": job["location"],
                "required_skills": job["required_skills"],
                "status": job["status"],
                "type": "Job"
            })

        # -------------------------------------------------
        # 2. SEARCH CANDIDATES WHO APPLIED TO RECRUITER JOBS
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT DISTINCT
                users.id,
                users.name,
                users.email
            FROM users
            INNER JOIN applications
                ON applications.candidate_id = users.id
            INNER JOIN jobs
                ON jobs.id = applications.job_id
            WHERE jobs.recruiter_id = %s
            AND (
                users.name LIKE %s
                OR users.email LIKE %s
            )
            LIMIT 10
            """,
            (
                recruiter_id,
                search_value,
                search_value
            )
        )

        for candidate in cursor.fetchall():
            results.append({
                "id": candidate["id"],
                "name": candidate["name"],
                "email": candidate["email"],
                "type": "Candidate"
            })

        # -------------------------------------------------
        # 3. SEARCH APPLICATIONS FOR RECRUITER JOBS
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                applications.id,
                users.name AS candidate_name,
                users.email AS candidate_email,
                jobs.title AS job_title,
                applications.status
            FROM applications
            INNER JOIN users
                ON users.id = applications.candidate_id
            INNER JOIN jobs
                ON jobs.id = applications.job_id
            WHERE jobs.recruiter_id = %s
            AND (
                users.name LIKE %s
                OR users.email LIKE %s
                OR jobs.title LIKE %s
                OR applications.status LIKE %s
            )
            LIMIT 10
            """,
            (
                recruiter_id,
                search_value,
                search_value,
                search_value,
                search_value
            )
        )

        # -------------------------------------------------
        # ADD APPLICATION SEARCH RESULTS
        # -------------------------------------------------

        for application in cursor.fetchall():
            results.append({
                "id": application["id"],
                "title": (
                    f'{application["candidate_name"]} - '
                    f'{application["job_title"]}'
                ),
                "candidate_name": application["candidate_name"],
                "candidate_email": application["candidate_email"],
                "job_title": application["job_title"],
                "status": application["status"],
                "type": "Application"
            })

        # -------------------------------------------------
        # 4. SEARCH RESUMES FOR CANDIDATES WHO APPLIED
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT DISTINCT
                applications.id AS application_id,
                users.name AS candidate_name,
                users.email AS candidate_email,
                jobs.title AS job_title
            FROM applications
            INNER JOIN users
                ON users.id = applications.candidate_id
            INNER JOIN jobs
                ON jobs.id = applications.job_id
            INNER JOIN resumes
                ON resumes.user_id = users.id
            WHERE jobs.recruiter_id = %s
            AND (
                users.name LIKE %s
                OR users.email LIKE %s
                OR resumes.original_filename LIKE %s
            )
            LIMIT 10
            """,
            (
                recruiter_id,
                search_value,
                search_value,
                search_value
            )
        )

        # -------------------------------------------------
        # ADD RESUME SEARCH RESULTS
        # -------------------------------------------------

        for resume in cursor.fetchall():
            results.append({
                "id": resume["application_id"],
                "title": (
                    f'{resume["candidate_name"]} - '
                    f'{resume["job_title"]} Resume'
                ),
                "candidate_name": resume["candidate_name"],
                "candidate_email": resume["candidate_email"],
                "job_title": resume["job_title"],
                "type": "Resume"
            })

        return jsonify({
            "success": True,
            "results": results
        }), 200

    except Exception as e:
        print("RECRUITER GLOBAL SEARCH ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Global search failed",
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# GET RECRUITER JOB DETAILS - DEBUG VERSION
# =========================================================

@recruiter_bp.route("/jobs/<int:job_id>", methods=["GET"])
@token_required
def get_recruiter_job_details(job_id):

    connection = None
    cursor = None

    try:
        recruiter_id = request.user["user_id"]

        print("\n========================================")
        print("JOB DETAILS DEBUG")
        print("URL JOB ID:", job_id)
        print("LOGGED-IN USER ID:", recruiter_id)
        print("LOGGED-IN ROLE:", request.user["role"])
        print("========================================")

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # -------------------------------------------------
        # STEP 1: Check whether this job exists at all
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                recruiter_id,
                title,
                description,
                required_skills,
                experience,
                location,
                salary,
                status,
                created_at
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        job = cursor.fetchone()

        print("DATABASE JOB:", job)

        # Job does not exist
        if not job:
            print("❌ JOB DOES NOT EXIST IN DATABASE")

            return jsonify({
                "success": False,
                "message": "Job does not exist",
                "job_id": job_id
            }), 404

        # -------------------------------------------------
        # STEP 2: Check ownership
        # -------------------------------------------------

        print("DATABASE RECRUITER ID:", job["recruiter_id"])
        print("LOGGED-IN RECRUITER ID:", recruiter_id)

        if int(job["recruiter_id"]) != int(recruiter_id):

            print("❌ RECRUITER DOES NOT OWN THIS JOB")

            return jsonify({
                "success": False,
                "message": "You are not authorized to view this job",
                "job_recruiter_id": job["recruiter_id"],
                "logged_in_recruiter_id": recruiter_id
            }), 403

        # -------------------------------------------------
        # STEP 3: Success
        # -------------------------------------------------

        print("✅ JOB FOUND AND OWNERSHIP VERIFIED")

        job.pop("recruiter_id", None)

        return jsonify({
            "success": True,
            "job": job
        }), 200

    except Exception as e:

        print("\n========================================")
        print("❌ JOB DETAILS ERROR")
        print(str(e))
        print("========================================")

        return jsonify({
            "success": False,
            "message": "Failed to fetch job details",
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
