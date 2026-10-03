from utils.interview_evaluator import evaluate_answer


question = "What is Python?"

correct_answer = (
    "Python is a high-level programming language "
    "that is widely used for web development, "
    "data science, machine learning, and automation."
)

candidate_answer = (
    "Python is a high level programming language. "
    "It is commonly used for data science, "
    "machine learning, web development, and automation."
)


result = evaluate_answer(
    candidate_answer,
    question,
    correct_answer,
    "Python Developer"
)


print("\n==============================")
print("INTERVIEW AI EVALUATION")
print("==============================")

print("Final Score:", result["score"])
print("Semantic Score:", result["semantic_score"])
print("Keyword Score:", result["keyword_score"])
print("Completeness Score:", result["completeness_score"])

print("\nFeedback:")
print(result["feedback"])

print("\nStrengths:")
for strength in result["strengths"]:
    print("-", strength)

print("\nImprovements:")
for improvement in result["improvements"]:
    print("-", improvement)