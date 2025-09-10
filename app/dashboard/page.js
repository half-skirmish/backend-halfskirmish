'use client';

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = "token=; path=/; max-age=0";
    // Redirect to login page
    router.push("/login");
  };

  return (
    <main className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white font-medium transition-colors"
        >
          Logout
        </button>
      </div>
      <p>Welcome to your dashboard!</p>
    </main>
  );
}
