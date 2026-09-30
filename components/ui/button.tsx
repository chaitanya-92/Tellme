"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c08552] disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "bg-[#c08552] text-white shadow-[0_8px_22px_rgba(192,133,82,.22)] hover:bg-[#a96f42] hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-[#4b2e2b] text-white shadow-[0_8px_22px_rgba(75,46,43,.20)] hover:bg-[#3b2421] hover:-translate-y-0.5",
        variant === "ghost" &&
          "text-[#6f4b3a] hover:bg-[#e0dfb1] hover:text-[#4b2e2b]",
        size === "sm" && "h-9 px-4 text-sm",
        size === "default" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        className
      )}
      {...props}
    />
  );
}
