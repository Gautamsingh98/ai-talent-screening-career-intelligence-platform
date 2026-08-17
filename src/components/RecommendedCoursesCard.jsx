export default function RecommendedCoursesCard() {

  const courses = [
    "Docker Essentials",
    "AWS Cloud Practitioner",
    "TensorFlow for Beginners",
    "Kubernetes Fundamentals",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Recommended Courses
      </h2>

      <ul className="space-y-3">

        {courses.map((course) => (
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