"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { isDesktopApp } from "@/lib/desktopBridge";
import { ShieldAlert } from "lucide-react";

export function AppRefreshGuard() {
  const { isKhmer } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerRefreshBlockedToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2600);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only apply refresh prevention in the Desktop App (Tauri / Electron / desktop view)
    // The public website is completely free to refresh normally.
    const isDesktop = isDesktopApp();
    if (!isDesktop) {
      return;
    }

    document.documentElement.classList.add("is-desktop-app");
    document.body.classList.add("is-desktop-app");

    // 1. Intercept all reload and navigation shortcut keys at the CAPTURE phase
    const handleKeyDownCapture = (e: KeyboardEvent) => {
      const key = e.key;
      const code = e.code;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // Detect Reload Shortcuts:
      // - F5, Ctrl+F5, Shift+F5, Ctrl+Shift+F5
      // - Ctrl+R, Cmd+R, Ctrl+Shift+R, Cmd+Shift+R
      const isF5 = key === "F5" || code === "F5" || e.keyCode === 116;
      const isRReload = ctrlOrMeta && (key === "r" || key === "R" || code === "KeyR");

      if (isF5 || isRReload) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        triggerRefreshBlockedToast();
        return false;
      }

      // Detect Accidental Browser Navigation Shortcuts:
      // - Alt + Left / Alt + Right (Browser History Back / Forward)
      // - Cmd + [ / Cmd + ] (Mac History Navigation)
      const isAltNav = e.altKey && (key === "ArrowLeft" || key === "ArrowRight");
      const isCmdBracketNav = ctrlOrMeta && (key === "[" || key === "]");
      if (isAltNav || isCmdBracketNav) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Detect Backspace when not typing in an editable field
      if (key === "Backspace" || code === "Backspace") {
        const target = e.target as HTMLElement | null;
        const isEditable =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable ||
          target?.getAttribute("contenteditable") === "true";

        if (!isEditable) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 2. Prevent accidental file drag-and-drop navigation (which navigates to file:// and reloads the app)
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      const isDropZone = target?.closest('[data-dropzone="true"], input[type="file"]');
      if (!isDropZone) {
        e.preventDefault();
      }
    };

    // 3. Block default context menu outside inputs/selection so user cannot right-click -> "Reload"
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable ||
        target?.getAttribute("contenteditable") === "true";
      const hasSelection = (window.getSelection()?.toString().length ?? 0) > 0;

      if (!isEditable && !hasSelection) {
        e.preventDefault();
      }
    };

    // 4. BeforeUnload confirmation: protect against any unexpected reload or window close in desktop app
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("keydown", handleKeyDownCapture, { capture: true });
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.documentElement.classList.remove("is-desktop-app");
      document.body.classList.remove("is-desktop-app");
      window.removeEventListener("keydown", handleKeyDownCapture, { capture: true });
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [triggerRefreshBlockedToast]);

  if (!showToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0D111A]/95 backdrop-blur-xl border border-amber-500/30 text-amber-300 shadow-[0_8px_32px_rgba(0,0,0,0.45)] text-xs sm:text-sm font-medium">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {isKhmer
            ? "ការ Refresh ត្រូវបានបិទនៅក្នុងកម្មវិធី Desktop ដើម្បីការពារកុំឱ្យបាត់បង់ការងារ និងវីដេអូរបស់អ្នក"
            : "Page refresh is disabled in the desktop app to protect your project and media."}
        </span>
      </div>
    </div>
  );
}
