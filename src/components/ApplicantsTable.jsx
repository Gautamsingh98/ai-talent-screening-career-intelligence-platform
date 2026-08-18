import {
  FaEye,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function ApplicantsTable() {
  const applicants = [
    {
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      job: "Data Scientist",
      score: 92,
      status: "Pending",
    },
    {
      name: "Priya Singh",
      email: "priya@gmail.com",
      job: "Python Developer",
      score: 88,
      status: "Shortlisted",
    },
    {
      name: "Rohan Gupta",
      email: "rohan@gmail.com",
      job: "AI Engineer",
      score: 75,
      status: "Rejected",
    },
    {
      name: "Anjali Rai",
      email: "anjali@gmail.com",
      job: "ML Engineer",
      score: 95,
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Applicant List
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Candidate</th>
              <th className="text-left py-3">Email</th>
              <th className="text-center py-3">Applied For</th>
              <th className="text-center py-3">AI Score</th>
              <th className="text-center py-3">Status</th>
              <th className="text-center py-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {applicants.map((applicant, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4 font-medium">
                  {applicant.name}
                </td>

                <td>
                  {applicant.email}
                </td>

                <td className="text-center">
                  {applicant.job}
                </td>

                <td className="text-center font-bold text-blue-600">
                  {applicant.score}%
                </td>

                <td className="text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        applicant.status === "Shortlisted"
                          ? "bg-green-100 text-green-700"
                          : applicant.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {applicant.status}
                  </span>

                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <FaEye
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      title="View Profile"
                    />

                    <FaFilePdf
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="View Resume"
                    />

                    <FaCheckCircle
                      className="text-green-600 cursor-pointer hover:text-green-800"
                      title="Shortlist"
                    />

                    <FaTimesCircle
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      title="Reject"
                    />

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