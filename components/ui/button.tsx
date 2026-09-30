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
        "inline-flex items-center justify-center whitespace-nowrap rounded-[2px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A3038] disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "bg-[#9A3038] text-white shadow-[0_8px_22px_rgba(154,48,56,.20)] hover:bg-[#7F252D] hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-[#262522] text-white shadow-[0_8px_22px_rgba(27,26,24,.20)] hover:bg-[#1B1A18] hover:-translate-y-0.5",
        variant === "ghost" &&
          "text-[#665F56] hover:bg-[#C8BBA5] hover:text-[#262522]",
        size === "sm" && "h-9 px-4 text-sm",
        size === "default" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        className
      )}
      {...props}
    />
  );
}
