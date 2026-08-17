export default function AISuggestionCard() {

  const suggestions = [
    "Learn Docker and containerization.",
    "Add more Machine Learning projects.",
    "Improve your professional summary.",
    "Include internship experience.",
    "Highlight GitHub repositories.",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        AI Suggestions
      </h2>

      <ul className="space-y-4">

        {suggestions.map((item) => (

          <li
            key={item}
            className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded"
          >
            {item}
          </li>

        ))}

      </ul>

    </div>
  );
}