import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// AUTHENTICATION
// =====================================================

import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";

// =====================================================
// CANDIDATE
// =====================================================

import Dashboard from "../pages/Candidate/Dashboard";
import Profile from "../pages/Candidate/Profile";
import Resume from "../pages/Candidate/Resume";
import Jobs from "../pages/Candidate/Jobs";
import CandidateJobDetails from "../pages/Candidate/JobDetails";
import AppliedJobs from "../pages/Candidate/AppliedJobs";
import ResumeAnalysis from "../pages/Candidate/ResumeAnalysis";
import SkillGap from "../pages/Candidate/SkillGap";
import CareerRecommendation from "../pages/Candidate/CareerRecommendation";
import Interview from "../pages/Candidate/Interview";
import InterviewQuestion from "../pages/Candidate/InterviewQuestion";
import InterviewResult from "../pages/Candidate/InterviewResult";
import Reports from "../pages/Candidate/Reports";

// =====================================================
// RECRUITER
// =====================================================

import RecruiterDashboard from "../pages/Recruiter/Dashboard";
import RecruiterJobs from "../pages/Recruiter/Jobs";
import RecruiterJobDetails from "../pages/Recruiter/JobDetails";
import EditJob from "../pages/Recruiter/EditJob";
import Applicants from "../pages/Recruiter/Applicants";
import RecruiterReports from "../pages/Recruiter/Reports";
import Analytics from "../pages/Recruiter/Analytics";
import CandidateRanking from "../pages/Recruiter/CandidateRanking";
import CandidateDetails from "../pages/Recruiter/CandidateDetails";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import AdminJobs from "../pages/Admin/Jobs";
import AdminReports from "../pages/Admin/Reports";
import AdminAnalytics from "../pages/Admin/Analytics";
import Settings from "../pages/Admin/Settings";
import Recruiters from "../pages/Admin/Recruiters";
import AdminRecentActivity from "../components/AdminRecentActivity";
import AdminUserDetails from "../pages/Admin/UserDetails";
import AdminRecruiterDetails from "../pages/Admin/RecruiterDetails";
import AdminJobDetails from "../pages/Admin/JobDetails";

// =====================================================
// APP ROUTES
// =====================================================

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            CANDIDATE ROUTES
        ================================================= */}

        <Route
          path="/candidate/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/candidate/profile"
          element={<Profile />}
        />

        <Route
          path="/candidate/resume"
          element={<Resume />}
        />

        <Route
          path="/candidate/jobs"
          element={<Jobs />}
        />

        <Route 
          path="/candidate/jobs/:id"
          element={<CandidateJobDetails />}
        />

        <Route
          path="/candidate/applied-jobs"
          element={<AppliedJobs />}
        />

        <Route
          path="/candidate/resume-analysis"
          element={<ResumeAnalysis />}
        />

        <Route
          path="/candidate/skill-gap"
          element={<SkillGap />}
        />

        <Route
          path="/candidate/career"
          element={<CareerRecommendation />}
        />

        {/* =================================================
            INTERVIEW
        ================================================= */}

        <Route
          path="/candidate/interview"
          element={<Interview />}
        />

        <Route
          path="/candidate/interview/question"
          element={<InterviewQuestion />}
        />

        <Route
          path="/candidate/interview/result/:interviewId"
          element={<InterviewResult />}
        />

        <Route
          path="/candidate/reports"
          element={<Reports />}
        />

        {/* =================================================
            RECRUITER ROUTES
        ================================================= */}

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/jobs"
          element={<RecruiterJobs />}
        />

        <Route
          path="/recruiter/jobs/:id"
          element={<RecruiterJobDetails />}
        />

        <Route
          path="/recruiter/jobs/:id/edit"
          element={<EditJob />}
        />

        <Route
          path="/recruiter/applicants"
          element={<Applicants />}
        />
        
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={<Applicants />}
        />

        <Route
          path="/recruiter/reports"
          element={<RecruiterReports />}
        />

        <Route
          path="/recruiter/analytics"
          element={<Analytics />}
        />

        <Route
          path="/recruiter/jobs/:jobId/ranking"
          element={<CandidateRanking />}
        />

        <Route
          path="/recruiter/candidates/:applicationId"
          element={<CandidateDetails />}
        />

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/jobs"
          element={<AdminJobs />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin/analytics"
          element={<AdminAnalytics />}
        />

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

        <Route
          path="/admin/recruiters"
          element={<Recruiters />}
        />
      
{/* Admin record detail pages */}
<Route
  path="/admin/users/:id"
  element={<AdminUserDetails />}
/>

<Route
  path="/admin/recruiters/:id"
  element={<AdminRecruiterDetails />}
/>

<Route
  path="/admin/jobs/:id"
  element={<AdminJobDetails />}
/>

        {/* ADMIN ACTIVITY */}
        <Route
          path="/admin/activity"
          element={<AdminRecentActivity />}
        />

      </Routes>
    </BrowserRouter>
  );
}