import {
  FaUserCircle,
  FaEye,
} from "react-icons/fa";

export default function RecentApplicants() {
  const applicants = [
    {
      name: "Rahul Sharma",
      role: "Data Scientist",
      resume: "92%",
      interview: "88%",
      status: "Shortlisted",
    },
    {
      name: "Anita Verma",
      role: "Python Developer",
      resume: "86%",
      interview: "82%",
      status: "Interview",
    },
    {
      name: "John Mathew",
      role: "AI Engineer",
      resume: "95%",
      interview: "91%",
      status: "Hired",
    },
    {
      name: "Priya Singh",
      role: "ML Engineer",
      resume: "89%",
      interview: "84%",
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Applicants
        </h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          View All
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Candidate</th>

              <th className="text-center py-3">
                Applied Role
              </th>

              <th className="text-center py-3">
                Resume Score
              </th>

              <th className="text-center py-3">
                Interview Score
              </th>

              <th className="text-center py-3">
                Status
              </th>

              <th className="text-center py-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {applicants.map((applicant, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                {/* Candidate */}
                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <FaUserCircle className="text-3xl text-blue-600" />

                    <span>{applicant.name}</span>

                  </div>

                </td>

                {/* Role */}
                <td className="text-center">
                  {applicant.role}
                </td>

                {/* Resume */}
                <td className="text-center font-semibold text-green-600">
                  {applicant.resume}
                </td>

                {/* Interview */}
                <td className="text-center font-semibold text-blue-600">
                  {applicant.interview}
                </td>

                {/* Status */}
                <td className="text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        applicant.status === "Hired"
                          ? "bg-green-100 text-green-700"
                          : applicant.status === "Shortlisted"
                          ? "bg-blue-100 text-blue-700"
                          : applicant.status === "Interview"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {applicant.status}
                  </span>

                </td>

                {/* Action */}
                <td className="text-center">

                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEye />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}