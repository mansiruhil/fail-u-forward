import React from "react";
import Link from "next/link";
import { BookmarkX, BookOpenText, TrendingUp } from "lucide-react";

const TRENDING_TOPICS = [
  { id: 1, title: "Startup Fails Stories", count: "1,234", icon: <TrendingUp className="w-5 h-5"/>},
  { id: 2, title: "Interview Rejections", count: "956", icon: <BookmarkX className="w-5 h-5"/> },
  { id: 3, title: "Project U-Turns", count: "847", icon: <BookOpenText className="w-5 h-5"/> },
];

const FAILURE_CATEGORIES = [
  { id: 1, title: "Tech Interviews", count: 12},
  { id: 2, title: "Pitch Meetings", count: 33},
  { id: 3, title: "Product Launches", count: 7},
  { id: 4, title: "Startup Failures", count: 21},
  { id: 5, title: "Funding Rejections", count: 8},
  { id: 6, title: "Team Conflicts", count: 41},
  { id: 7, title: "Marketing Missteps", count: 20}
]

export function RightSidebar() {
  return (
    <div className="hidden w-[16%] absolute right-0 top-16 h-full bg-background border-l border-border p-4 overflow-y-auto transition-colors md:block">
      <div className="mb-6">
        <h3 className="font-semibold text-foreground mb-4">Trending Failures</h3>
        <div className="space-y-3">
          {TRENDING_TOPICS.map((topic) => (
            <Link
              href={`/topic/${topic.id}`}
              key={topic.id}
              className="block p-3 border border-border bg-card rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex gap-1">
              {topic.icon}
              <p className="text-sm font-medium text-foreground">{topic.title}</p>
              </div>
              <p className="text-xs text-muted-foreground">{topic.count} people sharing</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">People Also Failed At</h3>
        <div className="flex gap-2 flex-wrap">
          {FAILURE_CATEGORIES.map((category) => (
            <Link
              href={`/technews`}
              key={category.id}
              className="relative p-2 bg-background text-foreground border border-gray-400 hover:border-black  rounded-lg transition-all duration-100"
            >
              <span className="text-sm text-foreground">{category.title}</span>
              <span className="absolute -top-2 -right-1 rounded-full text-white text-xs bg-neutral-800 flex justify-center items-center w-5 h-5 z-10">{category.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
