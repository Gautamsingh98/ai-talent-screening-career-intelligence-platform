export default function LearningRoadmapCard({
  missingSkills = [],
}) {

  const roadmap = missingSkills.map(
    (skill) => `Learn ${skill} Fundamentals`
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Learning Roadmap
      </h2>

      {roadmap.length > 0 ? (
        <ol className="list-decimal list-inside space-y-3">

          {roadmap.map((step) => (
            <li key={step}>{step}</li>
          ))}

        </ol>
      ) : (
        <p className="text-gray-500">
          No learning roadmap required. You have all the required skills.
        </p>
      )}

    </div>
  );
}