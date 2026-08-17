export default function StrengthWeaknessCard() {

  const strengths = [
    "Python",
    "SQL",
    "Machine Learning",
    "Data Analysis",
    "GitHub Portfolio",
  ];

  const weaknesses = [
    "Docker",
    "AWS",
    "Power BI",
    "CI/CD",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="grid md:grid-cols-2 gap-8">

        <div>

          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Strengths
          </h2>

          <ul className="space-y-2">

            {strengths.map((item) => (
              <li key={item}>✅ {item}</li>
            ))}

          </ul>

        </div>

        <div>

          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Weaknesses
          </h2>

          <ul className="space-y-2">

            {weaknesses.map((item) => (
              <li key={item}>❌ {item}</li>
            ))}

          </ul>

        </div>

      </div>

    </div>
  );
}