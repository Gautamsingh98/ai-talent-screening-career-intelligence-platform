export default function QuestionCard({ question }) {
  if (!question) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold">
          Interview Question
        </h2>

        <span className="text-sm font-medium text-gray-500">
          Question {question.question_number} of{" "}
          {question.total_questions}
        </span>

      </div>

      <div className="bg-gray-50 rounded-lg p-5">

        <p className="text-lg text-gray-800 leading-relaxed">
          {question.question_text}
        </p>

      </div>

    </div>
  );
}