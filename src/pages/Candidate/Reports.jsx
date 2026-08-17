import CandidateLayout from "../../layouts/CandidateLayout";
import { FaDownload } from "react-icons/fa";
import PerformanceSummaryCard from "../../components/PerformanceSummaryCard";
import PerformanceCharts from "../../components/PerformanceCharts";
import AchievementCard from "../../components/AchievementCard";
import RecentActivityCard from "../../components/RecentActivityCard";
import AIInsightsCard from "../../components/AIInsightsCard";

export default function Reports() {
  return (
    <CandidateLayout>

      {/* Page Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Reports & Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Track your overall performance
        </p>

      </div>

      {/* Overall Performance */}

      <PerformanceSummaryCard />

      {/* Charts */}

      <div className="mt-8">
        <PerformanceCharts />
      </div>

      {/* AI Insights */}
      <div className="mt-8">
  <AIInsightsCard />
      </div>

      {/* Achievements */}

      <div className="mt-8">
        <AchievementCard />
      </div>

      {/* Recent Activity */}

      <div className="mt-8">
        <RecentActivityCard/>
      </div>

      {/* Download Button */}

  <div className="mt-8 flex justify-end">

    <button
     className="
      flex items-center gap-3
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-6
      py-3
      rounded-xl
      shadow-md
      hover:shadow-xl
      transition-all
      duration-300
      hover:-translate-y-1
    "
  >
    <FaDownload className="text-lg" />

    <span className="font-semibold">
      Download PDF Report
    </span>

  </button>

</div>

    </CandidateLayout>
  );
}