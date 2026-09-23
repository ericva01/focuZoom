import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { ArrowRight, Terminal, Palette, Headphones, Video, Rocket, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Solutions — FucuFlow Studio",
  description: "Explore FucuFlow solutions for software engineering demos, product design critiques, customer success, async standups, and sales outreach.",
};

const solutions = [
  {
    id: "engineering",
    icon: Terminal,
    title: "Engineering Demos & Code Reviews",
    subtitle: "Show code in action without messy meetings",
    description: "Record pull request walkthroughs, terminal commands, and bug reproductions with focal zooms straight into the diff. Help reviewers approve PRs in half the time.",
    points: [
      "Auto-focuses terminal outputs and code lines",
      "Explain complex architecture asynchronously",
      "Keep recordings strictly offline on dev machines",
    ],
  },
  {
    id: "design",
    icon: Palette,
    title: "Design Critiques & Prototype Walkthroughs",
    subtitle: "Frame Figma, Framer, and UI interactions with cinematic flair",
    description: "Guide stakeholders through user flows with smooth 3D stage angles, focused component zooms, and clear audio voiceovers. Perfect for remote design teams.",
    points: [
      "Smooth camera dollies directly to component clicks",
      "Custom background canvases that match your brand",
      "Export directly in 4K for crisp typography rendering",
    ],
  },
  {
    id: "success",
    icon: Headphones,
    title: "Customer Support & Interactive Guides",
    subtitle: "Turn repetitive support tickets into instant visual answers",
    description: "Show customers exactly which button to click with high-visibility click ripples and smooth camera framing. Reduce back-and-forth emails by 70%.",
    points: [
      "Visual click rings make instructions effortless to follow",
      "Trim out loading screens and awkward pauses",
      "Export lightweight videos ready for documentation embeds",
    ],
  },
  {
    id: "standups",
    icon: Video,
    title: "Async Team Standups & Updates",
    subtitle: "Ditch calendar clutter while keeping everyone aligned",
    description: "Deliver your sprint demo or milestone recap with webcam PiP and screen sharing. Teammates watch at 1.5x or 2x speed whenever their schedule permits.",
    points: [
      "Simultaneous screen and facecam recording",
      "Save team members from meeting fatigue",
      "Zero per-seat charges for growing open source teams",
    ],
  },
  {
    id: "sales",
    icon: Rocket,
    title: "Sales Outreach & Product Pitches",
    subtitle: "High-converting personalized video demos",
    description: "Send prospects personalized walkthroughs of your software addressing their specific pain points. Dynamic camera zooms hold attention from start to finish.",
    points: [
      "Cinematic 3D tilt elevates standard SaaS demos",
      "High retention rates compared to static screen recordings",
      "Zero vendor watermarks on your outbound videos",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Solutions Header */}
        <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                <span>Use Cases & Solutions</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111318] leading-[1.1]">
                Built for the ways modern <span className="text-[#FF6B2C]">teams</span> work.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#667085] leading-relaxed">
                Whether you are demonstrating code, reviewing a UI prototype, or recording an async team update, FucuFlow brings studio-quality visual focus to every recording.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#E85A1F] transition-all"
                >
                  <span>Start Creating Free</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Solutions Cards */}
        <section className="py-20 border-b border-[#E5E7EB] bg-[#F8F9FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {solutions.map((sol, index) => {
                const Icon = sol.icon;
                return (
                  <div
                    key={sol.id}
                    id={sol.id}
                    className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-10 shadow-xs hover:border-[#FF6B2C]/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-7 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111318]">{sol.title}</h2>
                      <p className="text-sm font-semibold text-[#FF6B2C]">{sol.subtitle}</p>
                      <p className="text-sm text-[#667085] leading-relaxed">{sol.description}</p>
                      <ul className="pt-2 space-y-2.5 text-xs text-[#111318] font-medium">
                        {sol.points.map((pt, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#FF6B2C] shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:col-span-5 bg-[#17191F] rounded-2xl p-6 text-white border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                        <span className="text-xs font-mono text-[#FF8A4C]">FucuFlow Workflow #{index + 1}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">Offline & Fast</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-slate-200">
                        &quot;Recording with FucuFlow takes 2 minutes and saves our team 30 minutes of synchronous meeting time every sprint.&quot;
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <Link
                          href="/editor"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8A4C] hover:text-[#FF7A3D] transition-colors"
                        >
                          <span>Try this workflow</span>
                          <ArrowRight size={14} />
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">100% Free</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
