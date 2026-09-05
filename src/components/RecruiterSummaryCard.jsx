import {
  FaBriefcase,
  FaUsers,
  FaUserCheck,
  FaCheckCircle,
} from "react-icons/fa";

export default function RecruiterSummaryCard({ stats, loading }) {

  // =========================================================
  // CALCULATE DYNAMIC PROGRESS
  // =========================================================

  const jobsProgress = Math.min(
    ((stats?.jobs_posted || 0) / 10) * 100,
    100
  );

  const applicationsProgress = Math.min(
    ((stats?.applicants || 0) / 100) * 100,
    100
  );

  const shortlistedProgress =
    stats?.applicants > 0
      ? Math.round(
          (stats.shortlisted / stats.applicants) * 100
        )
      : 0;

  const hiredProgress =
    stats?.applicants > 0
      ? Math.round(
          (stats.hired / stats.applicants) * 100
        )
      : 0;


  const summaryStats = [
    {
      title: "Jobs Posted",
      value: stats?.jobs_posted || 0,
      progress: Math.round(jobsProgress),
      footer: "Total jobs posted",
      icon: (
        <FaBriefcase className="text-3xl text-blue-600" />
      ),
      color: "bg-blue-500",
    },

    {
      title: "Applications",
      value: stats?.applicants || 0,
      progress: Math.round(applicationsProgress),
      footer: "Total applications received",
      icon: (
        <FaUsers className="text-3xl text-purple-600" />
      ),
      color: "bg-purple-500",
    },

    {
      title: "Shortlisted",
      value: stats?.shortlisted || 0,
      progress: shortlistedProgress,
      footer: "Candidates shortlisted",
      icon: (
        <FaUserCheck className="text-3xl text-orange-500" />
      ),
      color: "bg-orange-500",
    },

    {
      title: "Hired",
      value: stats?.hired || 0,
      progress: hiredProgress,
      footer: "Candidates hired",
      icon: (
        <FaCheckCircle className="text-3xl text-green-600" />
      ),
      color: "bg-green-500",
    },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {summaryStats.map((item, index) => (

        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6
                     hover:shadow-xl hover:-translate-y-1
                     transition duration-300"
        >

          {/* =================================================
              TOP SECTION
          ================================================= */}

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : item.value}
              </h2>

            </div>

            {item.icon}

          </div>


          {/* =================================================
              PROGRESS BAR
          ================================================= */}

          <div className="mt-6">

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                style={{
                  width: `${item.progress}%`,
                }}
              ></div>

            </div>

            <p className="text-sm text-gray-500 mt-2">
              {item.progress}% Progress
            </p>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-4 border-t pt-3">

            <p className="text-sm font-medium text-gray-700">
              {item.footer}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
}