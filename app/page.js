'use client';
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginPage from './Screens/Login';

export default function Home() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Only redirect after Clerk has loaded and user is authenticated
    if (isLoaded && user) {
      router.replace("/dashboard");
    }
  }, [isLoaded, user, router]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SignedIn>
        {/* This will briefly show before redirect */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      </SignedIn>
      
      <SignedOut>
        <LoginPage />
      </SignedOut>
    </div>
  );
}