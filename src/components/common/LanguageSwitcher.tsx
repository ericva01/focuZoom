"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Locale } from "@/lib/i18n/translations";

interface LanguageSwitcherProps {
  variant?: "navbar" | "mobile" | "footer";
  className?: string;
}

export function LanguageSwitcher({ variant = "navbar", className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const handleSwitch = (target: Locale) => {
    setLocale(target);
    const targetPrefix = target === "en" ? "/en" : "/kh";
    
    // Strip existing prefix if present
    const stripped = pathname.replace(/^\/(en|kh|km)(\/|$)/, "/");
    let nextUrl = "";
    if (stripped === "/" || stripped === "") {
      nextUrl = `${targetPrefix}/`;
    } else {
      const normalized = stripped.startsWith("/") ? stripped : `/${stripped}`;
      const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
      nextUrl = `${targetPrefix}${withSlash}`;
    }

    try {
      router.push(nextUrl);
    } catch {
      window.location.href = nextUrl;
    }
  };

  const isEn = locale === "en";
  const isKh = locale === "kh" || locale === "km";

  if (variant === "footer") {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] ${className}`}>
        <Globe size={13} className="text-[#667085] ml-1.5" />
        <button
          onClick={() => handleSwitch("en")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            isEn
              ? "bg-white text-[#111318] shadow-xs"
              : "text-[#667085] hover:text-[#111318]"
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => handleSwitch("kh")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            isKh
              ? "bg-[#FF6B2C] text-white shadow-xs"
              : "text-[#667085] hover:text-[#111318]"
          }`}
          title="ប្តូរទៅភាសាខ្មែរ"
        >
          ខ្មែរ
        </button>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#111318]">
          <Globe size={16} className="text-[#FF6B2C]" />
          <span>ភាសា / Language</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E5E7EB]">
          <button
            onClick={() => handleSwitch("kh")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              isKh
                ? "bg-[#FF6B2C] text-white shadow-xs"
                : "text-[#667085] hover:text-[#111318]"
            }`}
          >
            🇰🇭 ខ្មែរ
          </button>
          <button
            onClick={() => handleSwitch("en")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              isEn
                ? "bg-[#111318] text-white shadow-xs"
                : "text-[#667085] hover:text-[#111318]"
            }`}
          >
            🇺🇸 EN
          </button>
        </div>
      </div>
    );
  }

  // Navbar default: Icon-only button with dropdown menu
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Language / ភាសា"
          className={`p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8F9FB] text-[#667085] hover:text-[#111318] transition-colors inline-flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${className}`}
          title="Language / ភាសា"
        >
          <Globe size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[140px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-1 text-[#111318] shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenu.Item
            onClick={() => handleSwitch("kh")}
            className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors outline-none ${
              isKh
                ? "bg-[#FFF1E8] text-[#FF6B2C]"
                : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>🇰🇭</span>
              <span>ខ្មែរ</span>
            </span>
            {isKh && <Check size={14} className="text-[#FF6B2C]" />}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => handleSwitch("en")}
            className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors outline-none ${
              isEn
                ? "bg-[#FFF1E8] text-[#FF6B2C]"
                : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>🇺🇸</span>
              <span>English</span>
            </span>
            {isEn && <Check size={14} className="text-[#FF6B2C]" />}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
