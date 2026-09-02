import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Dashboard from "../pages/Candidate/Dashboard";
import Profile from "../pages/Candidate/Profile";
import Resume from "../pages/Candidate/Resume";
import Jobs from "../pages/Candidate/Jobs";
import AppliedJobs from "../pages/Candidate/AppliedJobs";
import ResumeAnalysis from "../pages/Candidate/ResumeAnalysis";
import SkillGap from "../pages/Candidate/SkillGap";
import CareerRecommendation from "../pages/Candidate/CareerRecommendation";
import Interview from "../pages/Candidate/Interview";
import Reports from "../pages/Candidate/Reports";
import RecruiterDashboard from "../pages/Recruiter/Dashboard";
import RecruiterJobs from "../pages/Recruiter/Jobs";
import Applicants from "../pages/Recruiter/Applicants";
import RecruiterReports from "../pages/Recruiter/Reports";
import Analytics from "../pages/Recruiter/Analytics";
import AdminDashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import AdminJobs from "../pages/Admin/Jobs";
import AdminReports from "../pages/Admin/Reports";
import AdminAnalytics from "../pages/Admin/Analytics";
import Settings from "../pages/Admin/Settings";
import CandidateRanking from "../pages/Recruiter/CandidateRanking";
import CandidateDetails from "../pages/Recruiter/CandidateDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidate/dashboard" element={<Dashboard />} />
        <Route path="/candidate/profile" element={<Profile />} />
        <Route path="/candidate/resume" element={<Resume />} />
        <Route path="/candidate/jobs" element={<Jobs />} />
        <Route path="/candidate/applied-jobs" element={<AppliedJobs />} />
        <Route path="/candidate/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/candidate/skill-gap" element={<SkillGap />} />
        <Route path="/candidate/career" element={<CareerRecommendation />} />
        <Route path="/candidate/interview" element={<Interview />} />
        <Route path="/candidate/reports" element={<Reports />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} /> 
        <Route path="/recruiter/applicants" element={<Applicants />} />
        <Route path="/recruiter/reports" element={<RecruiterReports />} />
        <Route path="/recruiter/analytics" element={<Analytics />} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/recruiter/jobs/:jobId/ranking" element={<CandidateRanking />} />      
        <Route path="/recruiter/candidates/:applicationId" element={<CandidateDetails />} />     
      </Routes>
    </BrowserRouter>
  );
}
