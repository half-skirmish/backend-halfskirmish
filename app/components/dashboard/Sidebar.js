import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="bg-gray-800 h-screen w-64 fixed left-0 top-0 p-4">
      <div className="flex items-center justify-center mb-8">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>
      
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <span className="ml-3">Dashboard</span>
        </Link>
        <Link href="/dashboard/games" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <span className="ml-3">Games</span>
        </Link>
        <Link href="/dashboard/profile" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <span className="ml-3">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
