import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

export default function Settings() {

  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =========================================================
  // FETCH SETTINGS
  // =========================================================

  useEffect(() => {

    const fetchSettings = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/settings",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("ADMIN SETTINGS:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch settings"
          );
        }

        setSettings(data.settings);

      } catch (error) {

        console.error(
          "Admin settings error:",
          error
        );

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };

    fetchSettings();

  }, []);


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setSettings((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };


  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  const handleSave = async () => {

    try {

      setSaving(true);

      setMessage("");

      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin/settings",
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...settings,

            candidate_registration:
              settings.candidate_registration ? 1 : 0,

            recruiter_registration:
              settings.recruiter_registration ? 1 : 0,

            maintenance_mode:
              settings.maintenance_mode ? 1 : 0,

            two_factor_auth:
              settings.two_factor_auth ? 1 : 0,

            email_notifications:
              settings.email_notifications ? 1 : 0,

            new_user_registrations:
              settings.new_user_registrations ? 1 : 0,

            new_job_postings:
              settings.new_job_postings ? 1 : 0,

            new_applications:
              settings.new_applications ? 1 : 0,

            hiring_notifications:
              settings.hiring_notifications ? 1 : 0,

            system_alerts:
              settings.system_alerts ? 1 : 0,
          }),
        }
      );

      const data = await response.json();

      console.log("SAVE SETTINGS:", data);

      if (!response.ok) {

        throw new Error(
          data.message || "Failed to update settings"
        );

      }

      setMessage(
        "Settings updated successfully."
      );

    } catch (error) {

      console.error(
        "Save settings error:",
        error
      );

      setError(error.message);

    } finally {

      setSaving(false);

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <AdminLayout>

        <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">

          Loading settings...

        </div>

      </AdminLayout>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error && !settings) {

    return (

      <AdminLayout>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

          <p className="font-semibold text-red-600">

            Failed to load settings

          </p>

          <p className="text-red-500 mt-1">

            {error}

          </p>

        </div>

      </AdminLayout>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <AdminLayout>

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">

            Admin Settings

          </h1>

          <p className="text-gray-500 mt-2">

            Manage platform configuration and account preferences.

          </p>

        </div>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (

          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">

            {message}

          </div>

        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && settings && (

          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

            {error}

          </div>

        )}


        {/* =================================================
            PLATFORM SETTINGS
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">

            Platform Settings

          </h2>


          <div className="space-y-6">

            {/* Platform Name */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Platform Name

              </label>

              <input
                type="text"
                name="platform_name"
                value={settings?.platform_name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Platform Email */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Platform Email

              </label>

              <input
                type="email"
                name="platform_email"
                value={settings?.platform_email || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Candidate Registration */}

            <ToggleRow
              label="Candidate Registration"
              name="candidate_registration"
              checked={Boolean(settings?.candidate_registration)}
              onChange={handleChange}
            />


            {/* Recruiter Registration */}

            <ToggleRow
              label="Recruiter Registration"
              name="recruiter_registration"
              checked={Boolean(settings?.recruiter_registration)}
              onChange={handleChange}
            />


            {/* Maintenance Mode */}

            <ToggleRow
              label="Maintenance Mode"
              name="maintenance_mode"
              checked={Boolean(settings?.maintenance_mode)}
              onChange={handleChange}
            />

          </div>

        </div>


        {/* =================================================
            SECURITY SETTINGS
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">

            Security Settings

          </h2>


          <div className="space-y-6">

            {/* Minimum Password Length */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Minimum Password Length

              </label>

              <input
                type="number"
                min="6"
                name="min_password_length"
                value={settings?.min_password_length || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Two Factor */}

            <ToggleRow
              label="Two-Factor Authentication"
              name="two_factor_auth"
              checked={Boolean(settings?.two_factor_auth)}
              onChange={handleChange}
            />


            {/* Session Timeout */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Session Timeout (minutes)

              </label>

              <input
                type="number"
                min="5"
                name="session_timeout"
                value={settings?.session_timeout || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Change Password */}

            <div className="border-t border-gray-200 pt-6">

              <h3 className="text-lg font-semibold text-gray-800 mb-4">

                Change Password

              </h3>

              <p className="text-sm text-gray-500">

                Password changing will be connected to your existing
                authentication system separately.

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            NOTIFICATION SETTINGS
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">

            Notification Settings

          </h2>


          <div className="space-y-6">

            <ToggleRow
              label="Email Notifications"
              name="email_notifications"
              checked={Boolean(settings?.email_notifications)}
              onChange={handleChange}
            />

            <ToggleRow
              label="New User Registrations"
              name="new_user_registrations"
              checked={Boolean(settings?.new_user_registrations)}
              onChange={handleChange}
            />

            <ToggleRow
              label="New Job Postings"
              name="new_job_postings"
              checked={Boolean(settings?.new_job_postings)}
              onChange={handleChange}
            />

            <ToggleRow
              label="New Applications"
              name="new_applications"
              checked={Boolean(settings?.new_applications)}
              onChange={handleChange}
            />

            <ToggleRow
              label="Hiring Notifications"
              name="hiring_notifications"
              checked={Boolean(settings?.hiring_notifications)}
              onChange={handleChange}
            />

            <ToggleRow
              label="System Alerts"
              name="system_alerts"
              checked={Boolean(settings?.system_alerts)}
              onChange={handleChange}
            />

          </div>

        </div>


        {/* =================================================
            ACCOUNT SETTINGS
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">

            Account Settings

          </h2>


          <div className="space-y-6">

            {/* Administrator Name */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Administrator Name

              </label>

              <input
                type="text"
                name="administrator_name"
                value={settings?.administrator_name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Administrator Email */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Email Address

              </label>

              <input
                type="email"
                name="administrator_email"
                value={settings?.administrator_email || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Phone Number */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Phone Number

              </label>

              <input
                type="text"
                name="phone_number"
                value={settings?.phone_number || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* Role */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Role

              </label>

              <input
                type="text"
                value="Administrator"
                disabled
                className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-gray-500"
              />

            </div>


            {/* Account Status */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Account Status

              </label>

              <input
                type="text"
                value="Active"
                disabled
                className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-gray-500"
              />

            </div>

          </div>

        </div>


        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <div className="flex justify-end mb-10">

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition duration-200"
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </div>

    </AdminLayout>

  );

}


// =========================================================
// TOGGLE COMPONENT
// =========================================================

function ToggleRow({
  label,
  name,
  checked,
  onChange,
}) {

  return (

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm font-medium text-gray-700">

          {label}

        </p>

      </div>


      <label className="relative inline-flex items-center cursor-pointer">

        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div className="
          w-12
          h-6
          bg-gray-300
          rounded-full
          peer
          peer-checked:bg-blue-600
          after:content-['']
          after:absolute
          after:top-[2px]
          after:left-[2px]
          after:bg-white
          after:border-gray-300
          after:border
          after:rounded-full
          after:h-5
          after:w-5
          after:transition-all
          peer-checked:after:translate-x-full
        " />

        <span className="ml-3 text-sm font-medium text-gray-600">

          {checked ? "ON" : "OFF"}

        </span>

      </label>

    </div>

  );
}