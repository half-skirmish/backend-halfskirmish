"use client";

import { useState } from "react";
import { 
  Home,
  FileText,
  Image,
  X,
  Menu,
  Settings,
  Bell,
  Search,
  User
} from "lucide-react";

// Import all dashboard components
import HomeDashboard from "../components/dashboard/HomeScreen";
import PostsManagement from "../components/dashboard/PostsManagement";
import MediaLibrary from "../components/dashboard/MediaLibrary";
import SettingsPanel from '../components/dashboard/SettingsPanel';
import CreatePostModal from '../components/modals/CreatePost';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "media", label: "Media", icon: Image },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  // Handle create post save
  const handleSavePost = (postData) => {
    console.log('Saving post:', postData);
    setIsCreatePostModalOpen(false);
    alert('Post saved successfully!');
  };

  // Content for each section using imported components
  const renderMainContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeDashboard />;
      case "posts":
        return <PostsManagement />;
      case "media":
        return <MediaLibrary />;
      case "settings":
        return <SettingsPanel />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-gray-800 h-screen w-64 fixed left-0 top-0 p-4 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-xl font-bold">Admin Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeSection === item.id 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="ml-3">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Top Bar */}
      <div className="bg-white h-16 fixed right-0 top-0 left-0 lg:left-64 px-4 lg:px-6 border-b border-gray-200 flex items-center justify-between z-30">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>

        {/* Search - Hidden on small screens, visible on md+ */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Create Post Button */}
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="text-white bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
          >
            <span className="hidden sm:inline">+ Create Post</span>
            <span className="sm:hidden">+</span>
          </button>
          
          {/* User section */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <span className="hidden sm:block text-sm text-gray-700">Admin User</span>
            
            {/* Logout Button */}
            <button
              onClick={async () => {
                try {
                  // await window.Clerk.signOut();
                  console.log('Logout clicked');
                } catch (error) {
                  console.error('Sign out error:', error);
                }
              }}
              className="text-white bg-red-600 hover:bg-white hover:text-red-600 border border-red-600 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold transition-colors rounded-md"
              title="Sign Out"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSave={handleSavePost}
      />
    </div>
  );
}
