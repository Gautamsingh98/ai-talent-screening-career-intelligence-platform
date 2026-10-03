import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RecommendedJobsCard({ jobs = [] }) {
  const navigate = useNavigate();

  const handleViewJob = (jobId) => {
    navigate(`/candidate/jobs?job_id=${jobId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <FaBriefcase className="text-blue-600" />
        Recommended Jobs
      </h2>

      <div className="space-y-5">

        {jobs.length > 0 ? (
          jobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4"
            >

              <h3 className="font-semibold">
                {job.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {job.company || "Company Not Specified"}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <FaMapMarkerAlt />
                {job.location || "Location Not Specified"}
              </div>

              {job.match_percentage !== undefined && (
                <p className="text-sm text-green-600 font-semibold mt-2">
                  {job.match_percentage}% Skill Match
                </p>
              )}

              <button
                onClick={() => handleViewJob(job.id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Job
              </button>

            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No recommended jobs available.
          </p>
        )}

      </div>

    </div>
  );
}