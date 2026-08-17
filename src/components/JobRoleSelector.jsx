export default function JobRoleSelector() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-4">
        Select Target Job Role
      </h2>

      <select className="w-full border rounded-lg p-3">

        <option>Data Scientist</option>

        <option>AI Engineer</option>

        <option>Machine Learning Engineer</option>

        <option>Python Developer</option>

        <option>Data Analyst</option>

      </select>

    </div>
  );
}