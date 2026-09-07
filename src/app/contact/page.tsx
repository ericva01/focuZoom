import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact & Community — FocuFlow Studio",
  description: "Get in touch with the FocuFlow team for product feedback, feature requests, and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 relative overflow-hidden">
      {/* Atmospheric ambient lighting */}
      <div className="ambient-backdrop" />
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-sky-500/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 py-14 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Col: Info */}
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>

            {/* Right Col: Interactive Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
