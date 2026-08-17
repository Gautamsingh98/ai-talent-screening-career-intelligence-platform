import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        Search Jobs
      </h2>

      <div className="flex gap-3">

        <div className="relative flex-1">

          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search by job title, company or skill..."
            className="w-full border rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg">
          Search
        </button>

      </div>

    </div>
  );
}