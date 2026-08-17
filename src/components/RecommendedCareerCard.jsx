export default function RecommendedCareerCard() {

  const careers = [
    { role: "Machine Learning Engineer", match: "90%" },
    { role: "AI Engineer", match: "87%" },
    { role: "Data Analyst", match: "84%" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Other Recommended Careers
      </h2>

      <div className="space-y-4">

        {careers.map((career) => (

          <div
            key={career.role}
            className="flex justify-between items-center border rounded-lg p-4"
          >

            <span className="font-semibold">
              {career.role}
            </span>

            <span className="text-blue-600 font-bold">
              {career.match}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}