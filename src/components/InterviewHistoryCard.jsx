export default function InterviewHistoryCard() {

  const history = [
    {
      role: "Data Scientist",
      score: "88%",
      date: "20 Aug 2026",
    },
    {
      role: "Python Developer",
      score: "82%",
      date: "15 Aug 2026",
    },
    {
      role: "AI Engineer",
      score: "91%",
      date: "10 Aug 2026",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Interview History
      </h2>

      <div className="space-y-4">

        {history.map((item, index) => (

          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold">
                {item.role}
              </h3>

              <p className="text-gray-500">
                {item.date}
              </p>

            </div>

            <span className="text-blue-600 font-bold">
              {item.score}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}