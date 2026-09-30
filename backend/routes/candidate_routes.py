from flask import Blueprint, jsonify, request
from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required
from resume_analyzer import analyze_resume

candidate_bp = Blueprint("candidate", __name__)


@candidate_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_dashboard():

    connection = None
    cursor = None

    try:

        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # ==========================================
        # 1. TOTAL APPLIED JOBS
        # ==========================================

        cursor.execute("""
            SELECT COUNT(*) AS applied_jobs
            FROM applications
            WHERE candidate_id = %s
        """, (candidate_id,))

        application_result = cursor.fetchone()

        applied_jobs = application_result["applied_jobs"] or 0


        # ==========================================
        # 2. APPLICATIONS THIS WEEK
        # ==========================================

        cursor.execute("""
            SELECT COUNT(*) AS applications_this_week
            FROM applications
            WHERE candidate_id = %s
            AND applied_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        """, (candidate_id,))

        weekly_result = cursor.fetchone()

        applications_this_week = (
            weekly_result["applications_this_week"] or 0
        )


        # ==========================================
        # 3. GET LATEST RESUME
        # ==========================================

        cursor.execute("""
            SELECT
                id,
                extracted_text
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        resume = cursor.fetchone()


        # ==========================================
        # 4. CALCULATE RESUME SCORE
        # ==========================================

        resume_score = 0

        if resume and resume["extracted_text"]:

            analysis = analyze_resume(
                resume["extracted_text"]
            )

            print("RESUME ANALYSIS:", analysis)

            # Get score from analysis
            resume_score = analysis.get(
                "score",
                analysis.get("resume_score", 0)
            )

            if resume_score is None:
                resume_score = 0


        # ==========================================
        # 5. RESUME QUALITATIVE ASSESSMENT
        # ==========================================

        if resume_score >= 90:

            resume_assessment = "Excellent"

        elif resume_score >= 75:

            resume_assessment = "Good"

        elif resume_score >= 60:

            resume_assessment = "Average"

        else:

            resume_assessment = "Needs Improvement"


        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({

            "candidate": {

                "name": "Gautam Singh"

            },

            "overview": {

                "applied_jobs":
                    applied_jobs,

                "applications_this_week":
                    applications_this_week,

                "resume_score":
                    resume_score,

                "resume_assessment":
                    resume_assessment,

                "interviews_completed":
                    4

            }

        }), 200


    except Exception as e:

        print(
            "Candidate dashboard error:",
            e
        )

        return jsonify({

            "message":
                "Failed to fetch candidate dashboard data",

            "error":
                str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

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

# =========================================================
# CANDIDATE ACTIVE JOBS
# =========================================================

@candidate_bp.route("/jobs", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_jobs():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                title
            FROM jobs
            WHERE status = 'Active'
            ORDER BY created_at DESC
        """)

        jobs = cursor.fetchall()

        return jsonify({
            "message": "Active jobs fetched successfully",
            "jobs": jobs
        }), 200

    except Exception as e:

        print("CANDIDATE JOBS ERROR:", str(e))

        return jsonify({
            "message": "Failed to fetch active jobs",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# CANDIDATE SKILL GAP ANALYSIS
# =========================================================

@candidate_bp.route("/skill-gap", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_skill_gap():

    connection = None
    cursor = None

    try:

        # =====================================================
        # LOGGED-IN CANDIDATE
        # =====================================================

        candidate_id = request.user["user_id"]


        # =====================================================
        # TARGET JOB ID
        # =====================================================

        job_id = request.args.get("job_id")


        if not job_id:

            return jsonify({
                "message": "job_id is required"
            }), 400


        # =====================================================
        # DATABASE CONNECTION
        # =====================================================

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )


        # =====================================================
        # GET CANDIDATE RESUME
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                extracted_text
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        resume = cursor.fetchone()


        if not resume:

            return jsonify({

                "message":
                    "No resume found for this candidate"

            }), 404


        # =====================================================
        # GET TARGET JOB
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                title,
                required_skills
            FROM jobs
            WHERE id = %s
            AND status = 'Active'
        """, (job_id,))

        job = cursor.fetchone()


        if not job:

            return jsonify({

                "message":
                    "Job not found"

            }), 404


        # =====================================================
        # RESUME TEXT
        # =====================================================

        resume_text = (
            resume["extracted_text"] or ""
        ).lower()


        # =====================================================
        # REQUIRED SKILLS
        # =====================================================

        required_skills_text = (
            job["required_skills"] or ""
        )


        # =====================================================
        # CONVERT REQUIRED SKILLS TO LIST
        # =====================================================

        required_skills = [

            skill.strip()

            for skill in
            required_skills_text.split(",")

            if skill.strip()

        ]


        # =====================================================
        # COMPARE SKILLS
        # =====================================================

        your_skills = []

        missing_skills = []


        for skill in required_skills:

            if skill.lower() in resume_text:

                your_skills.append(skill)

            else:

                missing_skills.append(skill)


        # =====================================================
        # CALCULATE SKILL MATCH
        # =====================================================

        total_required = len(
            required_skills
        )

        total_matched = len(
            your_skills
        )


        if total_required > 0:

            overall_skill_match = round(
                (
                    total_matched /
                    total_required
                ) * 100
            )

        else:

            overall_skill_match = 0


        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Skill gap analysis fetched successfully",

            "target_job": {

                "id":
                    job["id"],

                "title":
                    job["title"]

            },

            "overall_skill_match":
                overall_skill_match,

            "your_skills":
                your_skills,

            "missing_skills":
                missing_skills,

            "required_skills":
                required_skills

        }), 200


    except Exception as e:

        print(
            "SKILL GAP ERROR:",
            str(e)
        )


        return jsonify({

            "message":
                "Failed to fetch skill gap analysis",

            "error":
                str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# CANDIDATE CAREER RECOMMENDATION
# =========================================================

@candidate_bp.route("/career-recommendation", methods=["GET"])
@token_required
@role_required("Candidate")
def career_recommendation():

    connection = None
    cursor = None

    try:

        # =====================================================
        # LOGGED-IN CANDIDATE
        # =====================================================

        candidate_id = request.user["user_id"]

        # =====================================================
        # DATABASE CONNECTION
        # =====================================================

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # =====================================================
        # GET LATEST RESUME
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                extracted_text
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        resume = cursor.fetchone()

        if not resume:

            return jsonify({
                "message": "No resume found for this candidate"
            }), 404

        # =====================================================
        # RESUME TEXT
        # =====================================================

        resume_text = (
            resume["extracted_text"] or ""
        ).lower()

        if not resume_text.strip():

            return jsonify({
                "message": "Resume text is empty. Please upload a resume."
            }), 400

        # =====================================================
        # GET ACTIVE JOBS
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                title,
                required_skills
            FROM jobs
            WHERE status = 'Active'
            ORDER BY created_at DESC
        """)

        jobs = cursor.fetchall()

        if not jobs:

            return jsonify({
                "message": "No active careers/jobs found"
            }), 404

        # =====================================================
        # CAREER RECOMMENDATIONS
        # =====================================================

        recommendations = []

        for job in jobs:

            required_skills_text = (
                job["required_skills"] or ""
            )

            required_skills = [
                skill.strip()
                for skill in required_skills_text.split(",")
                if skill.strip()
            ]

            matched_skills = []
            missing_skills = []

            for skill in required_skills:

                if skill.lower() in resume_text:
                    matched_skills.append(skill)
                else:
                    missing_skills.append(skill)

            total_required = len(required_skills)
            total_matched = len(matched_skills)

            if total_required > 0:

                match_percentage = round(
                    (total_matched / total_required) * 100
                )

            else:

                match_percentage = 0

            recommendations.append({

                "job_id": job["id"],

                "career": job["title"],

                "match_percentage": match_percentage,

                "matched_skills": matched_skills,

                "missing_skills": missing_skills,

                "required_skills": required_skills

            })

        # =====================================================
        # SORT BY MATCH PERCENTAGE
        # =====================================================

        recommendations.sort(
            key=lambda x: x["match_percentage"],
            reverse=True
        )

        # =====================================================
        # BEST CAREER
        # =====================================================

        best_career = recommendations[0]

        # =====================================================
        # OTHER CAREERS
        # =====================================================

        other_careers = recommendations[1:]

        # =====================================================
        # WHY THIS CAREER
        # =====================================================

        why_this_career = []

        for skill in best_career["matched_skills"]:

            why_this_career.append(
                f"Strong {skill} Skills"
            )

        # =====================================================
        # RECOMMENDED CERTIFICATIONS
        # =====================================================

        certification_map = {

            "python": "Python Programming Certification",

            "sql": "SQL Certification",

            "machine learning":
                "Machine Learning Certification",

            "deep learning":
                "Deep Learning Certification",

            "aws":
                "AWS Certified Machine Learning",

            "tensorflow":
                "TensorFlow Developer Certification",

            "data analysis":
                "Google Data Analytics Professional Certificate",

            "azure":
                "Microsoft Azure AI Fundamentals"

        }

        recommended_certifications = []

        for skill in best_career["missing_skills"]:

            skill_key = skill.lower()

            if skill_key in certification_map:

                recommended_certifications.append(
                    certification_map[skill_key]
                )

        # Add certifications based on matched skills
        # if there are not enough recommendations.

        if len(recommended_certifications) < 4:

            for skill in best_career["matched_skills"]:

                skill_key = skill.lower()

                if skill_key in certification_map:

                    certification = certification_map[skill_key]

                    if certification not in recommended_certifications:

                        recommended_certifications.append(
                            certification
                        )

                if len(recommended_certifications) >= 4:
                    break

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({

            "message":
                "Career recommendations generated successfully",

            "best_career": {

                "job_id":
                    best_career["job_id"],

                "career":
                    best_career["career"],

                "match_percentage":
                    best_career["match_percentage"],

                "matched_skills":
                    best_career["matched_skills"],

                "missing_skills":
                    best_career["missing_skills"]

            },

            "other_careers": [

                {
                    "job_id":
                        career["job_id"],

                    "career":
                        career["career"],

                    "match_percentage":
                        career["match_percentage"]

                }

                for career in other_careers
            ],

            "why_this_career":
                why_this_career,

            "recommended_certifications":
                recommended_certifications

        }), 200

    except Exception as e:

        print(
            "CAREER RECOMMENDATION ERROR:",
            str(e)
        )

        return jsonify({

            "message":
                "Failed to generate career recommendations",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()