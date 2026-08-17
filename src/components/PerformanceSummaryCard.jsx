import {
  FaFileAlt,
  FaMicrophone,
  FaBriefcase,
  FaBrain,
} from "react-icons/fa";

import SummaryCard from "./SummaryCard";

export default function PerformanceSummaryCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <SummaryCard
        icon={<FaFileAlt />}
        title="Resume Score"
        value="92%"
        progress={92}
        status="+5% This Month"
        color="text-blue-600"
      />

      <SummaryCard
        icon={<FaMicrophone />}
        title="Interview Score"
        value="88%"
        progress={88}
        status="Excellent Performance"
        color="text-green-600"
      />

      <SummaryCard
        icon={<FaBriefcase />}
        title="Jobs Applied"
        value="15"
        status="2 Applications This Week"
        color="text-purple-600"
      />

      <SummaryCard
        icon={<FaBrain />}
        title="Skill Match"
        value="85%"
        progress={85}
        status="Top Candidate"
        color="text-orange-500"
      />

    </div>
  );
}