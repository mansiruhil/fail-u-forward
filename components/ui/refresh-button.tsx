"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "./button";

export function RefreshButton() {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      <RefreshCw className="mr-2 h-4 w-4" />
      <span>Refresh</span>
    </Button>
  );
}
