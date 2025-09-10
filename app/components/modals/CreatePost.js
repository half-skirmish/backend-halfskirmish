"use client";

import { useState, useEffect } from "react";
import { 
  X,
  Bold,
  Italic,
  Link,
  Image,
  Eye,
  EyeOff,
  Save,
  List,
  Loader2
} from "lucide-react";

const CreatePostModal = ({ isOpen, onClose, onSave, editingBlog }) => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
    keywords: '',
    coverImageUrl: '',
    status: 'draft'
  });
  
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Effect to handle editing mode initialization
  useEffect(() => {
    if (editingBlog) {
      setIsEditMode(true);
      setPostData({
        title: editingBlog.title || '',
        content: editingBlog.content || '',
        tags: editingBlog.tags ? editingBlog.tags.join(', ') : '',
        keywords: '', // Keywords might not be in the blog object
        coverImageUrl: editingBlog.coverImageUrl || '',
        status: 'published' // Assuming existing blogs are published
      });
    } else {
      setIsEditMode(false);
      setPostData({
        title: '',
        content: '',
        tags: '',
        keywords: '',
        coverImageUrl: '',
        status: 'draft'
      });
    }
  }, [editingBlog]);

  const handleInputChange = (field, value) => {
    setPostData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file,
          dataUrl: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageIntoContent = () => {
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let imageMarkdown = '';
    if (uploadedImage) {
      // For uploaded images, use the data URL temporarily
      // In a real app, you'd upload to a server and get a URL
      imageMarkdown = `![${imageAlt || uploadedImage.name}](${uploadedImage.dataUrl})`;
    } else if (imageUrl) {
      imageMarkdown = `![${imageAlt || 'Image'}](${imageUrl})`;
    }

    if (imageMarkdown) {
      const newContent = postData.content.substring(0, start) + 
                        '\n\n' + imageMarkdown + '\n\n' + 
                        postData.content.substring(end);
      handleInputChange('content', newContent);
      
      // Close modal and reset
      setShowImageModal(false);
      setImageUrl('');
      setImageAlt('');
      setUploadedImage(null);
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + imageMarkdown.length + 4; // +4 for the newlines
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postData.content.substring(start, end);
    let replacement = '';

    switch (format) {
      case 'bold':
        replacement = `**${selectedText || 'Bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'Italic text'}*`;
        break;
      case 'h1':
        replacement = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'h2':
        replacement = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'h3':
        replacement = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'h4':
        replacement = `#### ${selectedText || 'Heading 4'}`;
        break;
      case 'h5':
        replacement = `##### ${selectedText || 'Heading 5'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link text'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || 'Alt text'}](https://example.com/image.jpg)`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item'}\n- Item 2\n- Item 3`;
        break;
      default:
        replacement = selectedText;
    }

    const newContent = postData.content.substring(0, start) + replacement + postData.content.substring(end);
    handleInputChange('content', newContent);
    
    // Focus back to textarea after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const handleSave = async () => {
    // Validation
    if (!postData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!postData.content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create/edit a post');
        setIsLoading(false);
        return;
      }

      // Prepare the payload to match your backend expectations
      const payload = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        coverImageUrl: postData.coverImageUrl.trim(),
        tags: postData.tags.trim() ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      let response;
      let endpoint;

      if (isEditMode) {
        // Edit existing blog
        endpoint = `${API_BASE_URL}/edit-blog/${editingBlog._id}`;
        response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new blog
        endpoint = `${API_BASE_URL}/add-blog`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} blog post`);
      }

      if (data.error) {
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} blog post`);
      }

      // Success - call the onSave callback with the created/updated blog data
      if (onSave) {
        onSave(data.blog);
      }

      // Reset form and close modal
      setPostData({ 
        title: '', 
        content: '', 
        tags: '', 
        keywords: '', 
        coverImageUrl: '', 
        status: 'draft' 
      });
      setShowPreview(true);
      setIsEditMode(false);
      onClose();

      // Optional: Show success message
      console.log(`Blog post ${isEditMode ? 'updated' : 'created'} successfully:`, data.blog);

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} blog post:`, error);
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} blog post. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while saving
    
    onClose();
    setPostData({ 
      title: '', 
      content: '', 
      tags: '', 
      keywords: '', 
      coverImageUrl: '', 
      status: 'draft' 
    });
    setShowPreview(true);
    setError('');
    setIsEditMode(false);
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    setUploadedImage(null);
  };

  const renderMarkdown = (text) => {
    return text
      // Process images first to avoid conflicts with other replacements
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2 block" />')
      // Then process links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 hover:underline">$1</a>')
      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headings
      .replace(/^##### (.*$)/gm, '<h5 class="text-sm font-bold mb-2 mt-4">$1</h5>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mb-2 mt-4">$1</h4>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc pl-4 mb-4">$1</ul>')
      // Paragraphs and line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
              showPreview 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={showPreview ? "Hide Preview" : "Show Preview"}
            disabled={isLoading}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="text-sm font-medium">
              {showPreview ? "Hide Preview" : "Show Preview"}
            </span>
          </button>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          showPreview ? 'w-[60%]' : 'w-full'
        }`}>
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            {/* Post Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={postData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your post title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={isLoading}
              />
            </div>

            {/* Cover Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                value={postData.coverImageUrl}
                onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Formatting Toolbar */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    onClick={() => insertFormatting('bold')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Bold"
                    disabled={isLoading}
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    onClick={() => insertFormatting('italic')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Italic"
                    disabled={isLoading}
                  >
                    <Italic size={18} />
                  </button>
                </div>

                {/* Headings */}
                <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => insertFormatting(`h${level}`)}
                      className="px-2 py-1 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                      title={`Heading ${level}`}
                      disabled={isLoading}
                    >
                      H{level}
                    </button>
                  ))}
                </div>

                {/* Links and Media */}
                <div className="flex gap-1">
                  <button
                    onClick={() => insertFormatting('link')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insert Link"
                    disabled={isLoading}
                  >
                    <Link size={18} />
                  </button>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insert Image"
                    disabled={isLoading}
                  >
                    <Image size={18} />
                  </button>
                  <button
                    onClick={() => insertFormatting('list')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insert List"
                    disabled={isLoading}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="flex-1 flex flex-col mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="post-content"
                value={postData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your post content here... Use the toolbar above for formatting."
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm min-h-0"
                disabled={isLoading}
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={postData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Next.js, React, Web Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={postData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={postData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isLoading}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {isEditMode ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {isEditMode ? 'Update Post' : 'Save Post'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="w-[40%] bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
                {/* Preview Cover Image */}
                {postData.coverImageUrl && (
                  <div className="mb-6">
                    <img
                      src={postData.coverImageUrl}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Preview Title */}
                {postData.title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                    {postData.title}
                  </h1>
                )}
                
                {/* Preview Content */}
                <div className="prose max-w-none">
                  {postData.content ? (
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: `<p class="mb-4">${renderMarkdown(postData.content)}</p>`
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">Start typing to see your content preview...</p>
                  )}
                </div>

                {/* Preview Metadata */}
                {(postData.tags || postData.keywords) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {postData.tags && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {postData.tags.split(',').map((tag, index) => (
                            tag.trim() && (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag.trim()}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {postData.keywords && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {postData.keywords.split(',').map((keyword, index) => (
                            keyword.trim() && (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {keyword.trim()}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Insertion Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Insert Image</h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                  setImageAlt('');
                  setUploadedImage(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Upload Image Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Image size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload an image
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>

                {uploadedImage && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={uploadedImage.dataUrl}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {uploadedImage.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-sm text-gray-500 bg-white">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Image URL Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Preview */}
              {(imageUrl || uploadedImage) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <img
                      src={uploadedImage ? uploadedImage.dataUrl : imageUrl}
                      alt={imageAlt || 'Preview'}
                      className="max-w-full h-auto max-h-40 rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-sm text-red-500 p-4 text-center">
                      Failed to load image. Please check the URL.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                  setImageAlt('');
                  setUploadedImage(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertImageIntoContent}
                disabled={!imageUrl && !uploadedImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;