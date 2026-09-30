"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"secondary"|"ghost"; size?: "default"|"sm"|"lg" };
export function Button({className,variant="default",size="default",...props}:ButtonProps){
 return <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 disabled:pointer-events-none disabled:opacity-50",variant==="default"&&"bg-lime-300 text-black hover:bg-lime-200 hover:shadow-[0_0_30px_rgba(217,255,99,0.18)]",variant==="secondary"&&"bg-white/[0.07] text-white ring-1 ring-white/10 hover:bg-white/[0.11]",variant==="ghost"&&"text-white/65 hover:bg-white/[0.06] hover:text-white",size==="sm"&&"h-9 px-4 text-sm",size==="default"&&"h-11 px-5 text-sm",size==="lg"&&"h-13 px-7 text-base",className)} {...props}/>;
}