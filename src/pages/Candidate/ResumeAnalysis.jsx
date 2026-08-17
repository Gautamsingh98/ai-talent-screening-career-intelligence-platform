import CandidateLayout from "../../layouts/CandidateLayout";

import ResumeScoreCard from "../../components/ResumeScoreCard";
import StrengthWeaknessCard from "../../components/StrengthWeaknessCard";
import KeywordMatchCard from "../../components/KeywordMatchCard";
import AISuggestionCard from "../../components/AISuggestionCard";

export default function ResumeAnalysis() {
  return (
    <CandidateLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Resume Analysis
        </h1>

        <p className="text-gray-500 mt-2">
          AI-powered resume evaluation report.
        </p>

      </div>

      <ResumeScoreCard />

      <div className="mt-8">
        <StrengthWeaknessCard />
      </div>

      <div className="mt-8">
        <KeywordMatchCard />
      </div>

      <div className="mt-8">
        <AISuggestionCard />
      </div>

      <div className="flex gap-4 mt-8">

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
          Download Report
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
          Analyze Again
        </button>

      </div>

    </CandidateLayout>
  );
}