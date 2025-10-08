"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "./button";

type RefreshButtonProps = {
  onRefresh?: () => Promise<void>; 
  size?: "sm" | "md" | "lg";
};

export function RefreshButton({ onRefresh, size = "md" }: RefreshButtonProps) {
  const handleClick = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={size === "sm" ? "p-2" : size === "md" ? "p-4" : "p-6"}
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      <span>Refresh</span>
    </Button>
  );
}
