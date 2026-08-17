import CandidateLayout from "../../layouts/CandidateLayout";

import CareerMatchCard from "../../components/CareerMatchCard";
import RecommendedCareerCard from "../../components/RecommendedCareerCard";
import CareerReasonCard from "../../components/CareerReasonCard";
import CertificationCard from "../../components/CertificationCard";

export default function CareerRecommendation() {
  return (
    <CandidateLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Career Recommendation
        </h1>

        <p className="text-gray-500 mt-2">
          AI-powered career guidance based on your profile.
        </p>

      </div>

      <CareerMatchCard />

      <div className="mt-8">
        <RecommendedCareerCard />
      </div>

      <div className="mt-8">
        <CareerReasonCard />
      </div>

      <div className="mt-8">
        <CertificationCard />
      </div>

      <div className="mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
          View Learning Roadmap
        </button>
      </div>

    </CandidateLayout>
  );
}