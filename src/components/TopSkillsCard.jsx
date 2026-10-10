
export default function TopSkillsCard({ skills = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Top Skills
      </h2>

      <div className="space-y-4">
        {skills.length > 0 ? (
          skills.slice(0, 5).map((skill, index) => (
            <div
              key={index}
              className="flex items-center"
            >
              <span className="text-gray-700">
                {skill}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No skills found in your resume.
          </p>
        )}
      </div>

    </div>
  );
}