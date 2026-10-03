import { useParams, useNavigate } from "react-router-dom";

import CandidateLayout from "../../layouts/CandidateLayout";
import InterviewResultCard from "../../components/InterviewResultCard";

export default function InterviewResult() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  return (
    <CandidateLayout>

      <div className="mb-8">

        <button
          onClick={() =>
            navigate("/candidate/interview")
          }
          className="text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          ← Back to Interview History
        </button>

        <h1 className="text-3xl font-bold">
          Interview Result
        </h1>

        <p className="text-gray-500 mt-2">
          Review your completed interview performance.
        </p>

      </div>

      <InterviewResultCard
        interviewId={interviewId}
      />

    </CandidateLayout>
  );
}