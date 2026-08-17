import CandidateLayout from "../../layouts/CandidateLayout";

import SearchBar from "../../components/SearchBar";
import StatusFilter from "../../components/StatusFilter";
import AppliedJobCard from "../../components/AppliedJobCard";

export default function AppliedJobs() {
  return (
    <CandidateLayout>

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Applied Jobs
        </h1>

        <p className="text-gray-500 mt-2">
          Track the status of your job applications.
        </p>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Status Filter */}
      <div className="mt-6">
        <StatusFilter />
      </div>

      {/* Applied Jobs List */}
      <div className="space-y-6 mt-8">

        <AppliedJobCard
          title="Data Scientist"
          company="ABC Technologies"
          appliedDate="15 Aug 2026"
          status="Under Review"
        />

        <AppliedJobCard
          title="AI Engineer"
          company="XYZ Solutions"
          appliedDate="10 Aug 2026"
          interviewDate="20 Aug 2026"
          status="Interview Scheduled"
        />

        <AppliedJobCard
          title="Python Developer"
          company="Tech Nepal"
          appliedDate="05 Aug 2026"
          status="Rejected"
        />

      </div>

    </CandidateLayout>
  );
}