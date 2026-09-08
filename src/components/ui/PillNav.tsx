"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PillNavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PillNavProps {
  items: PillNavItem[];
  activeHref: string;
  className?: string;
  onItemClick?: (href: string) => void;
}

/**
 * React Bits signature Pill Nav component.
 * Features a single unified sliding spring-physics pill indicator that
 * glides seamlessly across tabs on hover and smoothly locks/snaps to the
 * active page/section, styled in deep dark green (#06402B) with glass specular highlights.
 */
export function PillNav({
  items,
  activeHref,
  className,
  onItemClick,
}: PillNavProps) {
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);

  // The pill indicator glides to the hovered item, or rests at the active item when not hovered
  const displayedHref = hoveredHref ?? activeHref;

  return (
    <nav
      role="tablist"
      aria-label="Main Navigation"
      onMouseLeave={() => setHoveredHref(null)}
      className={cn(
        "relative flex items-center gap-1 p-1 rounded-full",
        "bg-black/60 border border-white/[0.08] backdrop-blur-xl shadow-glass-inner",
        className
      )}
    >
      {items.map((item) => {
        const isCurrentActive = activeHref === item.href;
        const isPillHere = displayedHref === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            role="tab"
            aria-selected={isCurrentActive}
            onMouseEnter={() => setHoveredHref(item.href)}
            onClick={() => onItemClick?.(item.href)}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-xs font-medium",
              "flex items-center gap-1.5 transition-colors duration-200 select-none z-10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
              isPillHere
                ? "text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {/* React Bits Unified Sliding Spring Pill */}
            {isPillHere && (
              <motion.span
                layoutId="pill-nav-slider"
                className={cn(
                  "absolute inset-0 rounded-full -z-10 transition-colors duration-200",
                  isCurrentActive
                    ? "bg-[#06402B] border border-emerald-500/40 shadow-[0_2px_14px_rgba(6,64,43,0.7),inset_0_1px_1px_rgba(255,255,255,0.22)]"
                    : "bg-[#06402B]/80 border border-emerald-400/35 shadow-[0_2px_10px_rgba(6,64,43,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)]"
                )}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 28,
                  mass: 0.7,
                }}
              >
                {/* Specular glass highlight on the pill top edge */}
                <span className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent pointer-events-none" />
              </motion.span>
            )}

            {/* Optional Tab Icon */}
            {Icon && (
              <Icon
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isPillHere ? "text-emerald-300" : "text-slate-400"
                )}
              />
            )}

            {/* Tab Label */}
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
