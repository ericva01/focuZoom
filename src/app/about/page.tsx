import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AboutView } from "@/components/about/AboutView";

export const metadata = {
  title: "About — Eric Va & Glideo",
  description: "Message from creator Eric Va (Eric Lvis) and the story behind Glideo.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030509] text-slate-100 relative select-none">
      {/* Background Ambient Aura */}
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none overflow-hidden flex items-start justify-center">
        <div className="absolute -top-24 w-[900px] h-[400px] bg-gradient-to-b from-purple-600/15 via-rose-500/5 to-transparent blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutView />
        </div>
      </main>

      <Footer />
    </div>
  );
}
