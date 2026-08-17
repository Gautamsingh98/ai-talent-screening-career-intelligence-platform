import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function KeywordMatchCard() {
  const keywords = [
    { name: "Python", matched: true },
    { name: "SQL", matched: true },
    { name: "Machine Learning", matched: true },
    { name: "TensorFlow", matched: false },
    { name: "Docker", matched: false },
    { name: "AWS", matched: false },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Keyword Match
      </h2>

      <div className="space-y-4">

        {keywords.map((item) => (

          <div
            key={item.name}
            className="flex justify-between items-center border-b pb-3"
          >

            <span>{item.name}</span>

            {item.matched ? (
              <FaCheckCircle className="text-green-600 text-xl" />
            ) : (
              <FaTimesCircle className="text-red-600 text-xl" />
            )}

          </div>

        ))}

      </div>

    </div>
  );
}