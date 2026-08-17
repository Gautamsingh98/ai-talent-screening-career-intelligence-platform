import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

export default function AnswerBox() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Your Answer
      </h2>

      <textarea
        rows="8"
        placeholder="Type your answer here..."
        className="w-full border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <div className="flex gap-4 mt-6">

        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">

          <FaMicrophone />

          Record Voice

        </button>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">

          <FaPaperPlane />

          Submit Answer

        </button>

      </div>

    </div>
  );
}