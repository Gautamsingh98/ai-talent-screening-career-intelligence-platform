export default function RecommendedCareerCard({
  careers = [],
}) {

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Other Recommended Careers
      </h2>

      {careers.length > 0 ? (

        <ul className="space-y-3">

          {careers.map((career) => (

            <li
              key={career.job_id}
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-blue-50"
            >

              <span className="font-semibold">
                {career.career}
              </span>

              <span className="text-blue-600 font-bold">
                {career.match_percentage}% Match
              </span>

            </li>

          ))}

        </ul>

      ) : (

        <p className="text-gray-500">
          No other career recommendations available.
        </p>

      )}

    </div>
  );
}