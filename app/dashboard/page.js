'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import {
  LogOut,
  Plus,
  FilePenLine,
  Trash2,
  UserCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      fetchBlogs(token);
    }
  }, [router]);

  // Function to fetch all blogs
  const fetchBlogs = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-all-blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.error) throw new Error(data.message || 'Failed to fetch blogs');
      
      setBlogs(data.blogs);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a blog
  const handleDelete = async (blogId) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || 'Failed to delete the post');
      }

      // Update the UI by removing the deleted blog from the state
      setBlogs(currentBlogs => currentBlogs.filter(blog => blog._id !== blogId));

    } catch (err) {
      alert(err.message); // Show error to the user
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace("/login");
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-slate-400 mt-1">Create, edit, and manage your blog posts.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <UserCircle2 size={32} className="text-slate-400" />
              <span className="font-medium text-slate-200">Admin User</span>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              <Plus size={20}/>
              <span>Create New Post</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="bg-slate-800/50 p-4 rounded-lg shadow-lg">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-400">Title</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Author</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Date Published</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-slate-400">Loading posts...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-red-400">Error: {error}</td>
                </tr>
              )}
              {!loading && !error && blogs.map((post) => (
                <tr key={post._id} className="border-b border-slate-800 hover:bg-slate-700/50">
                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4 text-slate-300">{post.author.name}</td>
                  <td className="p-4 text-slate-400">{formatDate(post.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex space-x-4">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="Edit Post">
                        <FilePenLine size={20} />
                      </button>
                      {/* Attach handleDelete to the onClick event */}
                      <button 
                        onClick={() => handleDelete(post._id)}
                        className="text-red-500 hover:text-red-400 transition-colors" 
                        aria-label="Delete Post"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}