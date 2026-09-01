import { useEffect, useState } from "react";
import API from "../../api/axios";
import CandidateLayout from "../../layouts/CandidateLayout";

import {
  FaFilePdf,
  FaStar,
  FaGraduationCap,
  FaBriefcase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
} from "react-icons/fa";

export default function ResumeAnalysis() {

  const [analysis, setAnalysis] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchAnalysis = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/resume/analyze"
        );

        setAnalysis(response.data.analysis);
        setResume(response.data.resume);

      } catch (err) {

        console.error(
          "Failed to analyze resume:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to analyze resume."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchAnalysis();

  }, []);


  if (loading) {

    return (
      <CandidateLayout>

        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <p className="text-gray-500">
            Analyzing your resume...
          </p>

        </div>

      </CandidateLayout>
    );

  }


  if (error) {

    return (
      <CandidateLayout>

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-5">

          {error}

        </div>

      </CandidateLayout>
    );

  }


  return (

    <CandidateLayout>

      {/* PAGE HEADING */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Resume Analysis
        </h1>

        <p className="text-gray-500 mt-2">
          AI-powered analysis of your resume.
        </p>

      </div>


      {/* RESUME INFORMATION */}

      {resume && (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="flex items-center gap-4">

            <FaFilePdf className="text-red-600 text-4xl" />

            <div>

              <h2 className="font-bold text-lg">
                {resume.filename}
              </h2>

              <p className="text-gray-500 text-sm">
                Uploaded:{" "}
                {new Date(
                  resume.uploaded_at
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

        </div>

      )}


      {analysis && (

        <>

          {/* SCORE */}

          <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">

            <FaStar className="text-yellow-500 text-5xl mx-auto mb-4" />

            <h2 className="text-xl font-bold text-gray-700">
              Resume Score
            </h2>

            <p className="text-5xl font-bold text-blue-600 mt-3">
              {analysis.score}/100
            </p>

          </div>


          {/* SKILLS */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold mb-5">
              Technical Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {analysis.skills?.length > 0 ? (

                analysis.skills.map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                    >
                      {skill}
                    </span>

                  )
                )

              ) : (

                <p className="text-gray-500">
                  No technical skills detected.
                </p>

              )}

            </div>

          </div>


          {/* EDUCATION */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

              <FaGraduationCap className="text-blue-600" />

              Education

            </h2>

            <div className="space-y-3">

              {analysis.education?.length > 0 ? (

                analysis.education.map(
                  (education, index) => (

                    <div
                      key={index}
                      className="border rounded-lg p-4"
                    >
                      {education}
                    </div>

                  )
                )

              ) : (

                <p className="text-gray-500">
                  No education information detected.
                </p>

              )}

            </div>

          </div>


          {/* EXPERIENCE */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

              <FaBriefcase className="text-blue-600" />

              Experience

            </h2>

            <div className="space-y-3">

              {analysis.experience?.length > 0 ? (

                analysis.experience.map(
                  (experience, index) => (

                    <div
                      key={index}
                      className="border rounded-lg p-4"
                    >
                      {experience}
                    </div>

                  )
                )

              ) : (

                <p className="text-gray-500">
                  No experience information detected.
                </p>

              )}

            </div>

          </div>


          {/* STRENGTHS */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

              <FaCheckCircle className="text-green-600" />

              Strengths

            </h2>

            <div className="space-y-3">

              {analysis.strengths?.map(
                (strength, index) => (

                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700"
                  >
                    {strength}
                  </div>

                )
              )}

            </div>

          </div>


          {/* WEAKNESSES */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

              <FaExclamationTriangle className="text-orange-500" />

              Weaknesses

            </h2>

            <div className="space-y-3">

              {analysis.weaknesses?.map(
                (weakness, index) => (

                  <div
                    key={index}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-700"
                  >
                    {weakness}
                  </div>

                )
              )}

            </div>

          </div>


          {/* RECOMMENDATIONS */}

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">

            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">

              <FaLightbulb className="text-yellow-500" />

              Recommendations

            </h2>

            <div className="space-y-3">

              {analysis.recommendations?.map(
                (recommendation, index) => (

                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700"
                  >
                    {recommendation}
                  </div>

                )
              )}

            </div>

          </div>

        </>

      )}

    </CandidateLayout>

  );

}