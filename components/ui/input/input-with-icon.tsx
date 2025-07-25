import * as React from "react";
import { cn } from "@/lib/utils";
import { icons, IconKey } from "./icons";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconKey;
}

export const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, icon = "none", ...props }, ref) => {
    return (
      <div
        className={cn(
          "group flex items-center gap-1 h-10 w-full rounded-md border border-input bg-background p-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "transition-colors"
        )}
      >
        {icon !== "none" && (
          <div className="w-5 h-5 flex items-center pointer-events-none text-muted-foreground">
            {icons[icon]}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full bg-transparent outline-none text-sm text-foreground",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";
