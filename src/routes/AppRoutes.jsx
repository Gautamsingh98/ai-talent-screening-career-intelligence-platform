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
        <Route path="/candidate/jobs" element={<Jobs />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} /> 
        <Route path="/recruiter/applicants" element={<Applicants />} />
        <Route path="/recruiter/reports" element={<RecruiterReports />} />
        <Route path="/recruiter/analytics" element={<Analytics />} />  
      </Routes>
    </BrowserRouter>
  );
}
