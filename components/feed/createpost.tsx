'use client';

import React, { useState } from 'react';
import { Image, Link, Send } from 'lucide-react';

export function CreatePost() {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // TODO: Implement post creation
    console.log('Creating post:', content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors">
      <textarea
        placeholder="Share your failure story..."
        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-3">
          <button type="button" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
            <Image className="h-5 w-5 mr-1" />
            <span className="text-sm">Photo</span>
          </button>
          <button type="button" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
            <Link className="h-5 w-5 mr-1" />
            <span className="text-sm">Link</span>
          </button>
        </div>
        
        <button 
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!content.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Share Failure
        </button>
      </div>
    </form>
  );
}