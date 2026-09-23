"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Focus,
  Video,
  Monitor,
  BookOpen,
  Home,
  RotateCcw,
} from "lucide-react";

export default function NotFound() {
  const [coords, setCoords] = useState({ x: 404, y: 404 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C] relative overflow-hidden">
      <Navbar />

      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10"
      >
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B2C]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl w-full text-center space-y-8 select-none">
          
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold font-mono text-[#FF6B2C] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
            <span>ERROR 404 // FOCAL TARGET LOST</span>
          </div>

          {/* Viewfinder 404 Camera Mockup */}
          <div className="relative mx-auto max-w-lg p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E7EB] shadow-xl overflow-hidden group">
            
            {/* Viewfinder Corner Markers */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FF6B2C]/60 rounded-tl" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FF6B2C]/60 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FF6B2C]/60 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FF6B2C]/60 rounded-br" />

            {/* Viewfinder Telemetry Header */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[#667085] pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-[#111318]">CAM_01: OFFLINE</span>
              </div>
              <div className="flex items-center gap-3">
                <span>ZOOM: 0.00x</span>
                <span>FPS: 00</span>
              </div>
            </div>

            {/* Giant Graphic 404 */}
            <div className="py-6 sm:py-8 flex flex-col items-center justify-center relative">
              <span className="text-7xl sm:text-9xl font-black tracking-tighter text-[#111318] drop-shadow-sm leading-none font-mono">
                4<span className="text-[#FF6B2C]">0</span>4
              </span>

              {/* Crosshair Center Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#FF6B2C] flex items-center justify-center">
                  <Focus size={24} className="text-[#FF6B2C]" />
                </div>
              </div>
            </div>

            {/* Live Telemetry Footer Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#667085]">
              <span className="truncate">CURSOR: [{coords.x}, {coords.y}]</span>
              <span className="text-[#FF6B2C] font-semibold">CLIP NOT FOUND</span>
            </div>
          </div>

          {/* Heading and Clarifying Context */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111318]">
              This scene seems to have cut away.
            </h1>
            <p className="text-[#667085] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              The page or video asset you are looking for has been moved, ripple deleted, or never existed in the FucuFlow workspace.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#111318] hover:bg-[#22252e] text-white px-6 py-3.5 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Home size={15} />
              <span>Return Home</span>
            </Link>

            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-6 py-3.5 text-xs font-bold transition-all shadow-sm hover:shadow-[0_6px_20px_rgba(255,107,44,0.3)] active:scale-95 cursor-pointer"
            >
              <Video size={15} />
              <span>Open Studio Editor</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-[#F8F9FB] text-[#111318] border border-[#E5E7EB] px-5 py-3.5 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Suggested Quick Destinations */}
          <div className="pt-8 border-t border-[#E5E7EB] max-w-2xl mx-auto">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#667085] mb-4">
              Explore Available Destinations
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <Link
                href="/features"
                className="p-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#FF6B2C]/40 transition-colors shadow-2xs group"
              >
                <div className="text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors flex items-center justify-between">
                  <span>Features</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5">Explore auto-zoom</p>
              </Link>

              <Link
                href="/download"
                className="p-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#FF6B2C]/40 transition-colors shadow-2xs group"
              >
                <div className="text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors flex items-center justify-between">
                  <span>Downloads</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5">Desktop apps</p>
              </Link>

              <Link
                href="/resources"
                className="p-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#FF6B2C]/40 transition-colors shadow-2xs group"
              >
                <div className="text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors flex items-center justify-between">
                  <span>Guides</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5">Shortcuts &amp; tips</p>
              </Link>

              <Link
                href="/about"
                className="p-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#FF6B2C]/40 transition-colors shadow-2xs group"
              >
                <div className="text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors flex items-center justify-between">
                  <span>About Us</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5">Our philosophy</p>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
