import AdminLayout from "../../layouts/AdminLayout";
import AdminPlatformSettings from "../../components/AdminPlatformSettings";
import AdminSecuritySettings from "../../components/AdminSecuritySettings";
import AdminNotificationSettings from "../../components/AdminNotificationSettings";
import AdminAccountSettings from "../../components/AdminAccountSettings";

export default function AdminSettings() {
  return (
    <AdminLayout>

      {/* Page Heading */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Admin Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage platform settings, notifications, and security.
        </p>

      </div>

      {/* Settings */}
      <div className="space-y-6">

        {/* Platform Settings */}
        <AdminPlatformSettings />

        {/* Security */}
        <AdminSecuritySettings />        

        {/* Notifications */}
        <AdminNotificationSettings />

        {/* Account Settings */}
        <AdminAccountSettings />

      </div>

    </AdminLayout>
  );
}