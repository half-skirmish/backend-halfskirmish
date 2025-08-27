"use client";

import { useState } from "react";
import { 
  Home,
  FileText,
  Users,
  BarChart2,
  Image,
  MessageSquare,
  Settings
} from "lucide-react";

export default function SidebarLayout() {
  const [activeSection, setActiveSection] = useState("home");

  // Switch-case to render the right section
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <div className="p-6">🏠 Home Content</div>;
      case "posts":
        return <div className="p-6">📝 Posts Content</div>;
      case "community":
        return <div className="p-6">👥 Community Content</div>;
      case "seo":
        return <div className="p-6">📊 SEO & Insights Content</div>;
      case "media":
        return <div className="p-6">🖼️ Media Content</div>;
      case "comments":
        return <div className="p-6">💬 Comments Content</div>;
      case "settings":
        return <div className="p-6">⚙️ Settings Content</div>;
      default:
        return <div className="p-6">Select a section</div>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-blue h-screen w-64 fixed left-0 top-0 p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection("home")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "home" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Home size={20} />
            <span className="ml-3">Home</span>
          </button>

          <button
            onClick={() => setActiveSection("posts")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "posts" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FileText size={20} />
            <span className="ml-3">Posts</span>
          </button>

          <button
            onClick={() => setActiveSection("community")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "community" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Users size={20} />
            <span className="ml-3">Community</span>
          </button>

          <button
            onClick={() => setActiveSection("seo")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "seo" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <BarChart2 size={20} />
            <span className="ml-3">SEO & Insights</span>
          </button>

          <button
            onClick={() => setActiveSection("media")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "media" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Image size={20} />
            <span className="ml-3">Media</span>
          </button>

          <button
            onClick={() => setActiveSection("comments")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "comments" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <MessageSquare size={20} />
            <span className="ml-3">Comments</span>
          </button>

          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeSection === "settings" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Settings size={20} />
            <span className="ml-3">Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-gray-100 min-h-screen">
        {renderSection()}
      </main>
    </div>
  );
}
