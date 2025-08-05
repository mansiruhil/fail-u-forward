'use client';

import React, { useEffect, useState } from 'react';
import { CreatePost } from './createpost';

// Type for a post
interface Post {
  id: string | number;
  user: string;
  content: string;
  date: string;
}

// Static related posts (other people's failures)
const relatedPosts: Post[] = [
  {
    id: 'r1',
    user: 'Jane Doe',
    content: 'My startup failed after 2 years. Learned to validate ideas early!',
    date: '2025-07-15',
  },
  {
    id: 'r2',
    user: 'John Smith',
    content: 'Got rejected from Google 3 times. Persistence pays off!',
    date: '2025-06-30',
  },
  {
    id: 'r3',
    user: 'Alex Lee',
    content: 'Lost funding for my app. Now I bootstrap everything.',
    date: '2025-06-10',
  },
];

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API (all users)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace '/api/post' with your actual API endpoint
        const res = await fetch('/api/post');
        const data = await res.json();
        if (res.ok && data.posts) {
          setPosts(data.posts);
        } else {
          setError(data.error || 'Failed to fetch posts');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handler for adding a new post (local only, for demo)
  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    // In production, POST to API and refetch posts
  };

  return (
    <div className="max-w-2xl mx-auto pt-4">
      {/* Post creation box */}
      <CreatePost onAddPost={handleAddPost} />
      {/* Feed list below */}
      <div className="space-y-4 mt-6">
        {loading && <div>Loading posts...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && posts.length === 0 && <div>No posts yet. Be the first to share!</div>}
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-card p-4 rounded shadow">
            <div className="font-semibold">{post.user}</div>
            <div className="text-gray-700 dark:text-gray-300">{post.content}</div>
            <div className="text-xs text-gray-400 mt-2">{post.date}</div>
          </div>
        ))}
      </div>

      {/* Related Posts Section */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">Related Posts</h3>
        <div className="space-y-4">
          {relatedPosts.map((post) => (
            <div key={post.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-800">
              <div className="font-semibold">{post.user}</div>
              <div className="text-gray-700 dark:text-gray-300">{post.content}</div>
              <div className="text-xs text-gray-400 mt-2">{post.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}