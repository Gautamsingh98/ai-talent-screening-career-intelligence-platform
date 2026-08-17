export default function InterviewProgress() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between mb-3">

        <span className="font-semibold">
          Interview Progress
        </span>

        <span className="font-bold">
          Question 1 / 10
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">

        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: "10%" }}
        ></div>

      </div>

    </div>
  );
}