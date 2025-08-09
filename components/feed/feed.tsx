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
    <main className="max-w-2xl mx-auto pt-4" role="main">
      <h1 className="sr-only">Failure Stories Feed</h1>
      
      {/* Post creation box */}
      <section aria-labelledby="create-post-heading">
        <h2 id="create-post-heading" className="sr-only">Create a new post</h2>
        <CreatePost onAddPost={handleAddPost} />
      </section>
      
      {/* Feed list below */}
      <section aria-labelledby="posts-heading" className="space-y-4 mt-6">
        <h2 id="posts-heading" className="sr-only">Recent failure stories</h2>
        
        {loading && (
          <div role="status" aria-live="polite" className="text-center p-4">
            <span className="sr-only">Loading posts...</span>
            <div aria-hidden="true">Loading posts...</div>
          </div>
        )}
        
        {error && (
          <div role="alert" className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {!loading && posts.length === 0 && (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            <p>No posts yet. Be the first to share your failure story!</p>
          </div>
        )}
        
        {posts.length > 0 && (
          <ul className="space-y-4" role="list">
            {posts.map((post) => (
              <li key={post.id}>
                <article 
                  className="bg-white dark:bg-card p-4 rounded shadow focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`post-author-${post.id}`}
                  aria-describedby={`post-content-${post.id} post-date-${post.id}`}
                >
                  <header>
                    <h3 id={`post-author-${post.id}`} className="font-semibold text-lg">
                      {post.user}
                    </h3>
                    <time 
                      id={`post-date-${post.id}`}
                      className="text-xs text-gray-400 mt-1 block"
                      dateTime={post.date}
                    >
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </header>
                  <div 
                    id={`post-content-${post.id}`}
                    className="text-gray-700 dark:text-gray-300 mt-2"
                  >
                    {post.content}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Related Posts Section */}
      <aside aria-labelledby="related-posts-heading" className="mt-10">
        <h2 id="related-posts-heading" className="text-lg font-bold mb-4">
          Related Posts
        </h2>
        <ul className="space-y-4" role="list">
          {relatedPosts.map((post) => (
            <li key={post.id}>
              <article 
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
                tabIndex={0}
                role="article"
                aria-labelledby={`related-post-author-${post.id}`}
                aria-describedby={`related-post-content-${post.id} related-post-date-${post.id}`}
              >
                <header>
                  <h3 id={`related-post-author-${post.id}`} className="font-semibold">
                    {post.user}
                  </h3>
                  <time 
                    id={`related-post-date-${post.id}`}
                    className="text-xs text-gray-400 mt-1 block"
                    dateTime={post.date}
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </header>
                <div 
                  id={`related-post-content-${post.id}`}
                  className="text-gray-700 dark:text-gray-300 mt-2"
                >
                  {post.content}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}