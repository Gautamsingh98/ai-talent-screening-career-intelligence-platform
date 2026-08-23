export default function AdminJobDetailsModal({
  job,
  onClose,
}) {
  if (!job) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Job Details
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              View complete job information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>

        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Job Title */}
          <div>
            <p className="text-sm text-gray-500">
              Job Title
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {job.title}
            </h3>
          </div>

          {/* Recruiter */}
          <div>
            <p className="text-sm text-gray-500">
              Recruiter
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {job.recruiter}
            </p>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {job.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Applicants
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {job.applicants}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Posted Date
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {job.date}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {job.status}
              </span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}