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

// Primary is ink on light and light on ink, so orange stays reserved for keyframes and the playhead.
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 hover:bg-slate-950 text-white border-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 dark:border-slate-100",
  secondary:
    "bg-transparent hover:bg-slate-200 text-slate-900 border-slate-400 dark:hover:bg-slate-800 dark:text-slate-100 dark:border-slate-600",
  ghost:
    "bg-transparent hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800",
  danger:
    "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-600/30 dark:hover:bg-rose-600/50 dark:text-rose-200 dark:hover:text-white dark:border-rose-500/40",
  active:
    "bg-slate-200 text-slate-900 border-slate-900 font-semibold dark:bg-slate-800 dark:text-white dark:border-slate-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-9.5 px-4 text-[13px] font-medium gap-2 rounded-xl",
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
          border transition-colors duration-150
          disabled:opacity-45 disabled:pointer-events-none
          overflow-hidden
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
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
