import { useEffect, useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";

import JobRoleSelector from "../../components/JobRoleSelector";
import SkillMatchCard from "../../components/SkillMatchCard";
import MissingSkillsCard from "../../components/MissingSkillsCard";
import LearningRoadmapCard from "../../components/LearningRoadmapCard";
import RecommendedCoursesCard from "../../components/RecommendedCoursesCard";

export default function SkillGap() {

  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(() => {

    const fetchSkillGap = async () => {

      if (!selectedJobId) {
        return;
      }

      try {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        console.log(
          "Fetching skill gap for job:",
          selectedJobId
        );

        const response = await fetch(
          `http://localhost:5000/api/candidate/skill-gap?job_id=${selectedJobId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("SKILL GAP RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to fetch skill gap analysis"
          );
        }

        setSkillGap(data);

      } catch (error) {

        console.error("Skill gap error:", error);

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };

    fetchSkillGap();

  }, [selectedJobId]);


  return (
    <CandidateLayout>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Skill Gap Analysis
        </h1>

        <p className="text-gray-500 mt-2">
          Compare your current skills with your desired job role.
        </p>
      </div>


      <JobRoleSelector
        selectedJobId={selectedJobId}
        onJobChange={setSelectedJobId}
      />


      {loading && (
        <p className="text-gray-500 mt-8">
          Loading skill gap analysis...
        </p>
      )}


      {error && (
        <p className="text-red-500 mt-8">
          {error}
        </p>
      )}


      {skillGap && !loading && !error && (
        <>

          <div className="mt-8">
            <SkillMatchCard
              skillMatch={skillGap.overall_skill_match}
            />
          </div>


          <div className="mt-8">
            <MissingSkillsCard
              yourSkills={skillGap.your_skills}
              missingSkills={skillGap.missing_skills}
            />
          </div>


          <div className="mt-8">
            <LearningRoadmapCard
              missingSkills={skillGap.missing_skills}
            />
          </div>


          <div className="mt-8">
            <RecommendedCoursesCard
              missingSkills={skillGap.missing_skills}
            />
          </div>

        </>
      )}

    </CandidateLayout>
  );
}