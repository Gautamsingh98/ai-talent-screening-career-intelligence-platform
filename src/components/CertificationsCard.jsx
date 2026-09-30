export default function CertificationsCard({
  certifications = [],
}) {

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Recommended Certifications
      </h2>

      {certifications.length > 0 ? (

        <ul className="space-y-3">

          {certifications.map((certification) => (

            <li
              key={certification}
              className="border rounded-lg p-3 hover:bg-blue-50"
            >
              🎓 {certification}
            </li>

          ))}

        </ul>

      ) : (

        <p className="text-gray-500">
          No certification recommendations available.
        </p>

      )}

    </div>
  );
}