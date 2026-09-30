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
        "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "bg-[#ff5a00] text-white shadow-[0_8px_22px_rgba(255,90,0,.18)] hover:bg-[#ed4f00] hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-[#30313a] text-white shadow-[0_8px_22px_rgba(48,49,58,.18)] hover:bg-[#26272f] hover:-translate-y-0.5",
        variant === "ghost" &&
          "text-[#55545a] hover:bg-[#e9e5de] hover:text-[#202126]",
        size === "sm" && "h-9 px-4 text-sm",
        size === "default" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        className
      )}
      {...props}
    />
  );
}
