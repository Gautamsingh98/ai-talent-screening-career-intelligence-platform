import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import SkillBadge from "./SkillBadge";
import API from "../api/axios";

export default function ProfileCard() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    university: "",
    degree: "",
    skills: "",
  });

  // ============================================================
  // FETCH PROFILE
  // ============================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/api/candidate/profile"
      );

      if (response.data.success) {
        const profileData = response.data.profile;

        setProfile(profileData);

        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
          university: profileData.university || "",
          degree: profileData.degree || "",
          skills: profileData.skills?.join(", ") || "",
        });
      }
    } catch (error) {
      console.error("Profile loading error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load candidate profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const response = await API.put(
        "/api/candidate/profile",
        {
          name: formData.name,
          phone: formData.phone,
          university: formData.university,
          degree: formData.degree,
          skills: skills,
        }
      );

      if (response.data.success) {
        setMessage(
          "Profile updated successfully."
        );

        setEditing(false);

        await fetchProfile();
      }
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // CANCEL EDIT
  // ============================================================

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      university: profile.university || "",
      degree: profile.degree || "",
      skills: profile.skills?.join(", ") || "",
    });

    setError("");
    setMessage("");
    setEditing(false);
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error && !profile) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="text-red-500 font-medium">
          {error}
        </p>
      </div>
    );
  }

  // ============================================================
  // PROFILE VIEW
  // ============================================================

  return (
    <div className="bg-white rounded-xl shadow-md p-8">

      {/* Profile Header */}

      <div className="flex items-center gap-6">

        <FaUserCircle className="text-8xl text-blue-600" />

        <div>

          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          ) : (
            <h2 className="text-3xl font-bold">
              {profile?.name || "Candidate"}
            </h2>
          )}

          <p className="text-gray-500 mt-1">
            Data Science Student
          </p>

        </div>

      </div>

      {/* Success Message */}

      {message && (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
          {message}
        </div>
      )}

      {/* Error Message */}

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Personal Information */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Email */}

        <div>

          <h3 className="font-semibold">
            Email
          </h3>

          <p className="text-gray-600">
            {profile?.email || "Not provided"}
          </p>

        </div>

        {/* Phone */}

        <div>

          <h3 className="font-semibold">
            Phone
          </h3>

          {editing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          ) : (
            <p className="text-gray-600">
              {profile?.phone || "Not provided"}
            </p>
          )}

        </div>

        {/* University */}

        <div>

          <h3 className="font-semibold">
            University
          </h3>

          {editing ? (
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter university"
            />
          ) : (
            <p className="text-gray-600">
              {profile?.university || "Not provided"}
            </p>
          )}

        </div>

        {/* Degree */}

        <div>

          <h3 className="font-semibold">
            Degree
          </h3>

          {editing ? (
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter degree"
            />
          ) : (
            <p className="text-gray-600">
              {profile?.degree || "Not provided"}
            </p>
          )}

        </div>

      </div>

      {/* Skills */}

      <div className="mt-10">

        <h3 className="text-xl font-bold mb-5">
          Skills
        </h3>

        {editing ? (
          <div>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Python, SQL, Machine Learning, Pandas, NumPy"
            />

            <p className="text-sm text-gray-500 mt-2">
              Enter skills separated by commas.
            </p>

          </div>
        ) : (
          <div className="flex flex-wrap gap-3">

            {profile?.skills?.length > 0 ? (

              profile.skills.map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                />
              ))

            ) : (

              <p className="text-gray-500">
                No skills added yet.
              </p>

            )}

          </div>
        )}

      </div>

      {/* Buttons */}

      <div className="mt-10 flex gap-3">

        {!editing ? (

          <button
            onClick={() => {
              setMessage("");
              setError("");
              setEditing(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Edit Profile
          </button>

        ) : (

          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          </>

        )}

      </div>

    </div>
  );
}