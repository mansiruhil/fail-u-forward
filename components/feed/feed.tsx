'use client';

import React from 'react';
import { CreatePost } from './createpost';

const placeholderPosts = [
  {
    id: 1,
    user: "Anonymous",
    content: "Failed my first startup pitch. Learned to prepare better next time.",
    date: "2025-08-01",
  },
  {
    id: 2,
    user: "UserB",
    content: "Got rejected from 10 jobs in a row. Persistence is key!",
    date: "2025-07-28",
  },
  {
    id: 3,
    user: "UserC",
    content: "Launched a product nobody used. Now I talk to users before building.",
    date: "2025-07-20",
  },
];

export function Feed() {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <CreatePost />
      <div className="space-y-4 mt-6">
        {placeholderPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-card p-4 rounded shadow">
            <div className="font-semibold">{post.user}</div>
            <div className="text-gray-700 dark:text-gray-300">{post.content}</div>
            <div className="text-xs text-gray-400 mt-2">{post.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}