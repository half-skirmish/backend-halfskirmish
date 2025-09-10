'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login'); // Redirect after mount
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin text-indigo-600" size={48} />
    </div>
  );
}
