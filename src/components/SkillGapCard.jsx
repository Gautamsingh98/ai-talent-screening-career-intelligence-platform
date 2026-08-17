export default function SkillGapCard() {
  const skills = [
    { name: "Docker", level: 60 },
    { name: "AWS", level: 45 },
    { name: "Power BI", level: 80 },
    { name: "Deep Learning", level: 30 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Skill Gap Analysis
      </h2>

      <div className="space-y-5">

        {skills.map((skill) => (

          <div key={skill.name}>

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                {skill.name}
              </span>

              <span className="text-blue-600 font-semibold">
                {skill.level}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${skill.level}%` }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}