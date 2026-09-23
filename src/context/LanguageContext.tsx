"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale, Translations, translations } from "@/lib/i18n/translations";
import { isDesktopApp } from "@/lib/desktopBridge";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  localePath: (path: string) => string;
  t: Translations;
  isKhmer: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "fucuflow_language";

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract locale from URL if present (/en/... or /kh/... or /km/...)
  const getLocaleFromPath = (path: string): Locale | null => {
    if (!path) return null;
    const segments = path.split("/").filter(Boolean);
    const first = segments[0]?.toLowerCase();
    if (first === "en") return "en";
    if (first === "kh") return "kh";
    if (first === "km") return "km";
    return null;
  };

  const pathLocale = getLocaleFromPath(pathname);

  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale) return initialLocale;
    if (pathLocale) return pathLocale;
    return "kh";
  });

  // Sync state if URL path changes
  useEffect(() => {
    if (pathLocale && pathLocale !== locale) {
      setLocaleState(pathLocale);
      document.documentElement.lang = pathLocale === "en" ? "en" : "km";
      try {
        localStorage.setItem(STORAGE_KEY, pathLocale);
      } catch {}
    }
  }, [pathLocale]);

  // Initial load from storage if not determined by path, and redirect un-prefixed browser visits
  useEffect(() => {
    if (!pathLocale) {
      let preferred: Locale = "kh";
      try {
        const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (savedLocale === "en" || savedLocale === "kh" || savedLocale === "km") {
          preferred = savedLocale === "km" ? "kh" : savedLocale;
          setLocaleState(preferred);
          document.documentElement.lang = preferred === "en" ? "en" : "km";
        } else {
          setLocaleState("kh");
          document.documentElement.lang = "km";
        }
      } catch {}

      if (typeof window !== "undefined" && !isDesktopApp()) {
        const isDesktopQuery =
          window.location.search.includes("desktop=true") ||
          window.location.search.includes("view=desktop");
        if (!isDesktopQuery) {
          const prefix = preferred === "en" ? "/en" : "/kh";
          const cleanPath = pathname || "/";
          const target =
            cleanPath === "/"
              ? prefix
              : `${prefix}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
          router.replace(target);
        }
      }
    }
  }, [pathname, pathLocale, router]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale === "en" ? "en" : "km";
    } catch {}
  };

  const toggleLocale = () => {
    const nextLocale: Locale = locale === "en" ? "kh" : "en";
    setLocale(nextLocale);
  };

  const localePath = (rawPath: string): string => {
    const clean = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    // Strip any existing locale prefix
    const stripped = clean.replace(/^\/(en|kh|km)(\/|$)/, "/");
    const activePrefix = locale === "en" ? "/en" : "/kh";
    if (stripped === "/" || stripped === "") {
      return activePrefix;
    }
    return `${activePrefix}${stripped.startsWith("/") ? stripped : `/${stripped}`}`;
  };

  const activeKey: Locale = locale === "en" ? "en" : "kh";
  const t = translations[activeKey] || translations.kh;
  const isKhmer = locale !== "en";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, localePath, t, isKhmer }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
