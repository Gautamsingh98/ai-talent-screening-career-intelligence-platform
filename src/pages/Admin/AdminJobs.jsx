import AdminLayout from "../../layouts/AdminLayout";
import AdminJobsTable from "../../components/AdminJobsTable";

export default function AdminJobs() {
  return (
    <AdminLayout>

      {/* Page Heading */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Jobs Management
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage jobs posted by recruiters.
        </p>

      </div>
         {/* Jobs Table */}
          <AdminJobsTable />

    </AdminLayout>
  );
}