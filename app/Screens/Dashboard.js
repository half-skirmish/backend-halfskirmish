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

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "media", label: "Media", icon: Image },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  // Content for each section using imported components
  const renderMainContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeDashboard />;
      case "posts":
        return <PostsManagement />;
      case "community":
        return <CommunityManagement />;
      case "seo":
        return <SEOAnalytics />;
      case "media":
        return <MediaLibrary />;
      case "comments":
        return <CommentsManagement />;
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
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
          </button>
          
          <button className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + Create Post
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">Admin User</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}