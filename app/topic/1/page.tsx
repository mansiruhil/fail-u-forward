'use client';

import { useState } from 'react';
import { FiPaperclip, FiSend, FiEyeOff, FiTrendingUp, FiUsers, FiBookmark } from 'react-icons/fi';
import { useTheme } from 'next-themes';

export default function StartupFailureStories() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [postContent, setPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedProof, setSelectedProof] = useState('');

  const trendingFailures = [
    { title: "Startup Fails Stories", count: "1,234 people sharing" },
    { title: "Interview Rejections", count: "956 people sharing" },
    { title: "Project U-Turns", count: "847 people sharing" }
  ];

  const commonFailures = [
    "Tech Interviews",
    "Pitch Meetings",
    "Product Launches"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      console.log('Post submitted:', {
        content: postContent,
        isAnonymous,
        proof: selectedProof
      });
      setPostContent('');
      setSelectedProof('');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            FailU Forward
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Learning from every mess.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* User Profile Section */}
            <div className={`p-6 rounded-xl mb-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h2 className="text-xl font-semibold mb-4">UserB</h2>
              <div className="flex space-x-4 mb-4">
                <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  Network
                </button>
                <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  Failed Jobs
                </button>
                <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  Learning
                </button>
              </div>
            </div>

            {/* Create Post Section */}
            <div className={`p-6 rounded-xl mb-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h3 className="text-lg font-semibold mb-4">Share your latest failure...</h3>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What went wrong? What did you learn?"
                  className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  rows={4}
                  required
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Add Proof</label>
                  <select
                    value={selectedProof}
                    onChange={(e) => setSelectedProof(e.target.value)}
                    className={`w-full p-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select proof type</option>
                    <option value="Rejection Letter">Rejection Letter</option>
                    <option value="Contest">Contest</option>
                    <option value="Other">Other Documentation</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`flex items-center px-3 py-2 rounded-lg ${isAnonymous ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                  >
                    <FiEyeOff className="mr-2" />
                    {isAnonymous ? 'Anonymous' : 'Public'}
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                  >
                    <FiSend className="mr-2" />
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Trending Failures */}
            <div className={`p-6 rounded-xl mb-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiTrendingUp className="mr-2" /> Trending Failures
              </h3>
              <div className="space-y-3">
                {trendingFailures.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="font-medium">{item.title}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Failures */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiUsers className="mr-2" /> People Also Failed At
              </h3>
              <ul className="space-y-2">
                {commonFailures.map((item, index) => (
                  <li key={index} className={`flex items-center p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <FiBookmark className={`mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}