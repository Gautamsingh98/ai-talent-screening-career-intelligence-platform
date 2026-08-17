import CandidateLayout from "../../layouts/CandidateLayout";

import ProfileCard from "../../components/ProfileCard";
import ProfileCompletion from "../../components/ProfileCompletion";

export default function Profile() {
  return (
    <CandidateLayout>

      {/* Page Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          Candidate Profile

        </h1>

        <p className="text-gray-500 mt-2">

          Manage your personal information and skills.

        </p>

      </div>

      {/* Profile */}

      <ProfileCard />

      {/* Completion */}

      <div className="mt-8">

        <ProfileCompletion />

      </div>

    </CandidateLayout>
  );
}