import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ComparisonDemo } from "@/components/landing/ComparisonDemo";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-100 selection:bg-focu-indigo selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureGrid />
        <ComparisonDemo />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
