import {
  FaBriefcase,
  FaEye,
  FaEdit,
} from "react-icons/fa";

export default function RecentJobs() {
  const jobs = [
    {
      title: "Python Developer",
      applications: 24,
      status: "Active",
      date: "Today",
    },
    {
      title: "Data Scientist",
      applications: 18,
      status: "Active",
      date: "Yesterday",
    },
    {
      title: "AI Engineer",
      applications: 36,
      status: "Closed",
      date: "3 Days Ago",
    },
    {
      title: "Frontend Developer",
      applications: 15,
      status: "Active",
      date: "Last Week",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Jobs
        </h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Job Title</th>

              <th className="text-center py-3">
                Applications
              </th>

              <th className="text-center py-3">
                Status
              </th>

              <th className="text-center py-3">
                Posted
              </th>

              <th className="text-center py-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {jobs.map((job, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <FaBriefcase className="text-blue-600" />

                    {job.title}

                  </div>

                </td>

                <td className="text-center">
                  {job.applications}
                </td>

                <td className="text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.status}
                  </span>

                </td>

                <td className="text-center">
                  {job.date}
                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <FaEye className="cursor-pointer text-blue-600 hover:text-blue-800" />

                    <FaEdit className="cursor-pointer text-green-600 hover:text-green-800" />

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}