'use client';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Dashboard from '../Screens/Dashboard';
import LoginPage from '../Screens/Login';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <SignedIn>
        <header className="flex justify-between items-center p-4 shadow-md bg-white">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </header>
        <main className="flex-1 p-6 bg-gray-50">
          <Dashboard />
        </main>
      </SignedIn>
      
      <SignedOut>
        <LoginPage />
      </SignedOut>
    </div>
  );
}