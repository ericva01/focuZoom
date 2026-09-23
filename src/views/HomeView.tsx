"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { CoreFeaturesSection } from "@/components/landing/CoreFeaturesSection";
import { RecordingWorkflow } from "@/components/landing/RecordingWorkflow";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { OpenSourcePillarsSection } from "@/components/landing/OpenSourcePillarsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { DesktopAppDashboard } from "@/components/desktop/DesktopAppDashboard";
import { isDesktopApp } from "@/lib/desktopBridge";

export function HomeView() {
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = isDesktopApp();
      const isDesktopQuery =
        window.location.search.includes("desktop=true") ||
        window.location.search.includes("view=desktop") ||
        window.location.search.includes("view");
      setIsDesktopMode(isDesktop || isDesktopQuery);
    }
  }, []);

  if (isDesktopMode) {
    return <DesktopAppDashboard />;
  }

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      {/* 1. Navbar */}
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Core Features Modular Grid */}
        <div className="content-auto">
          <CoreFeaturesSection />
        </div>

        {/* 3. Recording Workflow Pipeline */}
        <div className="content-auto">
          <RecordingWorkflow />
        </div>

        {/* 4. Security & Local-First */}
        <div className="content-auto">
          <SecuritySection />
        </div>

        {/* 5. 100% Free & Open Source Pillars */}
        <div className="content-auto">
          <OpenSourcePillarsSection />
        </div>

        {/* 6. FAQ */}
        <div className="content-auto">
          <FaqSection />
        </div>

        {/* 7. Final CTA */}
        <div className="content-auto">
          <FinalCtaSection />
        </div>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
