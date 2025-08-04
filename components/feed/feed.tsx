'use client';

import React from 'react';
import { CreatePost } from './createpost';
// import { FailurePost } from '../posts/Failurepost';

const SAMPLE_POSTS = [
  {
    id: 1,
    author: {
      name: "Jane Cooper",
      title: "Failed Startup Founder",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    content: "Just shut down my startup after 2 years. Key learning: Market validation before building is crucial. We built something nobody wanted. Here's to failing forward! 🚀💫",
    timestamp: "2h ago",
    likes: 234,
    comments: 56,
  },
  {
    id: 2,
    author: {
      name: "Alex Morgan",
      title: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
    content: "Failed my dream company's tech interview today. Froze on a simple algorithm question. Time to get back to practicing and come back stronger! 💪",
    timestamp: "4h ago",
    likes: 156,
    comments: 23,
  },
];

export function Feed() {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <CreatePost />
      {/* {SAMPLE_POSTS.map((post) => (
        <FailurePost key={post.id} {...post} />

      ))} */}
    </div>
  );
}