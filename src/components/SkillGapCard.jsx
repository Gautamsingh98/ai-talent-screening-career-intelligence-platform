export default function SkillGapCard({ skills = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Skill Gap Analysis
      </h2>

      <div className="space-y-5">

        {skills.length > 0 ? (
          skills.slice(0, 5).map((skill, index) => {

            const skillName = skill.name || skill.skill || "Unknown Skill";
            const skillLevel = Number(
              skill.level ?? skill.percentage ?? 0
            );

            return (
              <div key={`${skillName}-${index}`}>

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    {skillName}
                  </span>

                  <span className="text-blue-600 font-semibold">
                    {skillLevel}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(skillLevel, 100)}%`,
                    }}
                  ></div>

                </div>

              </div>
            );
          })
        ) : (
          <p className="text-gray-500">
            No skill gaps found.
          </p>
        )}

      </div>

    </div>
  );
}