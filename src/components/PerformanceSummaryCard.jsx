import {
  FaFileAlt,
  FaMicrophone,
  FaBriefcase,
  FaBrain,
} from "react-icons/fa";

import SummaryCard from "./SummaryCard";

export default function PerformanceSummaryCard({ data }) {

  const resumeScore = Number(
    data?.resume_score || 0
  );

  const interviewScore = Number(
    data?.interview_score || 0
  );

  const jobsApplied = Number(
    data?.jobs_applied || 0
  );

  const applicationsThisWeek = Number(
    data?.applications_this_week || 0
  );

  const skillMatch = Number(
    data?.skill_match || 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <SummaryCard
        icon={<FaFileAlt />}
        title="Resume Score"
        value={`${resumeScore}%`}
        progress={resumeScore}
        status="+5% This Month"
        color="text-blue-600"
      />

      <SummaryCard
        icon={<FaMicrophone />}
        title="Interview Score"
        value={`${interviewScore}%`}
        progress={interviewScore}
        status={
          interviewScore >= 80
            ? "Excellent Performance"
            : "Keep Practicing"
        }
        color="text-green-600"
      />

      <SummaryCard
        icon={<FaBriefcase />}
        title="Jobs Applied"
        value={jobsApplied}
        status={`${applicationsThisWeek} Applications This Week`}
        color="text-purple-600"
      />

      <SummaryCard
        icon={<FaBrain />}
        title="Skill Match"
        value={`${skillMatch}%`}
        progress={skillMatch}
        status={
          skillMatch >= 80
            ? "Top Candidate"
            : "Improve Your Skill Match"
        }
        color="text-orange-500"
      />

    </div>
  );
}