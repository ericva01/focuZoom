import { Maximize2, MousePointer2, Palette, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Maximize2, label: "KEEP THE FOCUS", title: "Every detail, in the spotlight.", description: "Guide attention with smooth camera zooms that bring the important moments closer.", color: "text-rose-300 bg-rose-300/10" },
  { icon: MousePointer2, label: "MOVE NATURALLY", title: "A cursor that flows.", description: "Give your pointer smooth motion and clear click effects so viewers can follow along.", color: "text-purple-300 bg-purple-300/10" },
  { icon: Palette, label: "MAKE IT YOURS", title: "Set a beautiful stage.", description: "Find your look with rich backgrounds, thoughtful framing, and cinematic shadows.", color: "text-amber-200 bg-amber-200/10" },
  { icon: ShieldCheck, label: "STAY IN CONTROL", title: "Your work stays local.", description: "Edit right in your browser, with your recordings kept on your own device.", color: "text-emerald-200 bg-emerald-200/10" },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative border-t border-white/[0.07] bg-[#030509] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-300">Small touches. Studio quality.</p><h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Everything your recording<br className="hidden sm:block" /> needs to stand out.</h2></div>
          <p className="max-w-xs text-sm leading-6 text-slate-400">Less time polishing. More time sharing what you do best.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, ...feature }) => (
            <article key={feature.title} className="group flex flex-col rounded-2xl border border-white/10 bg-[#0a0e17] p-6 transition-colors hover:border-white/20 hover:bg-[#101520]">
              <div className={`mb-8 flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}><Icon size={21} /></div>
              <p className="mb-3 text-[10px] font-medium tracking-[0.15em] text-slate-500">{feature.label}</p>
              <h3 className="mb-3 text-lg font-medium tracking-tight">{feature.title}</h3>
              <p className="mb-7 text-sm leading-6 text-slate-400">{feature.description}</p>
              <Link href="/editor" aria-label={`Try ${feature.title}`} className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium text-slate-300 transition-colors hover:text-rose-200">Try it in the studio <ArrowUpRight size={16} /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
