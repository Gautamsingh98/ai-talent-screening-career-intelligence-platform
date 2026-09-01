# =========================
# JOB MATCHING
# =========================

def calculate_job_match(resume_skills, required_skills):
    """
    Calculate how well a candidate's skills
    match the skills required by a job.
    """

    if not required_skills:
        return {
            "match_percentage": 0,
            "matched_skills": [],
            "missing_skills": []
        }

    # Convert resume skills to lowercase
    candidate_skills = {
        skill.strip().lower()
        for skill in resume_skills
    }

    # Convert job skills to lowercase
    job_skills = {
        skill.strip().lower()
        for skill in required_skills.split(",")
        if skill.strip()
    }

    if not job_skills:
        return {
            "match_percentage": 0,
            "matched_skills": [],
            "missing_skills": []
        }

    # Find matched skills
    matched_skills = candidate_skills.intersection(
        job_skills
    )

    # Find missing skills
    missing_skills = job_skills - candidate_skills

    # Calculate percentage
    match_percentage = (
        len(matched_skills) / len(job_skills)
    ) * 100

    return {
        "match_percentage": round(
            match_percentage,
            2
        ),
        "matched_skills": sorted(
            matched_skills
        ),
        "missing_skills": sorted(
            missing_skills
        )
    }