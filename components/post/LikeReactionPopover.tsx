"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ReactionData {
  count: number;
  users: string[];
}

interface LikeReactionPopoverProps {
  reactions: Record<string, ReactionData>;
  currentUserId: string | null;
  onReact: (reactionType: string) => void;
}

const REACTION_CONFIG = {
  hit_hard: { emoji: "😭", label: "This hit me hard", color: "text-blue-600" },
  sending_love: { emoji: "❤️", label: "Sending love", color: "text-red-500" },
  deep_insight: { emoji: "💡", label: "Deep insight", color: "text-yellow-500" },
  thank_you: { emoji: "🙏", label: "Thank you for sharing", color: "text-purple-600" },
  been_there: { emoji: "🔁", label: "Been there", color: "text-green-600" },
};

export function LikeReactionPopover({
  reactions,
  currentUserId,
  onReact,
}: LikeReactionPopoverProps) {
  // Aggregate count for all reactions
  const aggregateCount = Object.values(reactions).reduce(
    (sum, r) => sum + (r?.count || 0),
    0
  );

  // Determine current user's reaction (if any)
  const currentUserReaction = React.useMemo(() => {
    if (!currentUserId) return null;
    return Object.entries(reactions).find(([_, r]) =>
      r.users.includes(currentUserId)
    )?.[0];
  }, [reactions, currentUserId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 min-w-[88px] justify-center"
          aria-label="Reactions"
          onClick={(e) => {
      e.stopPropagation();
    }}
        >
          <span>
            {aggregateCount} {aggregateCount === 1 ? "Like" : "Likes"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="flex gap-3 p-2 bg-white border border-gray-200 rounded-md shadow-md"
        sideOffset={8}
      >
        {Object.entries(REACTION_CONFIG).map(([key, config]) => {
          const reactionCount = reactions[key]?.count || 0;
          const isSelected = currentUserReaction === key;

          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className={`flex flex-col items-center justify-center w-12 h-12 p-0 rounded-full ${
                isSelected ? config.color : "text-gray-600"
              }`}
              onClick={(e) => {
        e.stopPropagation();         
        onReact(key);
      }}
              aria-pressed={isSelected}
              aria-label={`${config.label}, ${reactionCount} ${
                reactionCount === 1 ? "person" : "people"
              } reacted`}
              type="button"
            >
              <span className="text-2xl">{config.emoji}</span>
              <span className="text-[10px] font-semibold mt-0.5">{reactionCount}</span>
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
