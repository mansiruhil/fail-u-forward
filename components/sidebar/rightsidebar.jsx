import React from "react";
import Link from "next/link";
import { ArrowRight, BookmarkX, BookOpenText, TrendingUp } from "lucide-react";

const TRENDING_TOPICS = [
  { id: 1, title: "Startup Fails Stories", icon: <TrendingUp className="w-5 h-5" /> },
  { id: 2, title: "Interview Rejections", icon: <BookmarkX className="w-5 h-5" /> },
  { id: 3, title: "Project U-Turns", icon: <BookOpenText className="w-5 h-5" /> },
];

const FAILURE_CATEGORIES = [
  { id: 1, title: "Tech Interviews" },
  { id: 2, title: "Pitch Meetings" },
  { id: 3, title: "Product Launches" },
  { id: 4, title: "Startup Failures" },
  { id: 5, title: "Funding Rejections" },
  { id: 6, title: "Team Conflicts" },
  { id: 7, title: "Marketing Missteps" }
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
              className="group block p-3 border border-border bg-card rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  {topic.icon}
                  <p className="text-sm font-medium text-foreground">{topic.title}</p>
                </div>

                <ArrowRight
                  className="w-5 h-5 transform transition-transform duration-600 group-hover:-rotate-25 "
                />
              </div>
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
