"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
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
      nextUrl = targetPrefix;
    } else {
      nextUrl = `${targetPrefix}${stripped.startsWith("/") ? stripped : `/${stripped}`}`;
    }

    router.push(nextUrl);
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

  // Navbar default
  return (
    <div className={`inline-flex items-center gap-0.5 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] p-0.5 ${className}`}>
      <button
        onClick={() => handleSwitch("kh")}
        aria-label="ជ្រើសរើសភាសាខ្មែរ"
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          isKh
            ? "bg-[#FF6B2C] text-white shadow-xs"
            : "text-[#667085] hover:text-[#111318]"
        }`}
      >
        <span>🇰🇭</span>
        <span>ខ្មែរ</span>
      </button>
      <button
        onClick={() => handleSwitch("en")}
        aria-label="Switch to English"
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          isEn
            ? "bg-white text-[#111318] shadow-xs"
            : "text-[#667085] hover:text-[#111318]"
        }`}
      >
        <span>🇺🇸</span>
        <span>EN</span>
      </button>
    </div>
  );
}
