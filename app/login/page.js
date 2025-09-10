'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertTriangle, LoaderCircle, Sparkles } from "lucide-react";

// A small component for the input fields to reduce repetition
const FormInput = ({ icon: Icon, type, value, onChange, placeholder, autoComplete }) => (
  <div className="relative group">
    <Icon className="h-5 w-5 text-gray-500 absolute top-1/2 left-4 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-cyan-400" />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
      required
      autoComplete={autoComplete}
    />
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.message || "Login failed. Please check your credentials.");
        return;
      }
      
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`; // 1 day expiry
      router.replace("/dashboard");

    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500/10 rounded-full filter blur-3xl animate-aurora"></div>
        <div className="absolute top-1/2 right-0 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl animate-aurora animation-delay-30000"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full filter blur-3xl animate-aurora animation-delay-15000"></div>
      </div>
      
      {/* Main Login Card */}
      <main className="w-full max-w-md p-8 space-y-6 bg-gray-800/30 rounded-2xl shadow-2xl border border-gray-700 z-10 backdrop-filter backdrop-blur-xl motion-safe:animate-fade-in-up relative">
         {/* Glow Effect */}
        <div className="absolute -top-px -left-px -right-px -bottom-px rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 pointer-events-none"></div>
        
        <div className="text-center">
            <div className="inline-block p-2 bg-gray-900/50 rounded-xl mb-4">
                <Sparkles className="h-8 w-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Half Skirmish</h1>
            <p className="text-gray-400 mt-2">Admin Panel Login</p>
        </div>

        {/* Decorative Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput 
            icon={Mail} 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username or Email" 
            autoComplete="email" 
          />
          <FormInput 
            icon={Lock} 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            autoComplete="current-password" 
          />

          {/* Error Message Display */}
          <div className={`transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0 h-0'}`}>
            {error && (
              <div className="flex items-center p-3 bg-red-900/40 text-red-300 border border-red-700/50 rounded-lg text-sm">
                <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}