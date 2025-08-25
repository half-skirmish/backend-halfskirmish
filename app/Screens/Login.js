"use client";

export default function LoginPage({ onLogin }) {
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center font-montserrat">
      {/* Login Form Section */}
      <div className="bg-gray-800 p-12 rounded-lg shadow-lg w-96 h-[550px] border-2 border-teal-500 flex flex-col">
        {/* Website Logo */}
        <div className="text-center font-bold text-lg px-4 py-4 rounded-xl bg-slate-700 mb-8">
          Half Skirmish Blog Login
        </div>

        <form className="flex-grow" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full p-3 mt-2 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="w-full p-3 mt-2 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 text-sm"
          >
            Login
          </button>
        </form>

        {/* Additional Buttons */}
        <div className="mt-4 flex flex-col space-y-4">
          {/* Login with Google Button */}
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center border-2 border-teal-500 rounded-full focus:outline-none mx-auto transition-all duration-300 ease-in-out hover:border-teal-400 hover:bg-border-teal-600 hover:scale-110"
          >
            <img
              src="/g-icon.webp" // Google Logo URL
              alt="Google Logo"
              className="w-6 h-6"
            />
          </button>

          {/* Forgot Password Button */}
          <button
            type="button"
            className="text-sm text-teal-400 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 mx-auto"
          >
            Forgot Password?
          </button>

          {/* Copyright Text */}
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 Half Skirmish. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
