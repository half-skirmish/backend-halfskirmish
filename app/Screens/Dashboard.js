"use client";

import { useState } from "react";
import { 
  Home,
  FileText,
  Image,
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

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "media", label: "Media", icon: Image }
  ];

  // Handle create post save
  const handleSavePost = (postData) => {
    console.log('Saving post:', postData);
    // Here you would typically make an API call to save the post
    // For now, we'll just close the modal and show an alert
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
      {/* Sidebar */}
      <div className="bg-gray-800 h-screen w-64 fixed left-0 top-0 p-4 z-40">
        <div className="mb-8">
          <h2 className="text-white text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
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
<div className="bg-white h-16 fixed right-0 top-0 left-64 px-6 border-b border-gray-200 flex items-center justify-between z-30">
  <div className="flex items-center space-x-4">
    <div className="relative">
      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
  <div className="flex items-center space-x-4">
    <button
      onClick={() => setIsCreatePostModalOpen(true)}
      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      + Create Post
    </button>
    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <User size={16} className="text-gray-600" />
      </div>
      <span className="text-sm text-gray-700">Admin User</span>
      
      {/* Logout Button */}
      <button
        onClick={async () => {
          try {
            await window.Clerk.signOut();
            // The UserButton component will handle the redirect
          } catch (error) {
            console.error('Sign out error:', error);
          }
        }}
        className="text-white bg-red-600 hover:bg-white hover:text-red-600 border border-red-600 px-3 py-2 text-sm font-semibold transition-colors  rounded-md"
        title="Sign Out"
      >
        Logout
      </button>
    </div>
  </div>
</div>

      {/* Main Content */}
      <main className="ml-64 mt-2 pt-16 p-6">
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