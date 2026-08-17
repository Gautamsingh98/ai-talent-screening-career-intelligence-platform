export default function InterviewResultCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        AI Interview Evaluation
      </h2>

      <div className="text-center">

        <h1 className="text-6xl font-bold text-blue-600">
          88%
        </h1>

        <p className="text-green-600 font-semibold mt-2">
          Very Good Performance
        </p>

      </div>

      <div className="mt-8">

        <h3 className="font-bold text-green-600 mb-2">
          Strengths
        </h3>

        <ul className="list-disc list-inside space-y-2">
          <li>Good understanding of Machine Learning.</li>
          <li>Clear explanation with examples.</li>
          <li>Strong Python knowledge.</li>
        </ul>

      </div>

      <div className="mt-6">

        <h3 className="font-bold text-red-600 mb-2">
          Areas for Improvement
        </h3>

        <ul className="list-disc list-inside space-y-2">
          <li>Explain concepts more confidently.</li>
          <li>Provide more real-world examples.</li>
          <li>Improve communication skills.</li>
        </ul>

      </div>

    </div>
  );
}