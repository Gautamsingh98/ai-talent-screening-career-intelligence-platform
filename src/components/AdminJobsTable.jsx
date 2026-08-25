import { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import AdminJobDetailsModal from "./AdminJobDetailsModal";

export default function AdminJobsTable() {
    const [selectedJob, setSelectedJob] = useState(null);
      const [search, setSearch] = useState("");
      const [status, setStatus] = useState("All");
      
      const [currentPage, setCurrentPage] = useState(1);
      const jobsPerPage = 3;

    const [jobs, setJobs] = useState([
    {
      title: "Data Scientist",
      recruiter: "Tech Solutions Pvt. Ltd.",
      location: "Kathmandu",
      applicants: 45,
      date: "23 Aug 2026",
      status: "Active",
    },
    {
      title: "Python Developer",
      recruiter: "AI Innovations",
      location: "Lalitpur",
      applicants: 32,
      date: "22 Aug 2026",
      status: "Active",
    },
    {
      title: "AI Engineer",
      recruiter: "Future Tech",
      location: "Kathmandu",
      applicants: 28,
      date: "20 Aug 2026",
      status: "Closed",
    },
    {
      title: "Machine Learning Engineer",
      recruiter: "Data Labs",
      location: "Pokhara",
      applicants: 21,
      date: "18 Aug 2026",
      status: "Active",
    },
  ]);
    const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.recruiter.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
    status === "All" || job.status === status;

    return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(
  filteredJobs.length / jobsPerPage
);

const startIndex =
  (currentPage - 1) * jobsPerPage;

const currentJobs = filteredJobs.slice(
  startIndex,
  startIndex + jobsPerPage
);


  const deleteJob = (title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedJobs = jobs.filter(
      (job) => job.title !== title
    );

    setJobs(updatedJobs);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Filters */}
<div className="flex flex-col md:flex-row gap-4 mb-6">

  {/* Search */}
  <input
    type="text"
    placeholder="Search jobs or recruiters..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Status Filter */}
  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="All">All Status</option>
    <option value="Active">Active</option>
    <option value="Closed">Closed</option>
  </select>

</div>
      {/* Table Header */}
      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Posted Jobs
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Manage jobs posted by recruiters.
        </p>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b text-gray-500 text-sm">

              <th className="text-left py-3">
                Job Title
              </th>

              <th className="text-left py-3">
                Recruiter
              </th>

              <th className="text-center py-3">
                Location
              </th>

              <th className="text-center py-3">
                Applicants
              </th>

              <th className="text-center py-3">
                Posted Date
              </th>

              <th className="text-center py-3">
                Status
              </th>

              <th className="text-center py-3">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredJobs.length > 0 ? (

             currentJobs.map((job) => (

                <tr
                  key={job.title}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  {/* Job Title */}
                  <td className="py-4 font-medium text-gray-800">
                    {job.title}
                  </td>

                  {/* Recruiter */}
                  <td className="text-gray-600">
                    {job.recruiter}
                  </td>

                  {/* Location */}
                  <td className="text-center text-gray-600">
                    {job.location}
                  </td>

                  {/* Applicants */}
                  <td className="text-center font-medium">
                    {job.applicants}
                  </td>

                  {/* Date */}
                  <td className="text-center text-gray-600">
                    {job.date}
                  </td>

                  {/* Status */}
                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {job.status}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="text-center">

                    <div className="flex justify-center items-center gap-3">

                      {/* View */}
                      <button
                         onClick={() => setSelectedJob(job)}
                         className="text-blue-600 hover:text-blue-800"
                         title="View Job"
                         >
                         <FaEye />
                       </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          deleteJob(job.title)
                        }
                        className="text-red-600 hover:text-red-800"
                        title="Delete Job"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-8 text-gray-500"
                >
                  No jobs found.
                </td>

              </tr>

            )}

          </tbody>

        </table>
        {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6">

    <button
      onClick={() =>
        setCurrentPage((page) => Math.max(page - 1, 1))
      }
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Previous
    </button>

    {Array.from(
      { length: totalPages },
      (_, index) => index + 1
    ).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-4 py-2 rounded-lg ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "border hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() =>
        setCurrentPage((page) =>
          Math.min(page + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Next
    </button>

  </div>
)}
      </div>

          <AdminJobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

    </div>
  );
}