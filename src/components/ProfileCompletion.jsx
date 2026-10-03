import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ProfileCompletion() {
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const response = await API.get(
          "/api/candidate/profile"
        );

        if (response.data.success) {
          setCompletion(
            response.data.profile.completion || 0
          );
        }
      } catch (error) {
        console.error(
          "Profile completion error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, []);

  const getMessage = () => {
    if (completion >= 100) {
      return "Your profile is complete. You're ready for better job recommendations.";
    }

    if (completion >= 80) {
      return "Your profile is almost complete. Add the remaining information.";
    }

    if (completion >= 60) {
      return "Your profile is looking good. Complete a few more details.";
    }

    if (completion >= 40) {
      return "Add more information to improve your job recommendations.";
    }

    return "Complete your profile to improve job recommendations.";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">
          Loading profile completion...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Profile Completion
      </h2>

      <div className="flex justify-between mb-2">

        <span className="font-medium">
          Completion
        </span>

        <span className="font-bold text-blue-600">
          {completion}%
        </span>

      </div>

      {/* Progress Bar */}

      <div className="w-full bg-gray-200 rounded-full h-4">

        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(completion, 100)}%`,
          }}
        ></div>

      </div>

      <p className="mt-4 text-gray-500">
        {getMessage()}
      </p>

    </div>
  );
}