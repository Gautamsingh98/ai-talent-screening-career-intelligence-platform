import CandidateLayout from "../../layouts/CandidateLayout";

import SearchBar from "../../components/SearchBar";
import FilterPanel from "../../components/FilterPanel";
import JobCard from "../../components/JobCard";

export default function Jobs() {
  return (
    <CandidateLayout>

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Browse Jobs
        </h1>

        <p className="text-gray-500 mt-2">
          Discover opportunities that match your skills.
        </p>
      </div>

      {/* Search */}
      <SearchBar />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">

        {/* Filters */}
        <div>
          <FilterPanel />
        </div>

        {/* Job Cards */}
        <div className="lg:col-span-3 space-y-6">

          <JobCard
            title="Data Scientist"
            company="ABC Technologies"
            location="Kathmandu"
            salary="NPR 80,000/month"
            type="Full Time"
            skills={[
              "Python",
              "SQL",
              "Machine Learning",
            ]}
          />

          <JobCard
            title="AI Engineer"
            company="XYZ Solutions"
            location="Lalitpur"
            salary="NPR 100,000/month"
            type="Full Time"
            skills={[
              "Python",
              "TensorFlow",
              "Deep Learning",
            ]}
          />

          <JobCard
            title="Python Developer"
            company="Tech Nepal"
            location="Remote"
            salary="NPR 70,000/month"
            type="Internship"
            skills={[
              "Python",
              "Django",
              "REST API",
            ]}
          />

        </div>

      </div>

    </CandidateLayout>
  );
}