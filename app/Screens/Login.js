"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Wait a bit for Clerk to fully update auth state
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use window.location for immediate redirect
        window.location.href = "/dashboard";
        
        // Alternative: Use router.push with replace
        // router.replace("/dashboard");
      } else {
        console.log("Unexpected result:", result);
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center font-montserrat">
      <div className="bg-gray-800 p-12 rounded-lg shadow-lg w-96 h-[550px] border-2 border-teal-500 flex flex-col">
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

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 text-sm"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex flex-col space-y-4">
          {/* Login with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-12 h-12 flex items-center justify-center border-2 border-teal-500 rounded-full focus:outline-none mx-auto transition-all duration-300 ease-in-out hover:border-teal-400 hover:bg-border-teal-600 hover:scale-110"
          >
            <img src="/g-icon.webp" alt="Google Logo" className="w-6 h-6" />
          </button>

          {/* Forgot Password Button */}
          <button
            type="button"
            className="text-sm text-teal-400 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 mx-auto"
          >
            Forgot Password?
          </button>

          <div className="mt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 Half Skirmish. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}