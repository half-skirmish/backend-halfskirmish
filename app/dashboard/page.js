'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  Plus,
  FilePenLine,
  Trash2,
  UserCircle2,
  Search,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';
import CreatePostModal from '../components/modals/CreatePost';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // null for create, blog object for edit

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const initializeDashboard = async (authToken) => {
      setLoading(true);
      setError(null);
      try {
        const [userResponse, blogsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-user`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-all-blogs`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          })
        ]);

        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        if (!blogsResponse.ok) throw new Error('Failed to fetch blogs');

        const userData = await userResponse.json();
        const blogsData = await blogsResponse.json();

        if (userData.error) throw new Error(userData.message);
        if (blogsData.error) throw new Error(blogsData.message);

        setUser(userData.user);
        setBlogs(blogsData.blogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard(token);
  }, [router]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-blog/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.message || 'Failed to delete post');

      setBlogs(currentBlogs => currentBlogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = async (blogId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-blog/${blogId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.message || 'Failed to fetch blog');

      setEditingBlog(data.blog);
      setIsModalOpen(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreatePost = () => {
    setEditingBlog(null); // Reset editing blog for create mode
    setIsModalOpen(true);
  };

  const handleModalSave = (savedBlog) => {
    if (editingBlog) {
      // Update existing blog in the list
      setBlogs(currentBlogs => 
        currentBlogs.map(blog => 
          blog._id === savedBlog._id ? savedBlog : blog
        )
      );
    } else {
      // Add new blog to the list
      setBlogs(currentBlogs => [savedBlog, ...currentBlogs]);
    }
    setEditingBlog(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace("/login");
  };

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userBlogsCount = blogs.filter(blog => blog.author.id === user?.id).length;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Navigation Bar */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Side: Username */}
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20 shadow-sm">
              <UserCircle2 size={24} className="text-gray-500" />
              <span className="font-medium text-gray-700">{user?.name || 'Loading...'}</span>
            </div>

            {/* Right Side: Create Post + Logout */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCreatePost}
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex justify-center items-center space-x-2">
                  <Plus size={20} />
                  <span>Create Post</span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{blogs.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Your Posts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{userBlogsCount}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FilePenLine className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Posts This Month</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {blogs.filter(blog => {
                      const blogDate = new Date(blog.createdAt);
                      const currentDate = new Date();
                      return blogDate.getMonth() === currentDate.getMonth() && 
                             blogDate.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-start">
            <div className="relative max-w-md w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts or authors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="col-span-full text-center text-gray-500">Loading...</p>}
          {error && <p className="col-span-full text-center text-red-500">{error}</p>}
          {!loading && !error && filteredBlogs.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No posts found.</p>
          )}

          {!loading && !error && filteredBlogs.map((post, index) => (
            <div
              key={post._id}
              className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(post._id)}
                    className="p-1.5 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition"
                    title="Edit post"
                  >
                    <FilePenLine size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
              <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                <span>By {post.author.name}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create/Edit Post Modal */}
      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        editingBlog={editingBlog}
      />
    </div>
  );
}