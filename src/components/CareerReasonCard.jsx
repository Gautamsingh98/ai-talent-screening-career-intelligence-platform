export default function CareerReasonCard({
  reasons = [],
}) {

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Why This Career?
      </h2>

      {reasons.length > 0 ? (

        <ul className="space-y-3">

          {reasons.map((reason) => (

            <li
              key={reason}
              className="flex items-center gap-3"
            >

              <span className="text-green-600 text-xl">
                ✓
              </span>

              <span>
                {reason}
              </span>

            </li>

          ))}

        </ul>

      ) : (

        <p className="text-gray-500">
          No career reasons available.
        </p>

      )}

    </div>
  );
}