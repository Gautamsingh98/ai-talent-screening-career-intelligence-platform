export default function CandidateProfileModal({
  applicant,
  onClose,
}) {

  if (!applicant) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-[500px] p-8">

        <h2 className="text-2xl font-bold mb-6">
          Candidate Profile
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Name:</strong> {applicant.name}
          </p>

          <p>
            <strong>Email:</strong> {applicant.email}
          </p>

          <p>
            <strong>Applied For:</strong> {applicant.job}
          </p>

          <p>
            <strong>AI Resume Score:</strong> {applicant.score}%
          </p>

          <p>
            <strong>Status:</strong> {applicant.status}
          </p>

          <p>
            <strong>Skills:</strong>
          </p>

          <ul className="list-disc pl-6">

            <li>Python</li>

            <li>SQL</li>

            <li>Pandas</li>

            <li>Machine Learning</li>

          </ul>

        </div>

        <button
          onClick={onClose}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

  );
}