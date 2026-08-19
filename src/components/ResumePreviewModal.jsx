export default function ResumePreviewModal({
  applicant,
  onClose,
}) {
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-[650px] p-8">

        <h2 className="text-2xl font-bold mb-6">
          Resume Preview
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Name:</strong> {applicant.name}
          </p>

          <p>
            <strong>Email:</strong> {applicant.email}
          </p>

          <p>
            <strong>Phone:</strong> +977-98XXXXXXXX
          </p>

          <div>
            <strong>Skills</strong>

            <ul className="list-disc pl-6 mt-2">
              <li>Python</li>
              <li>SQL</li>
              <li>Machine Learning</li>
              <li>Pandas</li>
            </ul>
          </div>

          <div>
            <strong>Education</strong>

            <p className="mt-2">
              Bachelor of Information Technology
            </p>
          </div>

          <div>
            <strong>Experience</strong>

            <p className="mt-2">
              Data Analyst Intern
            </p>
          </div>

          <div>
            <strong>Projects</strong>

            <ul className="list-disc pl-6 mt-2">
              <li>AI Resume Screening</li>
              <li>House Price Prediction</li>
            </ul>
          </div>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Download Resume
          </button>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}