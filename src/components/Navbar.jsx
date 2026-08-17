import {FaSearch, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Candidate Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          Welcome Back 
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">

        <FaSearch className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full"
        />

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
      {/* Notification Bell (Will be added later) */}
      {/* <FaBell className="text-2xl text-gray-600 cursor-pointer" />  */}
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-4xl text-blue-600" />
          <div> 

            <p className="font-semibold">
              Candidate
            </p>

            <p className="text-xs text-gray-500">
              candidate@email.com
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}