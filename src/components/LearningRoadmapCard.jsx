export default function LearningRoadmapCard() {

  const roadmap = [
    "Learn Docker Fundamentals",
    "Complete AWS Cloud Basics",
    "Build a Deployment Project",
    "Learn TensorFlow",
    "Create an End-to-End ML Project",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Learning Roadmap
      </h2>

      <ol className="list-decimal list-inside space-y-3">

        {roadmap.map((step) => (
          <li key={step}>{step}</li>
        ))}

      </ol>

    </div>
  );
}