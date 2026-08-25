import RecruiterLayout from "../../layouts/RecruiterLayout";
import JobsTable from "../../components/JobsTable";
import { FaPlus } from "react-icons/fa";

export default function Jobs() {
  return (
    <RecruiterLayout>

      {/* Page Heading */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Job Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your job postings.
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2">
          <FaPlus />
             Add New Job
          </button>

      </div>

      {/* Jobs Table */}
      <JobsTable />

    </RecruiterLayout>
  );
}