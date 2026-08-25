import { useState } from "react";
import {
  FaBriefcase,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

export default function JobsTable() {
const [search, setSearch] = useState("");
const [status, setStatus] = useState("All");

  const jobs = [
    {
      title: "Python Developer",
      location: "Kathmandu",
      type: "Full-Time",
      applications: 24,
      status: "Active",
    },
    {
      title: "Data Scientist",
      location: "Pokhara",
      type: "Remote",
      applications: 18,
      status: "Active",
    },
    {
      title: "AI Engineer",
      location: "Lalitpur",
      type: "Hybrid",
      applications: 31,
      status: "Closed",
    },
    {
      title: "Frontend Developer",
      location: "Bhaktapur",
      type: "Internship",
      applications: 15,
      status: "Draft",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Job Listings
      </h2>

      
       {/* Search and Filter */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

    <input
      type="text"
      placeholder="Search jobs..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-200 rounded-lg px-4 py-3 
                 outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500"
    />

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border border-gray-200 rounded-lg px-4 py-3 
                 outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 bg-white"
    >
      <option value="All">All Jobs</option>
      <option value="Active">Active</option>
      <option value="Closed">Closed</option>
      <option value="Draft">Draft</option>
    </select>

  </div>

       {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Job Title</th>

              <th className="text-center py-3">Location</th>

              <th className="text-center py-3">Job Type</th>

              <th className="text-center py-3">Applications</th>

              <th className="text-center py-3">Status</th>

              <th className="text-center py-3">Actions</th>

            </tr>

          </thead>

          <tbody>

           {jobs
           .filter((job) => {
            const matchesSearch = job.title
            .toLowerCase()
            .includes(search.toLowerCase());

             const matchesStatus =
              status === "All" || job.status === status;

               return matchesSearch && matchesStatus;
                })
              .map((job, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                {/* Job Title */}
                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <FaBriefcase className="text-blue-600" />

                    <span>{job.title}</span>

                  </div>

                </td>

                {/* Location */}
                <td className="text-center">
                  {job.location}
                </td>

                {/* Job Type */}
                <td className="text-center">
                  {job.type}
                </td>

                {/* Applications */}
                <td className="text-center font-semibold">
                  {job.applications}
                </td>

                {/* Status */}
                <td className="text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      job.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {job.status}
                  </span>

                </td>

                {/* Actions */}
                <td>

                  <div className="flex justify-center gap-5">

                    <FaEye
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                    />

                    <FaEdit
                      className="text-green-600 cursor-pointer hover:text-green-800"
                    />

                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-800"
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