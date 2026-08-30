import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import CandidateLayout from "../../layouts/CandidateLayout";

import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaHistory,
  FaCheckCircle,
} from "react-icons/fa";

export default function Resume() {
const navigate = useNavigate();
  // =========================
  // STATES
  // =========================

  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [resume, setResume] = useState(null);

  const [loadingResume, setLoadingResume] = useState(true);


  // =========================
  // FETCH MY RESUME
  // =========================

  useEffect(() => {

    const fetchResume = async () => {

      try {

        const response = await API.get(
          "/api/resume/my-resume"
        );

        setResume(response.data.resume);

      } catch (err) {

        if (err.response?.status !== 404) {

          console.error(
            "Failed to fetch resume:",
            err
          );

        }

      } finally {

        setLoadingResume(false);

      }
    };


    fetchResume();

  }, []);


  // =========================
  // CHOOSE FILE
  // =========================

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    setMessage("");

    setError("");


    if (!selectedFile) {

      setFile(null);

      return;
    }


    // Only PDF

    if (selectedFile.type !== "application/pdf") {

      setError(
        "Only PDF files are allowed."
      );

      setFile(null);

      return;
    }


    setFile(selectedFile);
  };


  // =========================
  // UPLOAD RESUME
  // =========================

  const handleUpload = async () => {

    setMessage("");

    setError("");


    // Check file

    if (!file) {

      setError(
        "Please choose a PDF resume first."
      );

      return;
    }


    setUploading(true);


    try {

      // Create FormData

      const formData = new FormData();

      formData.append(
        "resume",
        file
      );


      // Send request

      const response = await API.post(
        "/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      // Success message

      setMessage(
        response.data.message ||
        "Resume uploaded successfully."
      );


      // =========================
      // FETCH UPDATED RESUME
      // =========================

      const resumeResponse = await API.get(
        "/api/resume/my-resume"
      );

      setResume(
        resumeResponse.data.resume
      );


      // Clear selected file

      setFile(null);


    } catch (err) {

      console.error(
        "Resume upload error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Resume upload failed."
      );


    } finally {

      setUploading(false);

    }
  };


  // =========================
  // PAGE
  // =========================

  return (

    <CandidateLayout>

      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Resume Upload
        </h1>

        <p className="text-gray-500 mt-2">
          Upload your latest resume for AI-powered analysis.
        </p>

      </div>


      {/* =========================
          UPLOAD SECTION
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-8">

        <div className="border-2 border-dashed border-blue-400 rounded-xl p-10 text-center bg-blue-50">

          <FaCloudUploadAlt
            className="text-6xl text-blue-600 mx-auto mb-5"
          />


          <h2 className="text-2xl font-bold">
            Upload Your Resume
          </h2>


          <p className="text-gray-500 my-3">
            Select your latest resume PDF
          </p>


          {/* =========================
              HIDDEN FILE INPUT
          ========================= */}

          <input
            type="file"
            id="resumeFile"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />


          {/* =========================
              CHOOSE FILE BUTTON
          ========================= */}

          <label
            htmlFor="resumeFile"
            className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Choose File
          </label>


          {/* =========================
              SELECTED FILE
          ========================= */}

          {file && (

            <div className="mt-5 flex items-center justify-center gap-3">

              <FaFilePdf
                className="text-red-600 text-2xl"
              />

              <p className="font-semibold text-gray-700">
                {file.name}
              </p>

            </div>

          )}


          <p className="text-gray-500 mt-4">
            Supported Format: PDF
          </p>


          {/* =========================
              ERROR
          ========================= */}

          {error && (

            <p className="text-red-600 mt-4 font-medium">
              {error}
            </p>

          )}


          {/* =========================
              SUCCESS MESSAGE
          ========================= */}

          {message && (

            <p className="text-green-600 mt-4 font-medium">
              {message}
            </p>

          )}

        </div>


        {/* =========================
            UPLOAD BUTTON
        ========================= */}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
        >

          {uploading
            ? "Uploading..."
            : "Upload Resume"}

        </button>

      </div>


      {/* =========================
          UPLOADED RESUME
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-6 mt-8">

        <h2 className="text-2xl font-bold mb-5">
          Uploaded Resume
        </h2>


        {/* Loading */}

        {loadingResume ? (

          <p className="text-gray-500">
            Loading resume...
          </p>

        ) : resume ? (

          /* Resume exists */

          <div className="flex items-center justify-between border rounded-lg p-4">

            <div className="flex items-center gap-4">

              <FaFilePdf
                className="text-red-600 text-4xl"
              />


              <div>

                <h3 className="font-semibold">

                  {resume.original_filename}

                </h3>


                <p className="text-gray-500 text-sm">

                  Uploaded On:{" "}

                  {resume.uploaded_at
                    ? new Date(
                        resume.uploaded_at
                      ).toLocaleDateString()
                    : "N/A"}

                </p>

              </div>

            </div>


            {/* Analyze Button */}

          <button
             onClick={() =>
            navigate("/candidate/resume-analysis")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
            Analyze Resume
          </button>

          </div>

        ) : (

          /* No resume */

          <p className="text-gray-500">
            No resume uploaded yet.
          </p>

        )}

      </div>


      {/* =========================
          EXTRACTED TEXT PREVIEW
      ========================= */}

      {resume && resume.extracted_text && (

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

          <h2 className="text-2xl font-bold mb-5">
            Extracted Resume Text
          </h2>


          <div className="bg-gray-50 border rounded-lg p-5 max-h-96 overflow-y-auto">

            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {resume.extracted_text}
            </pre>

          </div>

        </div>

      )}


      {/* =========================
          UPLOAD HISTORY
      ========================= */}

      <div className="bg-white rounded-xl shadow-md p-6 mt-8">

        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">

          <FaHistory />

          Upload History

        </h2>


        <div className="space-y-4">

          {/* History Item 1 */}

          <div className="flex justify-between items-center border rounded-lg p-4">

            <div className="flex items-center gap-3">

              <FaCheckCircle
                className="text-green-600"
              />

              Resume_v1.pdf

            </div>


            <span className="text-gray-500">
              10 Aug 2026
            </span>

          </div>


          {/* History Item 2 */}

          <div className="flex justify-between items-center border rounded-lg p-4">

            <div className="flex items-center gap-3">

              <FaCheckCircle
                className="text-green-600"
              />

              Resume_v2.pdf

            </div>


            <span className="text-gray-500">
              11 Aug 2026
            </span>

          </div>


          {/* History Item 3 */}

          <div className="flex justify-between items-center border rounded-lg p-4">

            <div className="flex items-center gap-3">

              <FaCheckCircle
                className="text-green-600"
              />

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