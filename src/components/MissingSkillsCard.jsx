export default function MissingSkillsCard() {
  const yourSkills = [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Machine Learning",
  ];

  const missingSkills = [
    "Docker",
    "AWS",
    "TensorFlow",
    "Kubernetes",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="grid md:grid-cols-2 gap-8">

        {/* Your Skills */}
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Your Skills
          </h2>

          <ul className="space-y-2">
            {yourSkills.map((skill) => (
              <li key={skill}>✅ {skill}</li>
            ))}
          </ul>
        </div>

        {/* Missing Skills */}
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Missing Skills
          </h2>

          <ul className="space-y-2">
            {missingSkills.map((skill) => (
              <li key={skill}>❌ {skill}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}