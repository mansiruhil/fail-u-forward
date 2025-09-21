"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  showText?: boolean;
}

export function RefreshButton({
  onRefresh,
  className,
  size = "default",
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
    default: "h-10 px-3",
    sm: "h-8 px-2",
    lg: "h-12 px-4",
    icon: "h-10 w-10",
  };

  const iconSizes = {
    default: "h-4 w-4",
    sm: "h-3 w-3",
    lg: "h-5 w-5",
    icon: "h-4 w-4",
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
