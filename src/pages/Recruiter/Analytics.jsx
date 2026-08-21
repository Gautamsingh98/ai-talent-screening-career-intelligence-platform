import RecruiterLayout from "../../layouts/RecruiterLayout";

import AnalyticsSummaryCard from "../../components/AnalyticsSummaryCard";
import AnalyticsCharts from "../../components/AnalyticsCharts";
import AnalyticsInsights from "../../components/AnalyticsInsights";
import RecruitmentPerformanceTable from "../../components/RecruitmentPerformanceTable";
import TopSkillsCard from "../../components/TopSkillsCard";
import { FaDownload } from "react-icons/fa";

export default function Analytics() {
  return (
    <RecruiterLayout>

      <div className="flex items-center justify-between mb-8">

  <div>
    <h1 className="text-4xl font-bold">
      Recruitment Analytics
    </h1>

    <p className="text-gray-500 mt-2">
      Analyze recruitment performance and hiring trends.
    </p>
  </div>

  <button
  onClick={() => alert("PDF Export Coming Soon")}
  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
>
  <FaDownload />
  Export PDF
</button>

</div>

      {/* Summary Cards */}
      <AnalyticsSummaryCard />

      {/* Charts */}
      <div className="mt-8">
        <AnalyticsCharts />
      </div>

      <div className="mt-8">
        < AnalyticsInsights/>
      </div>

      <div className="mt-8">
        <RecruitmentPerformanceTable />
      </div>

       <div className="mt-8">
        <TopSkillsCard />
      </div>
     
    </RecruiterLayout>
  );
}