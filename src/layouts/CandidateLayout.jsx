import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function CandidateLayout({ children }) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Right Section */}

      <div className="flex-1 flex flex-col">

        {/* Navbar */}

        <Navbar />

        {/* Page Content */}

        <main className="p-6 flex-1">

          {children}

        </main>

      </div>

    </div>

  );

}