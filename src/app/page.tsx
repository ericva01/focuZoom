"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { CoreFeaturesSection } from "@/components/landing/CoreFeaturesSection";
import { CollaborationShowcase } from "@/components/landing/CollaborationShowcase";
import { RecordingWorkflow } from "@/components/landing/RecordingWorkflow";
import { MeetingExperience } from "@/components/landing/MeetingExperience";
import { TeamWorkspaceSection } from "@/components/landing/TeamWorkspaceSection";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { OpenSourcePillarsSection } from "@/components/landing/OpenSourcePillarsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { DesktopAppDashboard } from "@/components/desktop/DesktopAppDashboard";

import { isDesktopApp } from "@/lib/desktopBridge";

export default function LandingPage() {
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = isDesktopApp();
      const isDesktopQuery = window.location.search.includes("desktop=true");
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

        {/* 4. Video Collaboration Showcase */}
        <div className="content-auto">
          <CollaborationShowcase />
        </div>

        {/* 5. Recording Workflow Pipeline */}
        <div className="content-auto">
          <RecordingWorkflow />
        </div>

        {/* 6. Meeting Experience Showcase */}
        <div className="content-auto">
          <MeetingExperience />
        </div>

        {/* 7. Team Workspace */}
        <div className="content-auto">
          <TeamWorkspaceSection />
        </div>

        {/* 8. Analytics */}
        <div className="content-auto">
          <AnalyticsSection />
        </div>

        {/* 9. Integrations */}
        <div className="content-auto">
          <IntegrationsSection />
        </div>

        {/* 10. Security */}
        <div className="content-auto">
          <SecuritySection />
        </div>

        {/* 11. Open Source Pillars */}
        <div className="content-auto">
          <OpenSourcePillarsSection />
        </div>

        {/* 12. FAQ */}
        <div className="content-auto">
          <FaqSection />
        </div>

        {/* 13. Final CTA */}
        <div className="content-auto">
          <FinalCtaSection />
        </div>
      </main>

      {/* 14. Footer */}
      <Footer />
    </div>
  );
}
