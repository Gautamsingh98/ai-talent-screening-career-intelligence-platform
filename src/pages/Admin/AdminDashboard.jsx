import AdminLayout from "../../layouts/AdminLayout";
import AdminSummaryCard from "../../components/AdminSummaryCard";
import AdminCharts from "../../components/AdminCharts";
import AdminRecentUsers from "../../components/AdminRecentUsers";
import AdminRecentActivity from "../../components/AdminRecentActivity";
import AdminDashboardCharts from "../../components/AdminDashboardCharts";

export default function AdminDashboard() {
  return (
    <AdminLayout>

      {/* Page Heading */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor and manage the AI Talent Screening platform.
        </p>

      </div>

      {/* Summary Cards */}
      <AdminSummaryCard />

      {/* Charts */}
      <AdminCharts />

      {/* Recent Users */}
      <AdminRecentUsers />

       {/* Recent Activity */}
      <AdminRecentActivity />

      {/* Dashboard Charts */}
      <AdminDashboardCharts />

    </AdminLayout>
  );
}