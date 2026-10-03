from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re


# Load the AI model
model = SentenceTransformer("all-MiniLM-L6-v2")


def clean_text(text):
    """
    Clean text before processing.
    """

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def calculate_semantic_similarity(
    candidate_answer,
    correct_answer
):
    """
    Compare candidate answer with the expected answer
    using Sentence Transformers.
    """

    candidate = clean_text(
        candidate_answer
    )

    correct = clean_text(
        correct_answer
    )

    if not candidate or not correct:
        return 0.0

    embeddings = model.encode(
        [candidate, correct]
    )

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    score = max(
        0,
        min(
            100,
            float(similarity) * 100
        )
    )

    return float(
        round(score, 2)
    )


def extract_keywords(correct_answer):
    """
    Extract important keywords from the correct answer.
    """

    text = clean_text(
        correct_answer
    )

    words = text.split()

    stop_words = {
        "the",
        "a",
        "an",
        "is",
        "are",
        "and",
        "or",
        "of",
        "to",
        "in",
        "on",
        "for",
        "with",
        "from",
        "that",
        "this",
        "it",
        "as",
        "by"
    }

    keywords = [
        word
        for word in words
        if len(word) > 3
        and word not in stop_words
    ]

    return list(
        dict.fromkeys(keywords)
    )


def calculate_keyword_score(
    candidate_answer,
    correct_answer
):
    """
    Calculate how many important keywords
    from the correct answer appear in
    the candidate answer.
    """

    candidate = clean_text(
        candidate_answer
    )

    keywords = extract_keywords(
        correct_answer
    )

    if not keywords:
        return 0.0

    matched = 0

    for keyword in keywords:

        if keyword in candidate:
            matched += 1

    score = (
        matched /
        len(keywords)
    ) * 100

    return float(
        round(score, 2)
    )


def calculate_completeness_score(
    candidate_answer
):
    """
    Estimate answer completeness based
    on the amount of explanation.
    """

    if not candidate_answer:
        return 0.0

    word_count = len(
        candidate_answer.split()
    )

    if word_count < 5:
        return 20.0

    if word_count < 15:
        return 50.0

    if word_count < 30:
        return 75.0

    return 100.0


def evaluate_answer(
    answer,
    question,
    correct_answer,
    job_role
):
    """
    Evaluate candidate answer using:

    1. Semantic similarity - 50%
    2. Technical keywords - 30%
    3. Completeness - 20%
    """

    if not answer or not answer.strip():

        return {
            "score": 0,
            "feedback": "No answer was provided.",
            "strengths": [],
            "improvements": [
                "Provide an answer to the question.",
                "Explain the concept clearly.",
                "Include technical details and examples."
            ],
            "semantic_score": 0.0,
            "keyword_score": 0.0,
            "completeness_score": 0.0
        }

    semantic_score = (
        calculate_semantic_similarity(
            answer,
            correct_answer
        )
    )

    keyword_score = (
        calculate_keyword_score(
            answer,
            correct_answer
        )
    )

    completeness_score = (
        calculate_completeness_score(
            answer
        )
    )

    # Final weighted score
    final_score = (
        semantic_score * 0.50
        +
        keyword_score * 0.30
        +
        completeness_score * 0.20
    )

    final_score = round(
        final_score
    )

    strengths = []
    improvements = []

    # Semantic evaluation
    if semantic_score >= 70:

        strengths.append(
            "Answer is semantically similar to the expected concept."
        )

    else:

        improvements.append(
            "Explain the main concept more accurately."
        )

    # Keyword evaluation
    if keyword_score >= 60:

        strengths.append(
            "Includes important technical concepts."
        )

    else:

        improvements.append(
            "Include more relevant technical keywords."
        )

    # Completeness evaluation
    if completeness_score >= 75:

        strengths.append(
            "Answer provides reasonable detail."
        )

    else:

        improvements.append(
            "Provide a more complete explanation."
        )

    # Overall feedback
    if final_score >= 85:

        feedback = (
            "Excellent answer. "
            "The response demonstrates strong "
            "understanding of the expected concept."
        )

    elif final_score >= 70:

        feedback = (
            "Good answer. "
            "The main concept is understood, "
            "but additional technical detail "
            "could improve the response."
        )

    elif final_score >= 50:

        feedback = (
            "Average answer. "
            "Some relevant understanding is present, "
            "but the explanation needs more depth."
        )

    else:

        feedback = (
            "The answer needs improvement. "
            "Focus on the main concept and "
            "include relevant technical details."
        )

    # Return JSON-safe Python values
    return {
        "score": int(final_score),
        "feedback": feedback,
        "strengths": strengths,
        "improvements": improvements,
        "semantic_score": float(semantic_score),
        "keyword_score": float(keyword_score),
        "completeness_score": float(completeness_score)
    }