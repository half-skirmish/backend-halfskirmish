
"use client";

import { useState } from "react";
import { 
  Home,
  FileText,
  Image,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X
} from "lucide-react";

// HomeDashboard Component
export default function HomeDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <FileText className="text-blue-500 flex-shrink-0" size={20} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Posts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">156</p>
            </div>
            <User className="text-green-500 flex-shrink-0" size={20} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Media Files</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">890</p>
            </div>
            <Image className="text-purple-500 flex-shrink-0" size={20} />
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-gray-600">New post published: "Getting Started with React"</span>
            </div>
            <span className="text-xs text-gray-400 sm:ml-auto pl-5 sm:pl-0">2 minutes ago</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-gray-600">New member joined the community</span>
            </div>
            <span className="text-xs text-gray-400 sm:ml-auto pl-5 sm:pl-0">5 minutes ago</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-gray-600">Comment awaiting moderation</span>
            </div>
            <span className="text-xs text-gray-400 sm:ml-auto pl-5 sm:pl-0">10 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}