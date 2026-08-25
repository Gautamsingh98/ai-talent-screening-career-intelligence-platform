import { useState } from "react";

export default function AdminNotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUsers, setNewUsers] = useState(true);
  const [newJobs, setNewJobs] = useState(true);
  const [newApplications, setNewApplications] = useState(true);
  const [newHires, setNewHires] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  const handleSave = () => {
    alert("Notification settings saved successfully.");
  };

  const Toggle = ({ enabled, setEnabled }) => {
    return (
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-12 h-6 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Notification Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Manage administrator notification preferences.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            Email Notifications
          </h3>

          <p className="text-sm text-gray-500">
            Receive important platform notifications by email.
          </p>
        </div>

        <Toggle
          enabled={emailNotifications}
          setEnabled={setEmailNotifications}
        />
      </div>

      {/* New Users */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            New User Registrations
          </h3>

          <p className="text-sm text-gray-500">
            Notify when a new candidate or recruiter registers.
          </p>
        </div>

        <Toggle
          enabled={newUsers}
          setEnabled={setNewUsers}
        />
      </div>

      {/* New Jobs */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            New Job Postings
          </h3>

          <p className="text-sm text-gray-500">
            Notify when a recruiter posts a new job.
          </p>
        </div>

        <Toggle
          enabled={newJobs}
          setEnabled={setNewJobs}
        />
      </div>

      {/* Applications */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            New Applications
          </h3>

          <p className="text-sm text-gray-500">
            Notify when candidates apply for jobs.
          </p>
        </div>

        <Toggle
          enabled={newApplications}
          setEnabled={setNewApplications}
        />
      </div>

      {/* Hires */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">
            Hiring Notifications
          </h3>

          <p className="text-sm text-gray-500">
            Notify when a candidate is successfully hired.
          </p>
        </div>

        <Toggle
          enabled={newHires}
          setEnabled={setNewHires}
        />
      </div>

      {/* System Alerts */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">
            System Alerts
          </h3>

          <p className="text-sm text-gray-500">
            Receive important system and platform alerts.
          </p>
        </div>

        <Toggle
          enabled={systemAlerts}
          setEnabled={setSystemAlerts}
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Save Notification Settings
      </button>

    </div>
  );
}