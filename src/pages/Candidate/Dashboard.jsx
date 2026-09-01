import CandidateLayout from "../../layouts/CandidateLayout";
import StatCard from "../../components/StatCard";
import ResumeScoreCard from "../../components/ResumeScoreCard";
import TopSkillsCard from "../../components/TopSkillsCard";
import RecommendedJobsCard from "../../components/RecommendedJobsCard";
import SkillGapCard from "../../components/SkillGapCard";
import RecentActivityCard from "../../components/RecentActivityCard";
import InterviewProgressCard from "../../components/InterviewProgressCard";

import { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaUser,
} from "react-icons/fa";

export default function Dashboard() {

  // =========================
  // USER STATE
  // =========================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // GET LOGGED-IN USER
  // =========================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const response = await API.get("/api/auth/profile");

        setUser(response.data.user);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          "Failed to load user information."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen">

        <p className="text-gray-600 text-lg">
          Loading dashboard...
        </p>

      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">

          <p className="text-red-600">
            {error}
          </p>

        </div>

      </div>
    );

  }


  // =========================
  // DASHBOARD
  // =========================

  return (

    <CandidateLayout>

      {/* =========================
          HEADING
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          Welcome, {user?.name || "Candidate"}

        </h1>

        <p className="text-gray-500 mt-2">

          Welcome to AI Talent Screening Platform

        </p>

      </div>


      {/* =========================
          STATISTICS CARDS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Applied Jobs"
          value="15"
          subtitle="+2 This Week"
          icon={
            <FaBriefcase className="text-blue-600" />
          }
        />

        <StatCard
          title="Resume Score"
          value="92%"
          subtitle="Excellent"
          icon={
            <FaFileAlt className="text-green-600" />
          }
        />

        <StatCard
          title="Practice Interviews"
          value="8"
          subtitle="Completed"
          icon={
            <FaRobot className="text-purple-600" />
          }
        />

        <StatCard
          title="Profile Strength"
          value="85%"
          subtitle="Good Profile"
          icon={
            <FaUser className="text-orange-600" />
          }
        />

      </div>


      {/* =========================
          RESUME SCORE
      ========================= */}

      <ResumeScoreCard />


      {/* =========================
          SKILLS + RECOMMENDED JOBS
      ========================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <TopSkillsCard />

        <RecommendedJobsCard />

      </div>


      {/* =========================
          SKILL GAP + ACTIVITY
      ========================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <SkillGapCard />

        <RecentActivityCard />

      </div>


      {/* =========================
          INTERVIEW PROGRESS
      ========================= */}

      <div className="mt-8">

        <InterviewProgressCard />

      </div>

    </CandidateLayout>

  );
}