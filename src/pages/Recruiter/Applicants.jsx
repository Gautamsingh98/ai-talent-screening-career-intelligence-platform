import RecruiterLayout from "../../layouts/RecruiterLayout";
import ApplicantsTable from "../../components/ApplicantsTable";
import ApplicantSummaryCard from "../../components/ApplicantSummaryCard";

export default function Applicants() {
  return (
    <RecruiterLayout>

      {/* Page Heading */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Applicants
          </h1>

          <p className="text-gray-500 mt-2">
            Manage candidates who applied for your jobs.
          </p>
        </div>

      </div>
       <ApplicantSummaryCard />

      {/* Search & Filter */}

      <div className="bg-white rounded-xl shadow-md p-5 mb-8">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search candidate..."
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Applicants</option>
            <option>Shortlisted</option>
            <option>Rejected</option>
            <option>Pending</option>
          </select>

        </div>

      </div>

      {/* Applicants Table */}

      <ApplicantsTable />

    </RecruiterLayout>
  );
}