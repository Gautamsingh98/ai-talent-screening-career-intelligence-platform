export default function CertificationCard() {

  const certifications = [
    "Google Data Analytics Professional Certificate",
    "AWS Certified Machine Learning",
    "TensorFlow Developer Certificate",
    "Microsoft Azure AI Fundamentals",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Recommended Certifications
      </h2>

      <ul className="space-y-3">

        {certifications.map((course) => (
          <li
            key={course}
            className="border rounded-lg p-3 hover:bg-blue-50"
          >
            📘 {course}
          </li>
        ))}

      </ul>

    </div>
  );
}