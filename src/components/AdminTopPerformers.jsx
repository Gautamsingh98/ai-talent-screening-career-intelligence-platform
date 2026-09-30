import { useEffect, useState } from "react";

import {
  FaUserTie,
  FaBriefcase,
} from "react-icons/fa";

export default function AdminTopPerformers() {

  const [data, setData] = useState({
    top_recruiters: [],
    top_jobs: [],
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // FETCH DATA
  // =========================================================

  useEffect(() => {

    const fetchTopPerformers = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/top-performers",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );


        if (!response.ok) {

          throw new Error(
            "Failed to fetch top performers"
          );

        }


        const result = await response.json();

        console.log(
          "ADMIN TOP PERFORMERS:",
          result
        );


        setData({

          top_recruiters:
            result.top_recruiters || [],

          top_jobs:
            result.top_jobs || [],

        });

      } catch (error) {

        console.error(
          "Top performers error:",
          error
        );

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };


    fetchTopPerformers();

  }, []);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6">

          <p className="text-gray-500">
            Loading top recruiters...
          </p>

        </div>


        <div className="bg-white rounded-xl shadow-md p-6">

          <p className="text-gray-500">
            Loading top performing jobs...
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">

        <p className="font-semibold text-red-600">
          Failed to load top performers
        </p>

        <p className="text-red-500 mt-1">
          {error}
        </p>

      </div>

    );

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


      {/* =====================================================
          TOP RECRUITERS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md p-6">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center">

            <FaUserTie />

          </div>


          <div>

            <h2 className="text-2xl font-bold text-gray-800">

              Top Recruiters

            </h2>

            <p className="text-gray-500">

              Recruiters with the highest hiring activity

            </p>

          </div>

        </div>


        {/* RECRUITERS */}

        {data.top_recruiters.length === 0 ? (

          <p className="text-gray-500 py-4">
            No recruiter data available.
          </p>

        ) : (

          data.top_recruiters.map(
            (recruiter, index) => (

              <div
                key={recruiter.recruiter_id}
                className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0"
              >

                <div className="flex items-center gap-4">

                  {/* RANK */}

                  <div className="bg-purple-100 w-11 h-11 rounded-full flex items-center justify-center font-semibold text-purple-700">

                    {index + 1}

                  </div>


                  {/* RECRUITER */}

                  <div>

                    <h3 className="font-semibold text-lg text-gray-800">

                      {recruiter.recruiter}

                    </h3>

                    <p className="text-gray-500">

                      {recruiter.jobs_posted} jobs posted

                    </p>

                  </div>

                </div>


                {/* HIRES */}

                <div className="flex items-center gap-2 text-green-600 font-semibold">

                  {recruiter.hires} hires

                </div>

              </div>

            )
          )

        )}

      </div>


      {/* =====================================================
          TOP PERFORMING JOBS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-md p-6">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center">

            <FaBriefcase />

          </div>


          <div>

            <h2 className="text-2xl font-bold text-gray-800">

              Top Performing Jobs

            </h2>

            <p className="text-gray-500">

              Jobs receiving the most applications

            </p>

          </div>

        </div>


        {/* JOBS */}

        {data.top_jobs.length === 0 ? (

          <p className="text-gray-500 py-4">
            No job data available.
          </p>

        ) : (

          data.top_jobs.map(
            (job, index) => (

              <div
                key={job.job_id}
                className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0"
              >

                <div className="flex items-center gap-4">

                  {/* RANK */}

                  <div className="bg-blue-100 text-blue-600 w-11 h-11 rounded-full flex items-center justify-center font-semibold">

                    {index + 1}

                  </div>


                  {/* JOB */}

                  <div>

                    <h3 className="font-semibold text-lg text-gray-800">

                      {job.job_title}

                    </h3>

                    <p className="text-gray-500">

                      {job.applications} applications

                    </p>

                  </div>

                </div>


                {/* HIRES */}

                <div className="text-green-600 font-semibold">

                  {job.hires} hires

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>

  );

}