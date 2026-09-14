import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact & Community — Glideo",
  description: "Get in touch with the Glideo team for product feedback, feature requests, and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030509] text-slate-100 relative select-none">
      {/* Background Volumetric Aura */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden flex items-start justify-center">
        <div className="absolute -top-20 w-[800px] h-[350px] bg-gradient-to-b from-purple-600/15 via-rose-500/5 to-transparent blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 py-14 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Col: 3D Fluid Visual & Email */}
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>

            {/* Right Col: High-Tech Glass Contact Form */}
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
