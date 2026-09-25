import AdminLayout from "../../layouts/AdminLayout";

export default function Recruiters() {
  return (
    <AdminLayout>

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Recruiter Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage recruiters and monitor their recruitment activities.
        </p>
      </div>

      {/* Temporary Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Recruiters
        </h2>

        <p className="text-gray-500 mt-2">
          Recruiter information will appear here.
        </p>
      </div>

    </AdminLayout>
  );
}