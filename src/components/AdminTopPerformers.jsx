import {
  FaUserTie,
  FaBriefcase,
  FaTrophy,
} from "react-icons/fa";

export default function AdminTopPerformers() {
  const recruiters = [
    {
      name: "Tech Solutions Pvt. Ltd.",
      jobs: 12,
      hires: 28,
    },
    {
      name: "AI Innovations",
      jobs: 9,
      hires: 21,
    },
    {
      name: "NextGen Technologies",
      jobs: 8,
      hires: 18,
    },
    {
      name: "Global Softwares",
      jobs: 7,
      hires: 15,
    },
  ];

  const jobs = [
    {
      title: "Data Scientist",
      applications: 245,
      hires: 18,
    },
    {
      title: "Python Developer",
      applications: 210,
      hires: 16,
    },
    {
      title: "AI Engineer",
      applications: 185,
      hires: 14,
    },
    {
      title: "Machine Learning Engineer",
      applications: 160,
      hires: 12,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* Top Recruiters */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
            <FaUserTie />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Top Recruiters
            </h2>

            <p className="text-sm text-gray-500">
              Recruiters with the highest hiring activity
            </p>
          </div>

        </div>

        <div className="space-y-4">

          {recruiters.map((recruiter, index) => (

            <div
              key={index}
              className="flex items-center justify-between border-b last:border-b-0 pb-4"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {recruiter.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {recruiter.jobs} jobs posted
                  </p>
                </div>

              </div>

              <div className="text-right">

                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <FaTrophy />
                  {recruiter.hires} hires
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Top Performing Jobs */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <FaBriefcase />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Top Performing Jobs
            </h2>

            <p className="text-sm text-gray-500">
              Jobs receiving the most applications
            </p>
          </div>

        </div>

        <div className="space-y-4">

          {jobs.map((job, index) => (

            <div
              key={index}
              className="border-b last:border-b-0 pb-4"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {job.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {job.applications} applications
                    </p>
                  </div>

                </div>

                <span className="text-green-600 font-semibold">
                  {job.hires} hires
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}