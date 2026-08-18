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

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-8">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search jobs..."
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Jobs</option>
            <option>Active</option>
            <option>Closed</option>
            <option>Draft</option>
          </select>

        </div>

      </div>

      {/* Jobs Table */}
      <JobsTable />

    </RecruiterLayout>
  );
}