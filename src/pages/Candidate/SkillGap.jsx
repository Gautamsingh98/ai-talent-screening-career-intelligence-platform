import CandidateLayout from "../../layouts/CandidateLayout";

import JobRoleSelector from "../../components/JobRoleSelector";
import SkillMatchCard from "../../components/SkillMatchCard";
import MissingSkillsCard from "../../components/MissingSkillsCard";
import LearningRoadmapCard from "../../components/LearningRoadmapCard";
import RecommendedCoursesCard from "../../components/RecommendedCoursesCard";

export default function SkillGap() {
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

      <JobRoleSelector />

      <div className="mt-8">
        <SkillMatchCard />
      </div>

      <div className="mt-8">
        <MissingSkillsCard />
      </div>

      <div className="mt-8">
        <LearningRoadmapCard />
      </div>

      <div className="mt-8">
        <RecommendedCoursesCard />
      </div>

    </CandidateLayout>
  );
}