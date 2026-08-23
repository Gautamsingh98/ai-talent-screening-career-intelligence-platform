export default function AdminUserDetailsModal({ user, onClose }) {
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">

          <h2 className="text-xl font-bold text-gray-800">
            User Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>

        </div>

        {/* User Information */}
        <div className="p-6 space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="font-semibold text-gray-800">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold text-gray-800">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "Candidate"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Registered Date
            </p>

            <p className="font-semibold text-gray-800">
              {user.date}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Account Status
            </p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                user.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {user.status}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">

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