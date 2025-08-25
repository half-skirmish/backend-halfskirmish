import Link from 'next/link';
import { 
  Home,
  FileText,
  Users,
  BarChart2,
  Image,
  MessageSquare,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="bg-blue h-screen w-64 fixed left-0 top-0 p-4">
      <nav className="space-y-2">
        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <Home size={20} />
          <span className="ml-3">Home</span>
        </Link>

        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <FileText size={20} />
          <span className="ml-3">Posts</span>
        </Link>

        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <Users size={20} />
          <span className="ml-3">Community</span>
        </Link>

        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <BarChart2 size={20} />
          <span className="ml-3">SEO & Insights</span>
        </Link>

        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <Image size={20} />
          <span className="ml-3">Media</span>
        </Link>

        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <MessageSquare size={20} />
          <span className="ml-3">Comments</span>
        </Link>

        <Link href="/home" className="flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-lg">
          <Settings size={20} />
          <span className="ml-3">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
