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
        "inline-flex items-center justify-center whitespace-nowrap rounded-[2px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A263A] disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "bg-[#7A263A] text-white shadow-[0_8px_22px_rgba(122,38,58,.20)] hover:bg-[#641D2F] hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-[#1F3044] text-white shadow-[0_8px_22px_rgba(24,37,53,.20)] hover:bg-[#182535] hover:-translate-y-0.5",
        variant === "ghost" &&
          "text-[#70685E] hover:bg-[#CFC2AE] hover:text-[#1F3044]",
        size === "sm" && "h-9 px-4 text-sm",
        size === "default" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        className
      )}
      {...props}
    />
  );
}
