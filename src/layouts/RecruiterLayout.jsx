import RecruiterSidebar from "../components/RecruiterSidebar";
import RecruiterNavbar from "../components/RecruiterNavbar";

export default function RecruiterLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <RecruiterNavbar />

        {/* Page Content */}
        <main className="p-6 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}