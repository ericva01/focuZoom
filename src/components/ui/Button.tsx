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
    "bg-sky-500/20 hover:bg-sky-500/30 text-sky-100 hover:text-white border-sky-400/35 hover:border-sky-400/60 shadow-glass-sm shadow-sky-500/10 active:bg-sky-500/40",
  secondary:
    "bg-white/[0.06] hover:bg-white/[0.12] text-slate-100 hover:text-white border-white/12 hover:border-white/25 shadow-glass-sm active:bg-white/[0.16]",
  ghost:
    "bg-transparent hover:bg-white/[0.08] text-slate-300 hover:text-white border-transparent hover:border-white/10 active:bg-white/[0.12]",
  danger:
    "bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 hover:text-white border-rose-400/35 hover:border-rose-400/60 shadow-glass-sm shadow-rose-500/10 active:bg-rose-500/40",
  active:
    "bg-white/[0.16] text-white border-white/30 shadow-glass-sm hover:bg-white/[0.20]",
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
