export default function MissingSkillsCard({
  yourSkills = [],
  missingSkills = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="grid md:grid-cols-2 gap-8">

        {/* Your Skills */}
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Your Skills
          </h2>

          <ul className="space-y-2">
            {yourSkills.length > 0 ? (
              yourSkills.map((skill) => (
                <li key={skill}>✅ {skill}</li>
              ))
            ) : (
              <li className="text-gray-500">
                No skills found
              </li>
            )}
          </ul>
        </div>

        {/* Missing Skills */}
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Missing Skills
          </h2>

          <ul className="space-y-2">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill) => (
                <li key={skill}>❌ {skill}</li>
              ))
            ) : (
              <li className="text-gray-500">
                No missing skills
              </li>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
}