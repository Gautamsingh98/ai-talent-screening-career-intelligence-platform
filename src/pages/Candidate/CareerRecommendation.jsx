import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../../layouts/CandidateLayout";

import CareerMatchCard from "../../components/CareerMatchCard";
import RecommendedCareerCard from "../../components/RecommendedCareerCard";
import CareerReasonCard from "../../components/CareerReasonCard";
import CertificationsCard from "../../components/CertificationsCard";

export default function CareerRecommendation() {

  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchRecommendations = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(
          "http://localhost:5000/api/candidate/career-recommendation",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log(
          "CAREER RECOMMENDATION DATA:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to fetch career recommendations"
          );
        }

        setRecommendation(data);

      } catch (error) {

        console.error(
          "Career recommendation error:",
          error
        );

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };

    fetchRecommendations();

  }, []);


  if (loading) {

    return (
      <CandidateLayout>

        <div className="text-center mt-20">

          <p className="text-gray-500">
            Loading career recommendations...
          </p>

        </div>

      </CandidateLayout>
    );

  }


  if (error) {

    return (
      <CandidateLayout>

        <div className="text-center mt-20">

          <p className="text-red-500">
            {error}
          </p>

        </div>

      </CandidateLayout>
    );

  }


  return (
    <CandidateLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Career Recommendation
        </h1>

        <p className="text-gray-500 mt-2">
          AI-powered career guidance based on your profile.
        </p>

      </div>


      {/* Best Career */}

      <CareerMatchCard
        career={recommendation?.best_career}
      />


      {/* Other Careers */}

      <div className="mt-8">

        <RecommendedCareerCard
          careers={recommendation?.other_careers}
        />

      </div>


      {/* Why This Career */}

      <div className="mt-8">

        <CareerReasonCard
          reasons={recommendation?.why_this_career}
        />

      </div>


      {/* Certifications */}

      <div className="mt-8">

        <CertificationsCard
          certifications={
            recommendation?.recommended_certifications
          }
        />

      </div>


      {/* Learning Roadmap */}

      <div className="mt-8">

        <button
          type="button"
          onClick={() => navigate("/candidate/skill-gap")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          View Learning Roadmap
        </button>

      </div>

    </CandidateLayout>
  );
}