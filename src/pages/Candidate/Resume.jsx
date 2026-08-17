import CandidateLayout from "../../layouts/CandidateLayout";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaHistory,
  FaCheckCircle,
} from "react-icons/fa";

export default function Resume() {
  return (
    <CandidateLayout>
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resume Upload</h1>
        <p className="text-gray-500 mt-2">
          Upload your latest resume for AI-powered analysis.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-8">

        <div className="border-2 border-dashed border-blue-400 rounded-xl p-10 text-center bg-blue-50">

          <FaCloudUploadAlt className="text-6xl text-blue-600 mx-auto mb-5" />

          <h2 className="text-2xl font-bold">
            Drag & Drop Resume Here
          </h2>

          <p className="text-gray-500 my-3">OR</p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Choose File
          </button>

          <p className="text-gray-500 mt-4">
            Supported Formats: PDF, DOCX
          </p>

        </div>

        <button className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
          Upload Resume
        </button>

      </div>

      {/* Uploaded Resume */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">

        <h2 className="text-2xl font-bold mb-5">
          Uploaded Resume
        </h2>

        <div className="flex items-center justify-between border rounded-lg p-4">

          <div className="flex items-center gap-4">

            <FaFilePdf className="text-red-600 text-4xl" />

            <div>

              <h3 className="font-semibold">
                Resume_Gautam.pdf
              </h3>

              <p className="text-gray-500 text-sm">
                Uploaded On: 12 Aug 2026
              </p>

            </div>

          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
            Analyze Resume
          </button>

        </div>

      </div>

      {/* Upload History */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">

        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <FaHistory />
          Upload History
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between items-center border rounded-lg p-4">

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-600" />

              Resume_v1.pdf

            </div>

            <span className="text-gray-500">
              10 Aug 2026
            </span>

          </div>

          <div className="flex justify-between items-center border rounded-lg p-4">

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-600" />

              Resume_v2.pdf

            </div>

            <span className="text-gray-500">
              11 Aug 2026
            </span>

          </div>

          <div className="flex justify-between items-center border rounded-lg p-4">

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-600" />

              Resume_v3.pdf

            </div>

            <span className="text-gray-500">
              12 Aug 2026
            </span>

          </div>

        </div>

      </div>

    </CandidateLayout>
  );
}