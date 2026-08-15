import CandidateLayout from "../../layouts/CandidateLayout";
import StatCard from "../../components/StatCard";

import {
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaUser,
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <CandidateLayout>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Candidate Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to AI Talent Screening Platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Applied Jobs"
          value="15"
          subtitle="+2 This Week"
          icon={<FaBriefcase className="text-blue-600" />}
        />

        <StatCard
          title="Resume Score"
          value="92%"
          subtitle="Excellent"
          icon={<FaFileAlt className="text-green-600" />}
        />

        <StatCard
          title="Practice Interviews"
          value="8"
          subtitle="Completed"
          icon={<FaRobot className="text-purple-600" />}
        />

        <StatCard
          title="Profile Strength"
          value="85%"
          subtitle="Good Profile"
          icon={<FaUser className="text-orange-600" />}
        />

      </div>

    </CandidateLayout>
  );
}