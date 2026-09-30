import CandidateLayout from "../../layouts/CandidateLayout";
import StatCard from "../../components/StatCard";
import ResumeScoreCard from "../../components/ResumeScoreCard";
import TopSkillsCard from "../../components/TopSkillsCard";
import RecommendedJobsCard from "../../components/RecommendedJobsCard";
import SkillGapCard from "../../components/SkillGapCard";
import RecentActivityCard from "../../components/RecentActivityCard";
import InterviewProgressCard from "../../components/InterviewProgressCard";

import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaUser,
} from "react-icons/fa";

export default function Dashboard() {

  // =========================
  // DASHBOARD STATE
  // =========================

  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // GET CANDIDATE DASHBOARD
  // =========================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        // Get JWT token
        const token = localStorage.getItem("token");

        // Check token
        if (!token) {

          throw new Error(
            "Authentication token not found. Please login again."
          );

        }


        // =========================
        // API REQUEST
        // =========================

        const response = await fetch(
          "http://localhost:5000/api/candidate/dashboard",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );


        // =========================
        // CHECK RESPONSE
        // =========================

        if (!response.ok) {

          const errorData = await response.json().catch(() => ({}));

          throw new Error(
            errorData.message ||
            "Failed to fetch candidate dashboard"
          );

        }


        // =========================
        // GET DATA
        // =========================

        const data = await response.json();


        console.log(
          "CANDIDATE DASHBOARD:",
          data
        );


        // =========================
        // SAVE DASHBOARD DATA
        // =========================

        setDashboardData(data);


        // =========================
        // SAVE CANDIDATE DATA
        // =========================

        if (data.candidate) {

          setUser(data.candidate);

        }


      } catch (error) {

        console.error(
          "Candidate dashboard error:",
          error
        );

        setError(error.message);


      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <CandidateLayout>

        <div className="flex items-center justify-center min-h-[500px]">

          <p className="text-gray-600 text-lg">
            Loading dashboard...
          </p>

        </div>

      </CandidateLayout>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <CandidateLayout>

        <div className="flex items-center justify-center min-h-[500px]">

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">

            <p className="text-red-600 font-medium">
              Failed to load dashboard
            </p>

            <p className="text-red-500 mt-2">
              {error}
            </p>

          </div>

        </div>

      </CandidateLayout>

    );

  }


  // =========================
  // GET BACKEND DATA
  // =========================

  const overview =
    dashboardData?.overview || {};


  // =========================
  // APPLIED JOBS
  // =========================

  const appliedJobs =
    overview.applied_jobs ?? 0;


  // =========================
  // APPLICATIONS THIS WEEK
  // =========================

  const applicationsThisWeek =
    overview.applications_this_week ?? 0;


  // =========================
  // RESUME SCORE
  // =========================

  const resumeScore =
    overview.resume_score ?? 0;


  // =========================
  // INTERVIEWS
  // =========================

  const interviewsCompleted =
    overview.interviews_completed ?? 0;

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


        {/* =========================
            APPLIED JOBS
        ========================= */}

        <StatCard

          title="Applied Jobs"

          value={appliedJobs}

          subtitle={`+${applicationsThisWeek} This Week`}

          icon={
            <FaBriefcase className="text-blue-600" />
          }

        />


        {/* =========================
            RESUME SCORE
        ========================= */}

       <StatCard
          title="Resume Score"
          value={`${resumeScore}%`}
          subtitle={
             resumeScore >= 90
             ? "Excellent"
             : resumeScore >= 75
             ? "Good"
             : resumeScore >= 60
             ? "Average"
             : "Needs Improvement"
          }
          icon={<FaFileAlt className="text-green-600" />}
        />


        {/* =========================
            PRACTICE INTERVIEWS
        ========================= */}

        <StatCard

          title="Practice Interviews"

          value={interviewsCompleted}

          subtitle={
            interviewsCompleted > 0
              ? "Completed"
              : "Not Completed"
          }

          icon={
            <FaRobot className="text-purple-600" />
          }

        />


        {/* =========================
            PROFILE STRENGTH
        ========================= */}

        <StatCard

          title="Profile Strength"

          value="--"

          subtitle="Coming from profile analysis"

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