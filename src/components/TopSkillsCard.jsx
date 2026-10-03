import {
  FaPython,
  FaDatabase,
  FaChartBar,
} from "react-icons/fa";

export default function TopSkillsCard({ skills = [] }) {

  const getSkillIcon = (skill) => {
    const skillName = String(skill).toLowerCase();

    if (skillName.includes("python")) {
      return <FaPython className="text-yellow-500 text-xl" />;
    }

    if (
      skillName.includes("sql") ||
      skillName.includes("mysql") ||
      skillName.includes("database")
    ) {
      return <FaDatabase className="text-blue-600 text-xl" />;
    }

    if (
      skillName.includes("data") ||
      skillName.includes("analysis")
    ) {
      return <FaChartBar className="text-green-600 text-xl" />;
    }

    if (skillName.includes("machine learning")) {
      return (
        <span className="text-purple-600 font-bold">
          ML
        </span>
      );
    }

    return (
      <span className="text-orange-600 font-bold">
        {String(skill).charAt(0).toUpperCase()}
      </span>
    );
  };

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
              className="flex items-center gap-3"
            >
              {getSkillIcon(skill)}

              <span>
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