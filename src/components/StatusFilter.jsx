export default function StatusFilter() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        Filter by Status
      </h2>

      <div className="flex flex-wrap gap-3">

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          All
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          Applied
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          Under Review
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          Interview
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          Selected
        </button>

        <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
          Rejected
        </button>

      </div>

    </div>
  );
}