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

      {/* Applicants Table */}

      <ApplicantsTable />

    </RecruiterLayout>
  );
}