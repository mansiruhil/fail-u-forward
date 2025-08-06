"use client";

import React from "react";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-md text-white font-medium bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-500 hover:opacity-90 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default GradientButton;
