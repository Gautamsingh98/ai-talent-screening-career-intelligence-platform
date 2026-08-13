function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Project Title */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-700">
            AI Talent Screening
          </h1>

          <p className="text-gray-600 mt-2">
            Career Intelligence Platform
          </p>

        </div>

        {/* Page Content */}

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;