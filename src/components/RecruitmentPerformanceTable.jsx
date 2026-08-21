const performanceData = [
  {
    month: "Jan",
    applications: 45,
    interviews: 18,
    hired: 12,
    success: "67%",
  },
  {
    month: "Feb",
    applications: 52,
    interviews: 22,
    hired: 18,
    success: "82%",
  },
  {
    month: "Mar",
    applications: 61,
    interviews: 26,
    hired: 22,
    success: "85%",
  },
  {
    month: "Apr",
    applications: 55,
    interviews: 23,
    hired: 20,
    success: "87%",
  },
  {
    month: "May",
    applications: 70,
    interviews: 31,
    hired: 28,
    success: "90%",
  },
  {
    month: "Jun",
    applications: 82,
    interviews: 39,
    hired: 35,
    success: "90%",
  },
];

export default function RecruitmentPerformanceTable() {
    return (
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-xl font-bold mb-6">
      Monthly Recruitment Performance
    </h2>

    <div className="overflow-x-auto">

      <table className="w-full">
          <thead>

  <tr className="border-b">

    <th className="text-left py-3">Month</th>

    <th className="text-center py-3">Applications</th>

    <th className="text-center py-3">Interviews</th>

    <th className="text-center py-3">Hired</th>

    <th className="text-center py-3">Success Rate</th>

  </tr>

</thead>
    <tbody>

  {performanceData.map((item, index) => (

    <tr
      key={index}
      className="border-b hover:bg-gray-50"
    >

      <td className="py-4 font-medium">
        {item.month}
      </td>

      <td className="text-center">
        {item.applications}
      </td>

      <td className="text-center">
        {item.interviews}
      </td>

      <td className="text-center font-semibold text-green-600">
        {item.hired}
      </td>

      <td className="text-center font-semibold text-blue-600">
        {item.success}
      </td>

    </tr>

  ))}

</tbody>
      </table>

    </div>

  </div>
);
}
