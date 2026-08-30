import re


# =========================
# SKILLS DATABASE
# =========================

SKILLS = [
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
    "AWS",
]


# =========================
# EXTRACT SKILLS
# =========================

def extract_skills(text):

    found_skills = []

    text_lower = text.lower()

    for skill in SKILLS:

        if skill.lower() in text_lower:

            found_skills.append(skill)

    return found_skills


# =========================
# EXTRACT EDUCATION
# =========================

def extract_education(text):

    education_keywords = [
        "bachelor",
        "b.tech",
        "btech",
        "bca",
        "bit",
        "master",
        "m.tech",
        "mca",
        "mba",
        "degree",
        "university",
        "college",
    ]

    education = []

    lines = text.split("\n")

    for line in lines:

        line_clean = line.strip()

        if not line_clean:
            continue

        line_lower = line_clean.lower()

        for keyword in education_keywords:

            if keyword in line_lower:

                education.append(line_clean)

                break

    return education[:10]


# =========================
# EXTRACT EXPERIENCE
# =========================

def extract_experience(text):

    experience = []

    lines = text.split("\n")

    for line in lines:

        line_clean = line.strip()

        if not line_clean:
            continue

        if re.search(
            r"\b\d+\+?\s*(years?|yrs?)\b",
            line_clean,
            re.IGNORECASE
        ):

            experience.append(line_clean)

    return experience[:10]


# =========================
# CALCULATE SCORE
# =========================

def calculate_score(
    skills,
    education,
    experience
):

    score = 0


    # Skills

    if len(skills) >= 10:

        score += 40

    elif len(skills) >= 7:

        score += 30

    elif len(skills) >= 4:

        score += 20

    elif len(skills) >= 1:

        score += 10


    # Education

    if len(education) >= 2:

        score += 30

    elif len(education) >= 1:

        score += 20


    # Experience

    if len(experience) >= 2:

        score += 30

    elif len(experience) >= 1:

        score += 20


    return min(score, 100)


# =========================
# STRENGTHS
# =========================

def generate_strengths(
    skills,
    education,
    experience
):

    strengths = []


    if len(skills) >= 7:

        strengths.append(
            "Strong technical skill set"
        )

    elif len(skills) >= 4:

        strengths.append(
            "Good technical foundation"
        )

    elif len(skills) > 0:

        strengths.append(
            "Technical skills are present"
        )


    if len(education) > 0:

        strengths.append(
            "Educational background is included"
        )


    if len(experience) > 0:

        strengths.append(
            "Professional experience is mentioned"
        )


    if not strengths:

        strengths.append(
            "Resume contains basic candidate information"
        )


    return strengths


# =========================
# WEAKNESSES
# =========================

def generate_weaknesses(
    skills,
    education,
    experience
):

    weaknesses = []


    if len(skills) < 5:

        weaknesses.append(
            "Technical skills section could be stronger"
        )


    if len(education) == 0:

        weaknesses.append(
            "Education information is missing or unclear"
        )


    if len(experience) == 0:

        weaknesses.append(
            "Work experience is missing or unclear"
        )


    if len(weaknesses) == 0:

        weaknesses.append(
            "Resume has no major weaknesses detected"
        )


    return weaknesses


# =========================
# RECOMMENDATIONS
# =========================

def generate_recommendations(
    skills,
    education,
    experience
):

    recommendations = []


    if len(skills) < 5:

        recommendations.append(
            "Add more relevant technical skills"
        )


    if "Git" not in skills and "GitHub" not in skills:

        recommendations.append(
            "Consider adding Git and GitHub experience"
        )


    if len(experience) == 0:

        recommendations.append(
            "Add internships, projects, or work experience"
        )


    if len(education) == 0:

        recommendations.append(
            "Clearly mention your degree and university"
        )


    recommendations.append(
        "Add measurable achievements to projects and experience"
    )


    recommendations.append(
        "Keep the resume concise and focused on the target job"
    )


    return recommendations


# =========================
# COMPLETE ANALYSIS
# =========================

def analyze_resume(text):

    skills = extract_skills(text)

    education = extract_education(text)

    experience = extract_experience(text)

    score = calculate_score(
        skills,
        education,
        experience
    )

    strengths = generate_strengths(
        skills,
        education,
        experience
    )

    weaknesses = generate_weaknesses(
        skills,
        education,
        experience
    )

    recommendations = generate_recommendations(
        skills,
        education,
        experience
    )


    return {

        "score": score,

        "skills": skills,

        "education": education,

        "experience": experience,

        "strengths": strengths,

        "weaknesses": weaknesses,

        "recommendations": recommendations
    }