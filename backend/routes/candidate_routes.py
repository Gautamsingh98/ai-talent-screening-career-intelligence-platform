from flask import Blueprint, jsonify, request, send_file
from database import get_db_connection
from middleware.auth_middleware import token_required
from middleware.role_middleware import role_required
from resume_analyzer import analyze_resume

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.units import inch
from io import BytesIO

candidate_bp = Blueprint("candidate", __name__)

@candidate_bp.route("/dashboard", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_dashboard():

    connection = None
    cursor = None

    try:

        # =====================================================
        # 1. LOGGED-IN CANDIDATE
        # =====================================================

        candidate_id = request.user["user_id"]


        # =====================================================
        # 2. DATABASE CONNECTION
        # =====================================================

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )


        # =====================================================
        # 3. GET CANDIDATE INFORMATION
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                name,
                email
            FROM users
            WHERE id = %s
        """, (candidate_id,))

        candidate = cursor.fetchone()


        if not candidate:

            return jsonify({

                "success": False,

                "message":
                    "Candidate not found"

            }), 404


        candidate_name = (
            candidate["name"]
            or "Candidate"
        )


        # =====================================================
        # 4. TOTAL APPLIED JOBS
        # =====================================================

        cursor.execute("""
            SELECT
                COUNT(*) AS applied_jobs
            FROM applications
            WHERE candidate_id = %s
        """, (candidate_id,))

        application_result = cursor.fetchone()

        applied_jobs = int(
            application_result["applied_jobs"] or 0
        )


        # =====================================================
        # 5. APPLICATIONS THIS WEEK
        # =====================================================

        cursor.execute("""
            SELECT
                COUNT(*) AS applications_this_week
            FROM applications
            WHERE candidate_id = %s
            AND applied_at >= DATE_SUB(
                NOW(),
                INTERVAL 7 DAY
            )
        """, (candidate_id,))

        weekly_result = cursor.fetchone()

        applications_this_week = int(
            weekly_result["applications_this_week"] or 0
        )


        # =====================================================
        # 6. GET LATEST RESUME
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                original_filename,
                extracted_text,
                uploaded_at
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_resume = cursor.fetchone()


        # =====================================================
        # 7. RESUME SCORE + TOP SKILLS
        # =====================================================

        resume_score = 0
        top_skills = []


        if (
            latest_resume
            and latest_resume["extracted_text"]
        ):

            analysis = analyze_resume(
                latest_resume["extracted_text"]
            )

            print(
                "DASHBOARD RESUME ANALYSIS:",
                analysis
            )


            # -------------------------------------------------
            # Resume score
            # -------------------------------------------------

            resume_score = analysis.get(
                "score",
                analysis.get(
                    "resume_score",
                    0
                )
            )

            if resume_score is None:
                resume_score = 0

            resume_score = round(
                float(resume_score)
            )


            # -------------------------------------------------
            # Top skills
            #
            # Supports common possible keys returned by
            # analyze_resume()
            # -------------------------------------------------

            extracted_skills = analysis.get(
                "skills",
                analysis.get(
                    "top_skills",
                    []
                )
            )


            if isinstance(
                extracted_skills,
                list
            ):

                top_skills = [
                    str(skill)
                    for skill in extracted_skills
                    if skill
                ][:5]


        # =====================================================
        # 8. RESUME ASSESSMENT
        # =====================================================

        if resume_score >= 90:

            resume_assessment = "Excellent"

        elif resume_score >= 75:

            resume_assessment = "Good"

        elif resume_score >= 60:

            resume_assessment = "Average"

        else:

            resume_assessment = "Needs Improvement"


        # =====================================================
        # 9. INTERVIEW STATISTICS
        # =====================================================

        cursor.execute("""
            SELECT
                COUNT(*) AS completed_interviews,
                AVG(total_score) AS average_score,
                MAX(total_score) AS best_score
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Completed'
        """, (candidate_id,))

        interview_result = cursor.fetchone()


        interviews_completed = int(
            interview_result["completed_interviews"] or 0
        )

        interview_average = round(
            float(
                interview_result["average_score"] or 0
            )
        )

        interview_best = round(
            float(
                interview_result["best_score"] or 0
            )
        )


        # =====================================================
        # 10. PROFILE STRENGTH
        # =====================================================
        #
        # Since there is currently no separate profile table,
        # calculate profile strength from available candidate data.
        #
        # 20 points = name
        # 20 points = email
        # 30 points = resume
        # 15 points = skills
        # 15 points = interview activity
        #

        profile_strength = 0


        if candidate_name.strip():

            profile_strength += 20


        if candidate["email"]:

            profile_strength += 20


        if latest_resume:

            profile_strength += 30


        if top_skills:

            profile_strength += 15


        if interviews_completed > 0:

            profile_strength += 15


        profile_strength = min(
            profile_strength,
            100
        )


        # =====================================================
        # 11. RESUME TEXT
        # =====================================================

        resume_text = ""

        if latest_resume:

            resume_text = (
                latest_resume["extracted_text"]
                or ""
            ).lower()


        # =====================================================
        # 12. RECOMMENDED JOBS
        # =====================================================

        recommended_jobs = []


        cursor.execute("""
            SELECT
                id,
                title,
                description,
                required_skills,
                experience,
                location,
                salary
            FROM jobs
            WHERE status = 'Active'
            ORDER BY created_at DESC
        """)

        active_jobs = cursor.fetchall()


        for job in active_jobs:

            required_skills_text = (
                job["required_skills"]
                or ""
            )


            required_skills = [

                skill.strip()

                for skill in
                required_skills_text.split(",")

                if skill.strip()

            ]


            matched_skills = []

            for skill in required_skills:

                if skill.lower() in resume_text:

                    matched_skills.append(skill)


            if required_skills:

                match_percentage = round(
                    (
                        len(matched_skills)
                        /
                        len(required_skills)
                    ) * 100
                )

            else:

                match_percentage = 0


            recommended_jobs.append({

                "id":
                    job["id"],

                "title":
                    job["title"],

                "description":
                    job["description"],

                "required_skills":
                    required_skills,

                "experience":
                    job["experience"],

                "location":
                    job["location"],

                "salary":
                    job["salary"],

                "match_percentage":
                    match_percentage,

                "matched_skills":
                    matched_skills

            })


        # Highest matching jobs first

        recommended_jobs.sort(

            key=lambda x:
                x["match_percentage"],

            reverse=True

        )


        # Show maximum 4 jobs

        recommended_jobs = (
            recommended_jobs[:4]
        )


        # =====================================================
        # 13. SKILL GAP
        # =====================================================
        #
        # Use active jobs to identify skills that are commonly
        # required but missing from the candidate's resume.
        #

        skill_gap_map = {}


        for job in active_jobs:

            required_skills_text = (
                job["required_skills"]
                or ""
            )


            required_skills = [

                skill.strip()

                for skill in
                required_skills_text.split(",")

                if skill.strip()

            ]


            for skill in required_skills:

                if skill.lower() not in resume_text:

                    skill_key = skill.lower()


                    if skill_key not in skill_gap_map:

                        skill_gap_map[skill_key] = {

                            "skill":
                                skill,

                            "count":
                                0

                        }


                    skill_gap_map[
                        skill_key
                    ]["count"] += 1


        skill_gap = list(
            skill_gap_map.values()
        )


        # Sort by frequency

        skill_gap.sort(

            key=lambda x:
                x["count"],

            reverse=True

        )


        # Convert to dashboard-friendly format
        
        max_count = max(
        [item["count"] for item in skill_gap],
        default=0
        )
        
        skill_gap = [
            {
                "skill": item["skill"],
                "count": item["count"],
                "percentage": round(
                   (item["count"] / max_count) * 100
                ) if max_count > 0 else 0
            }
            for item in skill_gap[:5]
        ]


        # =====================================================
        # 14. WEAKEST INTERVIEW TOPIC / QUESTION
        # =====================================================
        #
        # There is currently no topic column in
        # interview_questions.
        #
        # Therefore use the lowest-scoring completed
        # interview question as the weakest area.
        #

        weakest_topic = {}


        cursor.execute("""
            SELECT
                interview_questions.id,
                interview_questions.question_text,
                interview_questions.score,
                interviews.job_role
            FROM interview_questions
            INNER JOIN interviews
                ON interview_questions.interview_id =
                   interviews.id
            WHERE interviews.candidate_id = %s
            AND interviews.status = 'Completed'
            AND interview_questions.score IS NOT NULL
            ORDER BY interview_questions.score ASC
            LIMIT 1
        """, (candidate_id,))

        weakest_question = cursor.fetchone()


        if weakest_question:

            weakest_topic = {

                "question_id":
                    weakest_question["id"],

                "question":
                    weakest_question["question_text"],

                "score":
                    round(
                        float(
                            weakest_question["score"]
                            or 0
                        )
                    ),

                "job_role":
                    weakest_question["job_role"]

            }


        # =====================================================
        # 15. CONTINUE PRACTICE
        # =====================================================

        continue_practice = None


        cursor.execute("""
            SELECT
                id,
                job_role,
                difficulty,
                current_question,
                total_questions,
                started_at
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Started'
            ORDER BY started_at DESC
            LIMIT 1
        """, (candidate_id,))

        active_interview = cursor.fetchone()


        if active_interview:

            continue_practice = {

                "interview_id":
                    active_interview["id"],

                "job_role":
                    active_interview["job_role"],

                "difficulty":
                    active_interview["difficulty"],

                "current_question":
                    active_interview["current_question"],

                "total_questions":
                    active_interview["total_questions"]

            }


        # =====================================================
        # 16. RECENT ACTIVITY
        # =====================================================

        recent_activity = []


        # -----------------------------------------------------
        # Resume uploaded
        # -----------------------------------------------------

        if latest_resume:

            recent_activity.append({

                "title":
                    "Resume Uploaded",

                "time":
                    latest_resume["uploaded_at"],

                "icon":
                    "resume",

                "color":
                    "blue"

            })


            # -------------------------------------------------
            # Resume analyzed
            # -------------------------------------------------

            if latest_resume["extracted_text"]:

                recent_activity.append({

                    "title":
                        "Resume Analyzed",

                    "time":
                        latest_resume["uploaded_at"],

                    "icon":
                        "analysis",

                    "color":
                        "purple"

                })


        # -----------------------------------------------------
        # Latest application
        # -----------------------------------------------------

        cursor.execute("""
            SELECT
                applications.applied_at,
                jobs.title
            FROM applications
            INNER JOIN jobs
                ON applications.job_id =
                   jobs.id
            WHERE applications.candidate_id = %s
            ORDER BY applications.applied_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_application = cursor.fetchone()


        if latest_application:

            recent_activity.append({

                "title":
                    f"Applied for {latest_application['title']}",

                "time":
                    latest_application["applied_at"],

                "icon":
                    "application",

                "color":
                    "green"

            })


        # -----------------------------------------------------
        # Latest completed interview
        # -----------------------------------------------------

        cursor.execute("""
            SELECT
                completed_at,
                job_role,
                total_score
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Completed'
            ORDER BY completed_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_interview = cursor.fetchone()


        if latest_interview:

            recent_activity.append({

                "title":
                    "Interview Completed",

                "time":
                    latest_interview["completed_at"],

                "icon":
                    "check",

                "color":
                    "orange"

            })


        # Sort recent activities

        recent_activity.sort(

            key=lambda x:
                x["time"] or "",

            reverse=True

        )


        # Latest 4 activities

        recent_activity = (
            recent_activity[:4]
        )


        # =====================================================
        # 17. FINAL RESPONSE
        # =====================================================

        return jsonify({

            "success": True,


            # =================================================
            # CANDIDATE
            # =================================================

            "candidate": {

                "id":
                    candidate["id"],

                "name":
                    candidate_name,

                "email":
                    candidate["email"]

            },


            # =================================================
            # OVERVIEW
            # =================================================

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
                    interviews_completed,

                "profile_strength":
                    profile_strength

            },


            # =================================================
            # RESUME
            # =================================================

            "resume": {

                "score":
                    resume_score,

                "assessment":
                    resume_assessment

            },


            # =================================================
            # TOP SKILLS
            # =================================================

            "top_skills":
                top_skills,


            # =================================================
            # RECOMMENDED JOBS
            # =================================================

            "recommended_jobs":
                recommended_jobs,


            # =================================================
            # SKILL GAP
            # =================================================

            "skill_gap":
                skill_gap,


            # =================================================
            # INTERVIEW PROGRESS
            # =================================================

            "interview_progress": {

                "completed_interviews": interviews_completed,
                "average_score": interview_average,
                "best_score": interview_best

            },


            # =================================================
            # WEAKEST TOPIC
            # =================================================

            "weakest_topic":
                weakest_topic,


            # =================================================
            # CONTINUE PRACTICE
            # =================================================

            "continue_practice":
                continue_practice,


            # =================================================
            # RECENT ACTIVITY
            # =================================================

            "recent_activity":
                recent_activity

        }), 200


    except Exception as e:

        print(
            "CANDIDATE DASHBOARD ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

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

# =========================================================
# CANDIDATE REPORTS & ANALYTICS
# =========================================================

@candidate_bp.route("/reports", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_reports():

    connection = None
    cursor = None

    try:

        # =====================================================
        # LOGGED-IN CANDIDATE
        # =====================================================

        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)


        # =====================================================
        # 1. RESUME SCORE
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                extracted_text,
                uploaded_at
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_resume = cursor.fetchone()

        resume_score = 0

        if latest_resume and latest_resume["extracted_text"]:

            analysis = analyze_resume(
                latest_resume["extracted_text"]
            )

            resume_score = analysis.get(
                "score",
                analysis.get("resume_score", 0)
            )

            if resume_score is None:
                resume_score = 0

            resume_score = round(float(resume_score))


        # =====================================================
        # 2. INTERVIEW SCORE
        # =====================================================

        cursor.execute("""
            SELECT
                AVG(total_score) AS average_score,
                COUNT(*) AS completed_interviews
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Completed'
        """, (candidate_id,))

        interview_result = cursor.fetchone()

        interview_score = round(
            float(
                interview_result["average_score"] or 0
            )
        )

        completed_interviews = int(
            interview_result["completed_interviews"] or 0
        )


        # =====================================================
        # 3. TOTAL JOBS APPLIED
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM applications
            WHERE candidate_id = %s
        """, (candidate_id,))

        jobs_applied_result = cursor.fetchone()

        jobs_applied = int(
            jobs_applied_result["total"] or 0
        )


        # =====================================================
        # 4. APPLICATIONS THIS WEEK
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM applications
            WHERE candidate_id = %s
            AND applied_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        """, (candidate_id,))

        weekly_result = cursor.fetchone()

        applications_this_week = int(
            weekly_result["total"] or 0
        )


        # =====================================================
        # 5. SKILL MATCH
        # =====================================================
        #
        # Compare candidate resume with all active jobs.
        # Reports uses the highest available match.
        #

        skill_match = 0

        best_skill_match_job = None

        if latest_resume and latest_resume["extracted_text"]:

            resume_text = (
                latest_resume["extracted_text"] or ""
            ).lower()

            cursor.execute("""
                SELECT
                    id,
                    title,
                    required_skills
                FROM jobs
                WHERE status = 'Active'
            """)

            active_jobs = cursor.fetchall()

            for job in active_jobs:

                required_skills_text = (
                    job["required_skills"] or ""
                )

                required_skills = [
                    skill.strip()
                    for skill in
                    required_skills_text.split(",")
                    if skill.strip()
                ]

                if not required_skills:
                    continue

                matched_count = 0

                for skill in required_skills:

                    if skill.lower() in resume_text:
                        matched_count += 1

                job_match = round(
                    (
                        matched_count /
                        len(required_skills)
                    ) * 100
                )

                if job_match > skill_match:

                    skill_match = job_match

                    best_skill_match_job = job["title"]


        # =====================================================
        # 6. RESUME SCORE TREND
        # =====================================================
        #
        # Re-analyze uploaded resumes so the chart represents
        # the candidate's actual resume history.
        #

        cursor.execute("""
            SELECT
                id,
                extracted_text,
                uploaded_at
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at ASC
        """, (candidate_id,))

        resume_history = cursor.fetchall()

        resume_trend = []

        for resume in resume_history:

            # Skip resumes where text extraction failed
            if not resume["extracted_text"]:
                continue

            analysis = analyze_resume(
                resume["extracted_text"]
                )

            score = analysis.get(
                    "score",
                    analysis.get("resume_score", 0)
                )

            if score is None:
                    score = 0

            score = round(float(score))

            resume_trend.append({

                "period":
                    resume["uploaded_at"].strftime(
                        "%b %d"
                    ),

                "score":
                    score

            })


        # =====================================================
        # 7. INTERVIEW PERFORMANCE TREND
        # =====================================================

        cursor.execute("""
            SELECT
                id,
                total_score,
                started_at
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Completed'
            ORDER BY started_at ASC
        """, (candidate_id,))

        interview_history = cursor.fetchall()

        interview_trend = []

        for index, interview in enumerate(
            interview_history
        ):

            interview_trend.append({

                "period":
                    f"I{index + 1}",

                "score":
                    round(
                        float(
                            interview["total_score"] or 0
                        )
                    )

            })


        # =====================================================
        # 8. AI CAREER INSIGHTS
        # =====================================================

        insights = []


        # SQL insight

        insights.append({
            "text": "Improve your SQL skills.",
            "type": "skill"
        })


        # Machine Learning interview insight

        insights.append({
            "text":
                "Practice Machine Learning interview questions.",
            "type": "interview"
        })


        # Project insight

        insights.append({
            "text":
                "Add one more Data Science project.",
            "type": "project"
        })


        # Resume insight

        if resume_score < 95:

            insights.append({
                "text":
                    "Resume ATS score can improve by 5%.",
                "type": "resume"
            })


        # Career readiness insight

        if interview_score >= 70:

            insights.append({
                "text":
                    "You are ready to apply for Junior Data Scientist roles.",
                "type": "career"
            })

        else:

            insights.append({
                "text":
                    "Complete more interview practice to improve your interview performance.",
                "type": "career"
            })


        # =====================================================
        # 9. ACHIEVEMENTS
        # =====================================================

        achievements = []


        # Resume Master

        if resume_score >= 90:

            achievements.append({

                "title":
                    "Resume Master",

                "description":
                    "Resume Score Above 90%",

                "icon":
                    "trophy",

                "color":
                    "gold"

            })


        # Interview Expert

        if completed_interviews >= 5:

            achievements.append({

                "title":
                    "Interview Expert",

                "description":
                    "Completed 5 AI Interviews",

                "icon":
                    "star",

                "color":
                    "blue"

            })


        # Top Performer

        if skill_match >= 90:

            achievements.append({

                "title":
                    "Top Performer",

                "description":
                    "Top 10% Candidate",

                "icon":
                    "target",

                "color":
                    "red"

            })


        # Active Applicant

        if jobs_applied >= 15:

            achievements.append({

                "title":
                    "Active Applicant",

                "description":
                    f"Applied to {jobs_applied} Jobs",

                "icon":
                    "rocket",

                "color":
                    "green"

            })


        # =====================================================
        # 10. RECENT ACTIVITY
        # =====================================================

        activities = []


        # -----------------------------------------------------
        # Resume uploaded
        # -----------------------------------------------------

        cursor.execute("""
            SELECT
                uploaded_at
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_resume_activity = cursor.fetchone()

        if latest_resume_activity:

            activities.append({

                "title":
                    "Resume Uploaded",

                "time":
                    latest_resume_activity["uploaded_at"],

                "icon":
                    "resume",

                "color":
                    "blue"

            })


        # -----------------------------------------------------
        # Resume analyzed
        # -----------------------------------------------------

        if latest_resume:

            activities.append({

                "title":
                    "Resume Analyzed",

                "time":
                    latest_resume["uploaded_at"],

                "icon":
                    "analysis",

                "color":
                    "purple"

            })


        # -----------------------------------------------------
        # Latest application
        # -----------------------------------------------------

        cursor.execute("""
            SELECT
                applications.applied_at,
                jobs.title
            FROM applications
            INNER JOIN jobs
                ON applications.job_id = jobs.id
            WHERE applications.candidate_id = %s
            ORDER BY applications.applied_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_application = cursor.fetchone()

        if latest_application:

            activities.append({

                "title":
                    f"Applied for {latest_application['title']}",

                "time":
                    latest_application["applied_at"],

                "icon":
                    "application",

                "color":
                    "green"

            })


        # -----------------------------------------------------
        # Latest completed interview
        # -----------------------------------------------------

        cursor.execute("""
            SELECT
                completed_at,
                job_role
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Completed'
            ORDER BY completed_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_interview = cursor.fetchone()

        if latest_interview:

            activities.append({

                "title":
                    "Interview Completed",

                "time":
                    latest_interview["completed_at"],

                "icon":
                    "check",

                "color":
                    "orange"

            })


        # =====================================================
        # SORT ACTIVITIES
        # =====================================================

        activities.sort(
            key=lambda x: x["time"] or "",
            reverse=True
        )


        # Only show latest 4

        activities = activities[:4]


        # =====================================================
        # 11. FINAL RESPONSE
        # =====================================================

        return jsonify({

            "success": True,

            "metrics": {

                "resume_score":
                    resume_score,

                "interview_score":
                    interview_score,

                "jobs_applied":
                    jobs_applied,

                "applications_this_week":
                    applications_this_week,

                "skill_match":
                    skill_match,

                "completed_interviews":
                    completed_interviews

            },

            "charts": {

                "resume_trend":
                    resume_trend,

                "interview_performance":
                    interview_trend

            },

            "insights":
                insights,

            "achievements":
                achievements,

            "activities":
                activities

        }), 200


    except Exception as e:

        print(
            "CANDIDATE REPORTS ERROR:",
            str(e)
        )

        return jsonify({

            "success":
                False,

            "message":
                "Failed to fetch candidate reports",

            "error":
                str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# CANDIDATE REPORT PDF
# =========================================================

@candidate_bp.route("/reports/pdf", methods=["GET"])
@token_required
@role_required("Candidate")
def candidate_reports_pdf():

    connection = None
    cursor = None

    try:

        # =====================================================
        # LOGGED-IN CANDIDATE
        # =====================================================

        candidate_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)


        # =====================================================
        # CANDIDATE NAME
        # =====================================================

        cursor.execute("""
            SELECT
                name,
                email
            FROM users
            WHERE id = %s
        """, (candidate_id,))

        candidate = cursor.fetchone()

        candidate_name = (
            candidate["name"]
            if candidate
            else "Candidate"
        )

        candidate_email = (
            candidate["email"]
            if candidate
            else ""
        )


        # =====================================================
        # 1. RESUME SCORE
        # =====================================================

        cursor.execute("""
            SELECT
                extracted_text
            FROM resumes
            WHERE user_id = %s
            ORDER BY uploaded_at DESC
            LIMIT 1
        """, (candidate_id,))

        latest_resume = cursor.fetchone()

        resume_score = 0

        if (
            latest_resume
            and latest_resume["extracted_text"]
        ):

            analysis = analyze_resume(
                latest_resume["extracted_text"]
            )

            resume_score = analysis.get(
                "score",
                analysis.get("resume_score", 0)
            )

            resume_score = round(
                float(resume_score or 0)
            )


        # =====================================================
        # 2. INTERVIEW SCORE
        # =====================================================

        cursor.execute("""
            SELECT
                AVG(total_score) AS average_score,
                COUNT(*) AS completed_interviews
            FROM interviews
            WHERE candidate_id = %s
            AND status = 'Completed'
        """, (candidate_id,))

        interview_result = cursor.fetchone()

        interview_score = round(
            float(
                interview_result["average_score"] or 0
            )
        )

        completed_interviews = int(
            interview_result["completed_interviews"] or 0
        )


        # =====================================================
        # 3. JOBS APPLIED
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM applications
            WHERE candidate_id = %s
        """, (candidate_id,))

        jobs_applied = int(
            cursor.fetchone()["total"] or 0
        )


        # =====================================================
        # 4. APPLICATIONS THIS WEEK
        # =====================================================

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM applications
            WHERE candidate_id = %s
            AND applied_at >= DATE_SUB(
                NOW(),
                INTERVAL 7 DAY
            )
        """, (candidate_id,))

        applications_this_week = int(
            cursor.fetchone()["total"] or 0
        )


        # =====================================================
        # 5. SKILL MATCH
        # =====================================================

        skill_match = 0

        if (
            latest_resume
            and latest_resume["extracted_text"]
        ):

            resume_text = (
                latest_resume["extracted_text"]
                or ""
            ).lower()

            cursor.execute("""
                SELECT
                    required_skills
                FROM jobs
                WHERE status = 'Active'
            """)

            active_jobs = cursor.fetchall()

            for job in active_jobs:

                required_skills_text = (
                    job["required_skills"] or ""
                )

                required_skills = [
                    skill.strip()
                    for skill in
                    required_skills_text.split(",")
                    if skill.strip()
                ]

                if not required_skills:
                    continue

                matched_count = 0

                for skill in required_skills:

                    if skill.lower() in resume_text:
                        matched_count += 1

                job_match = round(
                    (
                        matched_count /
                        len(required_skills)
                    ) * 100
                )

                skill_match = max(
                    skill_match,
                    job_match
                )


        # =====================================================
        # 6. AI INSIGHTS
        # =====================================================

        insights = [

            "Improve your SQL skills.",

            "Practice Machine Learning interview questions.",

            "Add one more Data Science project.",

            "Resume ATS score can improve by 5%."

        ]

        if interview_score >= 70:

            insights.append(
                "You are ready to apply for Junior Data Scientist roles."
            )

        else:

            insights.append(
                "Complete more interview practice to improve your interview performance."
            )


        # =====================================================
        # 7. ACHIEVEMENTS
        # =====================================================

        achievements = []

        if resume_score >= 90:

            achievements.append(
                "Resume Master - Resume Score Above 90%"
            )

        if completed_interviews >= 5:

            achievements.append(
                "Interview Expert - Completed 5 AI Interviews"
            )

        if skill_match >= 90:

            achievements.append(
                "Top Performer - Top 10% Candidate"
            )

        if jobs_applied >= 15:

            achievements.append(
                f"Active Applicant - Applied to {jobs_applied} Jobs"
            )


        # =====================================================
        # 8. CREATE PDF IN MEMORY
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


        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontSize=22,
            spaceAfter=10
        )


        heading_style = ParagraphStyle(
            "Heading",
            parent=styles["Heading2"],
            fontSize=15,
            spaceBefore=15,
            spaceAfter=8
        )


        normal_style = ParagraphStyle(
            "NormalText",
            parent=styles["BodyText"],
            fontSize=10,
            leading=14
        )


        # =====================================================
        # PDF CONTENT
        # =====================================================

        story = []


        # Title

        story.append(
            Paragraph(
                "AI Talent Screening & Career Intelligence Platform",
                title_style
            )
        )

        story.append(
            Paragraph(
                "Candidate Performance Report",
                styles["Heading2"]
            )
        )

        story.append(Spacer(1, 10))


        # Candidate information

        candidate_info = [
            ["Candidate", candidate_name],
            ["Email", candidate_email],
        ]

        candidate_table = Table(
            candidate_info,
            colWidths=[1.4 * inch, 4.8 * inch]
        )

        candidate_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("PADDING", (0, 0), (-1, -1), 7),
            ])
        )

        story.append(candidate_table)


        # =====================================================
        # PERFORMANCE SUMMARY
        # =====================================================

        story.append(
            Paragraph(
                "Performance Summary",
                heading_style
            )
        )

        metrics = [
            ["Metric", "Score / Value"],
            ["Resume Score", f"{resume_score}%"],
            ["Interview Score", f"{interview_score}%"],
            ["Jobs Applied", str(jobs_applied)],
            [
                "Applications This Week",
                str(applications_this_week)
            ],
            ["Skill Match", f"{skill_match}%"],
            [
                "Completed Interviews",
                str(completed_interviews)
            ],
        ]

        metrics_table = Table(
            metrics,
            colWidths=[3.5 * inch, 2.7 * inch]
        )

        metrics_table.setStyle(
            TableStyle([
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.lightgrey
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    7
                ),
            ])
        )

        story.append(metrics_table)


        # =====================================================
        # AI CAREER INSIGHTS
        # =====================================================

        story.append(
            Paragraph(
                "AI Career Insights",
                heading_style
            )
        )

        for insight in insights:

            story.append(
                Paragraph(
                    f"• {insight}",
                    normal_style
                )
            )

            story.append(
                Spacer(1, 4)
            )


        # =====================================================
        # ACHIEVEMENTS
        # =====================================================

        story.append(
            Paragraph(
                "Achievements",
                heading_style
            )
        )

        if achievements:

            for achievement in achievements:

                story.append(
                    Paragraph(
                        f"• {achievement}",
                        normal_style
                    )
                )

                story.append(
                    Spacer(1, 4)
                )

        else:

            story.append(
                Paragraph(
                    "No achievements unlocked yet.",
                    normal_style
                )
            )


        # =====================================================
        # FOOTER
        # =====================================================

        story.append(Spacer(1, 20))

        story.append(
            Paragraph(
                "Generated by AI Talent Screening & Career Intelligence Platform",
                normal_style
            )
        )


        # Build PDF

        document.build(story)

        pdf_buffer.seek(0)


        # =====================================================
        # SEND PDF
        # =====================================================

        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name="Candidate_Report.pdf",
            mimetype="application/pdf"
        )


    except Exception as e:

        print(
            "CANDIDATE PDF REPORT ERROR:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to generate candidate PDF report",

            "error":
                str(e)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ============================================================
# CANDIDATE PROFILE
# ============================================================

@candidate_bp.route("/profile", methods=["GET"])
@token_required
@role_required("Candidate")
def get_candidate_profile():

    try:
        user_id = request.user["user_id"]

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                u.id,
                u.name,
                u.email,
                cp.phone,
                cp.university,
                cp.degree,
                cp.skills
            FROM users u
            LEFT JOIN candidate_profiles cp
                ON u.id = cp.user_id
            WHERE u.id = %s
              AND u.role = 'Candidate'
        """

        cursor.execute(query, (user_id,))
        profile = cursor.fetchone()

        cursor.close()
        connection.close()

        if not profile:
            return jsonify({
                "success": False,
                "message": "Candidate profile not found"
            }), 404

        # Convert skills string into a list
        skills = []

        if profile.get("skills"):
            skills = [
                skill.strip()
                for skill in profile["skills"].split(",")
                if skill.strip()
            ]

# ============================================================
# CALCULATE PROFILE COMPLETION
# ============================================================

        completion = 0

        if profile.get("name"):
            completion += 20

        if profile.get("email"):
            completion += 20

        if profile.get("phone"):
            completion += 15

        if profile.get("university"):
            completion += 15

        if profile.get("degree"):
            completion += 15

        if profile.get("skills"):
            completion += 15
       
        return jsonify({
            "success": True,
            "profile": {
                "id": profile["id"],
                "name": profile["name"],
                "email": profile["email"],
                "phone": profile["phone"],
                "university": profile["university"],
                "degree": profile["degree"],
                "skills": skills,
                "completion": completion
            }
        }), 200

    except Exception as e:

        print("Candidate profile error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to load candidate profile",
            "error": str(e)
        }), 500


@candidate_bp.route("/profile", methods=["PUT"])
@token_required
@role_required("Candidate")
def update_candidate_profile():

    try:
        user_id = request.user["user_id"]

        data = request.get_json()

        name = data.get("name")
        phone = data.get("phone")
        university = data.get("university")
        degree = data.get("degree")
        skills = data.get("skills", [])

        if not name:
            return jsonify({
                "success": False,
                "message": "Name is required"
            }), 400

        # Convert skills list to comma-separated string
        if isinstance(skills, list):
            skills_string = ", ".join(
                str(skill).strip()
                for skill in skills
                if str(skill).strip()
            )
        else:
            skills_string = str(skills).strip()

        connection = get_db_connection()
        cursor = connection.cursor()

        # Update name in users table
        cursor.execute(
            """
            UPDATE users
            SET name = %s
            WHERE id = %s
              AND role = 'Candidate'
            """,
            (name, user_id)
        )

        # Check whether profile already exists
        cursor.execute(
            """
            SELECT id
            FROM candidate_profiles
            WHERE user_id = %s
            """,
            (user_id,)
        )

        existing_profile = cursor.fetchone()

        if existing_profile:

            cursor.execute(
                """
                UPDATE candidate_profiles
                SET
                    phone = %s,
                    university = %s,
                    degree = %s,
                    skills = %s
                WHERE user_id = %s
                """,
                (
                    phone,
                    university,
                    degree,
                    skills_string,
                    user_id
                )
            )

        else:

            cursor.execute(
                """
                INSERT INTO candidate_profiles
                    (
                        user_id,
                        phone,
                        university,
                        degree,
                        skills
                    )
                VALUES
                    (%s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    phone,
                    university,
                    degree,
                    skills_string
                )
            )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        }), 200

    except Exception as e:

        print("Update candidate profile error:", e)

        return jsonify({
            "success": False,
            "message": "Failed to update candidate profile",
            "error": str(e)
        }), 500