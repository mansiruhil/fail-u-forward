import React from "react";
import Link from "next/link";

const TRENDING_TOPICS = [
  { id: 1, title: "Startup Fails Stories", count: "1,234" },
  { id: 2, title: "Interview Rejections", count: "956" },
  { id: 3, title: "Project U-Turns", count: "847" },
];

const FAILURE_CATEGORIES = [
  { id: 1, title: "Tech Interviews" },
  { id: 2, title: "Pitch Meetings" },
  { id: 3, title: "Product Launches" },
];

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
              <p className="text-sm font-medium text-foreground">{topic.title}</p>
              <p className="text-xs text-muted-foreground">{topic.count} people sharing</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">People Also Failed At</h3>
        <div className="space-y-3">
          {FAILURE_CATEGORIES.map((category) => (
            <Link
              href={`/technews`}
              key={category.id}
              className="flex items-center p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              <span className="text-sm text-foreground">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
