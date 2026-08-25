import { useState } from "react";

export default function AdminAccountSettings() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@aitalentscreening.com");
  const [phone, setPhone] = useState("");
  const [role] = useState("Administrator");
  const [status] = useState("Active");

  const handleSave = () => {
    alert("Account settings saved successfully.");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Account Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Manage administrator account information.
        </p>

      </div>

      {/* Account Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Name */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Administrator Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Email */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Phone */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Role */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>

          <input
            type="text"
            value={role}
            disabled
            className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-3 cursor-not-allowed"
          />

        </div>

      </div>

      {/* Account Status */}
      <div className="mt-6 border-t pt-6">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="font-semibold text-gray-800">
              Account Status
            </h3>

            <p className="text-sm text-gray-500">
              Current status of the administrator account.
            </p>

          </div>

          <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
            {status}
          </span>

        </div>

      </div>

      {/* Save */}
      <div className="mt-6">

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Save Account Settings
        </button>

      </div>

    </div>
  );
}