export default function CareerReasonCard() {

  const reasons = [
    "Strong Python Programming Skills",
    "Excellent SQL Knowledge",
    "Good Machine Learning Foundation",
    "Strong Data Analysis Skills",
    "Good Problem Solving Ability",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Why This Career?
      </h2>

      <ul className="space-y-3">

        {reasons.map((reason) => (
          <li key={reason}>✅ {reason}</li>
        ))}

      </ul>

    </div>
  );
}