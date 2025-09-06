"use client";

import { useState } from "react";
import { 
  X,
  Bold,
  Italic,
  Link,
  Image,
  Eye,
  EyeOff,
  Save,
  List
} from "lucide-react";

const CreatePostModal = ({ isOpen, onClose, onSave }) => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
    keywords: '',
    status: 'draft'
  });
  
  const [showPreview, setShowPreview] = useState(true);

  const handleInputChange = (field, value) => {
    setPostData(prev => ({ ...prev, [field]: value }));
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

  const handleSave = () => {
    onSave(postData);
    setPostData({ title: '', content: '', tags: '', keywords: '', status: 'draft' });
    setShowPreview(true);
  };

  const handleClose = () => {
    onClose();
    setPostData({ title: '', content: '', tags: '', keywords: '', status: 'draft' });
    setShowPreview(true);
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^##### (.*$)/gm, '<h5 class="text-sm font-bold mb-2 mt-4">$1</h5>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mb-2 mt-4">$1</h4>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc pl-4 mb-4">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
              showPreview 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={showPreview ? "Hide Preview" : "Show Preview"}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="text-sm font-medium">
              {showPreview ? "Hide Preview" : "Show Preview"}
            </span>
          </button>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>
      </div>

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
                Post Title
              </label>
              <input
                type="text"
                value={postData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your post title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    onClick={() => insertFormatting('italic')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Italic"
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
                  >
                    <Link size={18} />
                  </button>
                  <button
                    onClick={() => insertFormatting('image')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insert Image"
                  >
                    <Image size={18} />
                  </button>
                  <button
                    onClick={() => insertFormatting('list')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Insert List"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="flex-1 flex flex-col mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="post-content"
                value={postData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your post content here... Use the toolbar above for formatting."
                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm min-h-0"
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
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Save size={16} />
                  Save Post
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
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {postData.keywords && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {postData.keywords.split(',').map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {keyword.trim()}
                            </span>
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
    </div>
  );
};

export default CreatePostModal;