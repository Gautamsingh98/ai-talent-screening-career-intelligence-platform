export default function InterviewSetupCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Interview Setup
      </h2>

      {/* Job Role */}
      <div className="mb-5">
        <label className="block font-semibold mb-2">
          Select Job Role
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>Data Scientist</option>
          <option>AI Engineer</option>
          <option>Machine Learning Engineer</option>
          <option>Python Developer</option>
          <option>Data Analyst</option>
        </select>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Select Difficulty
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
        Start Interview
      </button>

    </div>
  );
}