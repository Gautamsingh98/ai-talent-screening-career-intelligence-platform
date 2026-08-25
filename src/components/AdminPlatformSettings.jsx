import { useState } from "react";

export default function AdminPlatformSettings() {
  const [platformName, setPlatformName] = useState(
    "AI Talent Screening Platform"
  );

  const [platformEmail, setPlatformEmail] = useState(
    "admin@aitalentscreening.com"
  );

  const [candidateRegistration, setCandidateRegistration] = useState(true);

  const [recruiterRegistration, setRecruiterRegistration] = useState(true);

  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    alert("Platform settings saved successfully.");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Platform Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Manage general platform configuration.
        </p>

      </div>

      {/* Platform Name */}
      <div className="mb-5">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform Name
        </label>

        <input
          type="text"
          value={platformName}
          onChange={(e) => setPlatformName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Platform Email */}
      <div className="mb-6">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform Email
        </label>

        <input
          type="email"
          value={platformEmail}
          onChange={(e) => setPlatformEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Candidate Registration */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">

        <div>

          <h3 className="font-semibold text-gray-800">
            Candidate Registration
          </h3>

          <p className="text-sm text-gray-500">
            Allow new candidates to create accounts.
          </p>

        </div>

        <button
          onClick={() =>
            setCandidateRegistration(!candidateRegistration)
          }
          className={`relative w-12 h-6 rounded-full transition ${
            candidateRegistration
              ? "bg-blue-600"
              : "bg-gray-300"
          }`}
        >

          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              candidateRegistration
                ? "left-7"
                : "left-1"
            }`}
          />

        </button>

      </div>

      {/* Recruiter Registration */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">

        <div>

          <h3 className="font-semibold text-gray-800">
            Recruiter Registration
          </h3>

          <p className="text-sm text-gray-500">
            Allow new recruiters to create accounts.
          </p>

        </div>

        <button
          onClick={() =>
            setRecruiterRegistration(!recruiterRegistration)
          }
          className={`relative w-12 h-6 rounded-full transition ${
            recruiterRegistration
              ? "bg-blue-600"
              : "bg-gray-300"
          }`}
        >

          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              recruiterRegistration
                ? "left-7"
                : "left-1"
            }`}
          />

        </button>

      </div>

      {/* Maintenance Mode */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h3 className="font-semibold text-gray-800">
            Maintenance Mode
          </h3>

          <p className="text-sm text-gray-500">
            Temporarily disable normal platform access.
          </p>

        </div>

        <button
          onClick={() =>
            setMaintenanceMode(!maintenanceMode)
          }
          className={`relative w-12 h-6 rounded-full transition ${
            maintenanceMode
              ? "bg-red-600"
              : "bg-gray-300"
          }`}
        >

          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              maintenanceMode
                ? "left-7"
                : "left-1"
            }`}
          />

        </button>

      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Save Settings
      </button>

    </div>
  );
}