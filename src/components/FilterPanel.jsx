export default function FilterPanel() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-5">
        Filters
      </h2>

      {/* Job Category */}
      <div className="mb-5">

        <label className="block font-medium mb-2">
          Category
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>All Categories</option>
          <option>Data Scientist</option>
          <option>AI Engineer</option>
          <option>Python Developer</option>
          <option>Machine Learning Engineer</option>
        </select>

      </div>

      {/* Location */}
      <div className="mb-5">

        <label className="block font-medium mb-2">
          Location
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>All Locations</option>
          <option>Kathmandu</option>
          <option>Lalitpur</option>
          <option>Pokhara</option>
          <option>Remote</option>
        </select>

      </div>

      {/* Experience */}
      <div className="mb-5">

        <label className="block font-medium mb-2">
          Experience
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>Any</option>
          <option>Fresher</option>
          <option>1-2 Years</option>
          <option>3-5 Years</option>
        </select>

      </div>

      {/* Job Type */}
      <div>

        <label className="block font-medium mb-2">
          Job Type
        </label>

        <select className="w-full border rounded-lg p-3">
          <option>All Types</option>
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>

      </div>

    </div>
  );
}