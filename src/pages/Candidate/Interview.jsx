import CandidateLayout from "../../layouts/CandidateLayout";

import InterviewSetupCard from "../../components/InterviewSetupCard";
import InterviewProgress from "../../components/InterviewProgress";
import QuestionCard from "../../components/QuestionCard";
import AnswerBox from "../../components/AnswerBox";
import InterviewResultCard from "../../components/InterviewResultCard";
import InterviewHistoryCard from "../../components/InterviewHistoryCard";

export default function Interview() {
  return (
    <CandidateLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Practice Interview
        </h1>

        <p className="text-gray-500 mt-2">
          Practice AI-powered mock interviews and improve your performance.
        </p>

      </div>

      <InterviewSetupCard />

      <div className="mt-8">
        <InterviewProgress />
      </div>

      <div className="mt-8">
        <QuestionCard />
      </div>

      <div className="mt-8">
        <AnswerBox />
      </div>

      <div className="mt-8">
        <InterviewResultCard />
      </div>

      <div className="mt-8">
        <InterviewHistoryCard />
      </div>

    </CandidateLayout>
  );
}