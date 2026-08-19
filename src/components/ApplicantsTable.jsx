import { useState } from "react";
import CandidateProfileModal from "./CandidateProfileModal";
import ResumePreviewModal from "./ResumePreviewModal";

import {
  FaEye,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function ApplicantsTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [applicants, setApplicants] = useState([
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
]);
  const filteredApplicants = applicants.filter((applicant) => {
  const matchesSearch = applicant.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesStatus =
    status === "All" || applicant.status === status;

  return matchesSearch && matchesStatus;
});
    const updateStatus = (index, newStatus) => {
  const updatedApplicants = [...applicants];

  updatedApplicants[index].status = newStatus;

  setApplicants(updatedApplicants);
};
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
  Applicant List
</h2>

<div className="mb-6">

  {/* Search Box */}
  <input
    type="text"
    placeholder="Search candidate..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Status Filter */}
  <div className="mt-4">

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All Applicants</option>
      <option value="Pending">Pending</option>
      <option value="Shortlisted">Shortlisted</option>
      <option value="Rejected">Rejected</option>
    </select>

  </div>

</div>

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

            {filteredApplicants.map((applicant, index) => (

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
                       onClick={() => setSelectedApplicant(applicant)} />

                    <FaFilePdf
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="View Resume"
                      onClick={() => setSelectedResume(applicant)} />

                    <FaCheckCircle
                      className="text-green-600 cursor-pointer hover:text-green-800"
                      title="Shortlist"
                      onClick={() => {
                      const confirmShortlist = window.confirm(
                      "Are you sure you want to shortlist this candidate?"
                        );

                        if (confirmShortlist) {
                           updateStatus(index, "Shortlisted");
                         }
                        }} />

                    <FaTimesCircle
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      title="Reject"
                      onClick={() => {
                     const confirmReject = window.confirm(
                     "Are you sure you want to reject this candidate?"
                      );

                     if (confirmReject) {
                        updateStatus(index, "Rejected");
                     }
                    }}/>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
        <CandidateProfileModal
              applicant={selectedApplicant}
               onClose={() => setSelectedApplicant(null)} />

         <ResumePreviewModal
              applicant={selectedResume}
              onClose={() => setSelectedResume(null)} />      
    </div>
  );
}