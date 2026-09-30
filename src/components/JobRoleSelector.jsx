import { useEffect, useState } from "react";

export default function JobRoleSelector({ onJobChange, selectedJobId }) {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchJobs = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(
          "http://localhost:5000/api/candidate/jobs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {

          const errorData = await response.json().catch(() => ({}));

          throw new Error(
            errorData.message ||
            "Failed to fetch jobs"
          );
        }

        const data = await response.json();

        console.log("CANDIDATE JOBS:", data);

        setJobs(data.jobs || []);
        if (data.jobs && data.jobs.length > 0) {
            onJobChange(String(data.jobs[0].id));
          }
      } catch (error) {

        console.error("Jobs error:", error);

        setError(error.message);

      } finally {

        setLoading(false);

      }
    };

    fetchJobs();

  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        Select Target Job Role
      </h2>

      {loading ? (

        <p className="text-gray-500">
          Loading job roles...
        </p>

      ) : error ? (

        <p className="text-red-500">
          {error}
        </p>

      ) : (

        <select
          value={selectedJobId || ""}
          onChange={(e) => onJobChange(e.target.value)}
          className="w-full border rounded-lg p-3"
        >

          <option value="" disabled>
            Select a job role
          </option>

          {jobs.map((job) => (
            <option
              key={job.id}
              value={job.id}
            >
              {job.title}
            </option>
          ))}

        </select>

      )}

    </div>
  );
}