import { useState } from "react";

export default function AdminSecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [minPasswordLength, setMinPasswordLength] = useState("8");

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Security settings saved successfully.");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Security Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Manage authentication and security settings.
        </p>

      </div>

      {/* Change Password */}
      <div className="border-b pb-6 mb-6">

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Change Password
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Current Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* New Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Confirm Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

      </div>

      {/* Minimum Password Length */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">

        <div>

          <h3 className="font-semibold text-gray-800">
            Minimum Password Length
          </h3>

          <p className="text-sm text-gray-500">
            Set the minimum number of characters required for passwords.
          </p>

        </div>

        <select
          value={minPasswordLength}
          onChange={(e) => setMinPasswordLength(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="6">6 characters</option>
          <option value="8">8 characters</option>
          <option value="10">10 characters</option>
          <option value="12">12 characters</option>
        </select>

      </div>

      {/* Two Factor Authentication */}
      <div className="flex items-center justify-between border-b pb-5 mb-5">

        <div>

          <h3 className="font-semibold text-gray-800">
            Two-Factor Authentication
          </h3>

          <p className="text-sm text-gray-500">
            Add an extra layer of security to administrator accounts.
          </p>

        </div>

        <button
          onClick={() => setTwoFactor(!twoFactor)}
          className={`relative w-12 h-6 rounded-full transition ${
            twoFactor
              ? "bg-blue-600"
              : "bg-gray-300"
          }`}
        >

          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              twoFactor
                ? "left-7"
                : "left-1"
            }`}
          />

        </button>

      </div>

      {/* Session Timeout */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h3 className="font-semibold text-gray-800">
            Session Timeout
          </h3>

          <p className="text-sm text-gray-500">
            Automatically log out inactive administrators.
          </p>

        </div>

        <select
          value={sessionTimeout}
          onChange={(e) => setSessionTimeout(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="120">2 hours</option>
        </select>

      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Save Security Settings
      </button>

    </div>
  );
}