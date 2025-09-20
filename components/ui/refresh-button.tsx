"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "secondary";
  showText?: boolean;
}

export function RefreshButton({
  onRefresh,
  className,
  size = "md",
  variant = "outline",
  showText = true,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2",
    md: "h-10 px-3",
    lg: "h-12 px-4",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant={variant}
      size={size}
      className={cn(
        "gap-2 transition-all duration-200",
        sizeClasses[size],
        className
      )}
      aria-label="Refresh data"
    >
      <RefreshCw
        className={cn(
          iconSizes[size],
          isRefreshing && "animate-spin",
          "transition-transform duration-200"
        )}
      />
      {showText && (
        <span className="hidden sm:inline">
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </span>
      )}
    </Button>
  );
}
