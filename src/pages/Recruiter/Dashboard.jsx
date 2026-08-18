import RecruiterLayout from "../../layouts/RecruiterLayout";
import RecruiterSummaryCard from "../../components/RecruiterSummaryCard";
import HiringCharts from "../../components/HiringCharts";
import RecentJobs from "../../components/RecentJobs";
import RecentApplicants from "../../components/RecentApplicants";
import QuickActions from "../../components/QuickActions";

export default function Dashboard() {
  return (
    <RecruiterLayout>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage job postings, applicants, and hiring performance.
        </p>
      </div>

      {/* Summary Cards */}
      <RecruiterSummaryCard />
      <div className="mt-8">
         <HiringCharts />
      </div>
      <div className="mt-8">
        <RecentJobs />
      </div>
       <div className="mt-8">
          <RecentApplicants />
       </div>
       <div className="mt-8">
          <QuickActions />
       </div>
    </RecruiterLayout>
  );
}