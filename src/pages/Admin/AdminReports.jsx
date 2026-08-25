import { useRef } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import AdminReportSummaryCards from "../../components/AdminReportSummaryCards";
import AdminReportsCharts from "../../components/AdminReportsCharts";
import AdminReportInsights from "../../components/AdminReportInsights";
import AdminReportExport from "../../components/AdminReportExport";

export default function AdminReports() {
  const reportRef = useRef(null);

  return (
    <AdminLayout>

      {/* Page Heading */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Reports
          </h1>

          <p className="text-gray-500 mt-2">
            View platform-wide reports and performance statistics.
          </p>

        </div>

        <AdminReportExport reportRef={reportRef} />

      </div>

      {/* Report Content */}
      <div ref={reportRef}>

        {/* Summary Cards */}
        <AdminReportSummaryCards />

        {/* Charts */}
        <AdminReportsCharts />

        {/* Insights */}
        <AdminReportInsights />

      </div>

    </AdminLayout>
  );
}