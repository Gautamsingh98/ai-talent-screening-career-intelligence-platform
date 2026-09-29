import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import API from "../api/axios";

export default function RecruiterAIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await API.get("/api/recruiter/reports/charts");

        const applicationsByRole =
          response.data.applications_by_role || [];

        const hiringTrend =
          response.data.hiring_trend || [];

        const generatedInsights = [];

        // -----------------------------------------
        // 1. Highest application role
        // -----------------------------------------

        if (applicationsByRole.length > 0) {
          const topRole = applicationsByRole[0];

          generatedInsights.push(
            `${topRole.role} received the highest number of applications with ${topRole.applications} applications.`
          );
        } else {
          generatedInsights.push(
            "No application data is available yet."
          );
        }

        // -----------------------------------------
        // 2. Total applications
        // -----------------------------------------

        const totalApplications = applicationsByRole.reduce(
          (total, item) =>
            total + Number(item.applications || 0),
          0
        );

        if (totalApplications > 0) {
          generatedInsights.push(
            `Your jobs have received a total of ${totalApplications} applications.`
          );
        }

        // -----------------------------------------
        // 3. Hiring activity
        // -----------------------------------------

        const totalHired = hiringTrend.reduce(
          (total, item) =>
            total + Number(item.hired || 0),
          0
        );

        if (totalHired > 0) {
          generatedInsights.push(
            `${totalHired} candidate${totalHired > 1 ? "s have" : " has"} been hired during the available reporting period.`
          );
        } else {
          generatedInsights.push(
            "No hired candidates are recorded during the available reporting period."
          );
        }

        // -----------------------------------------
        // 4. Recruitment recommendation
        // -----------------------------------------

        if (applicationsByRole.length > 0) {
          const lowestRole =
            applicationsByRole[applicationsByRole.length - 1];

          if (
            applicationsByRole.length > 1 &&
            Number(lowestRole.applications) <
              Number(applicationsByRole[0].applications)
          ) {
            generatedInsights.push(
              `Consider reviewing the performance of ${lowestRole.role}, which currently has fewer applications than other job roles.`
            );
          } else {
            generatedInsights.push(
              "Application activity is currently concentrated across your available job roles."
            );
          }
        }

        setInsights(generatedInsights);
      } catch (error) {
        console.error(
          "Recruiter AI insights error:",
          error
        );

        setInsights([
          "Unable to generate recruitment insights at the moment.",
          "Please make sure the recruiter reports API is running correctly.",
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">
          AI Hiring Insights
        </h2>

      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Generating recruitment insights...
        </p>
      )}

      {/* Insights */}
      {!loading && (
        <div className="space-y-4">

          {insights.map((insight, index) => (

            <div
              key={index}
              className="flex items-start gap-3"
            >

              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />

              <p className="text-gray-700">
                {insight}
              </p>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}