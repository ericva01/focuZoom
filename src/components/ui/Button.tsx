"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "active";
export type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon-md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#FF6B2C] hover:bg-[#E85A1F] text-white border-[#FF7A3D]/50 shadow-sm shadow-[#FF6B2C]/25 active:bg-[#E85A1F]",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 border-slate-300 shadow-xs active:bg-slate-300 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-slate-100 dark:hover:text-white dark:border-white/15 dark:shadow-glass-sm dark:active:bg-white/[0.18]",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-200 active:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] dark:active:bg-white/[0.12]",
  danger:
    "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 active:bg-rose-200 dark:bg-rose-600/30 dark:hover:bg-rose-600/50 dark:text-rose-200 dark:hover:text-white dark:border-rose-500/40 dark:shadow-glass-sm dark:active:bg-rose-600/60",
  active:
    "bg-[#FFF1E8] text-[#FF6B2C] border-[#FF6B2C]/40 shadow-xs hover:bg-[#FFE6D7] font-semibold dark:bg-[#FF6B2C]/20 dark:text-[#FF8A4C] dark:border-[#FF6B2C]/40 dark:shadow-glass-sm dark:hover:bg-[#FF6B2C]/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9.5 px-4 text-xs font-medium gap-2 rounded-xl",
  lg: "h-11 px-5 text-sm font-semibold gap-2.5 rounded-xl",
  "icon-sm": "w-8 h-8 rounded-lg p-0 flex items-center justify-center",
  "icon-md": "w-9.5 h-9.5 rounded-xl p-0 flex items-center justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "secondary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`
          relative inline-flex items-center justify-center select-none font-medium
          border backdrop-blur-md
          transition-all duration-200 ease-out
          active:scale-[0.98]
          disabled:opacity-45 disabled:pointer-events-none disabled:active:scale-100
          overflow-hidden
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {/* Subtle top inner edge highlight for realistic glass specular shine */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
        />

        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}

        {children && <span className="truncate">{children}</span>}

        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
