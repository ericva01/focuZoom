"use client";

import {
  Users,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

export function TeamWorkspaceSection() {
  const folders = [
    { name: "Design System & UI Reviews", count: "34 videos", members: "12 members" },
    { name: "Engineering Sprint Demos", count: "89 videos", members: "24 members" },
    { name: "Customer Onboarding & Sales", count: "16 videos", members: "8 members" },
    { name: "Product Architecture Specs", count: "42 videos", members: "15 members" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FB] border-t border-[#E5E7EB] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
            <Users size={14} />
            <span>Structured Spaces</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111318]">
            One shared hub for all team video assets.
          </h2>
          <p className="text-[#667085] text-base sm:text-lg leading-relaxed">
            Organize recordings into departmental channels, control granular permissions, and search transcripts instantly.
          </p>
        </div>

        {/* Workspace Mock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Folder Cards */}
          <div className="lg:col-span-6 space-y-4">
            {folders.map((f, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#FF6B2C]/40 hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] border border-[#FF6B2C]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FolderOpen size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors">
                      {f.name}
                    </h4>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {f.count} · {f.members}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#667085] group-hover:text-[#FF6B2C] flex items-center gap-1 transition-colors">
                  <span>View folder</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>

          {/* Right: Team Permissions & Activity Card */}
          <div className="lg:col-span-6 rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#111318] text-white flex items-center justify-center font-bold text-xs">
                  G
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#111318]">Glideo Enterprise Workspace</h4>
                  <p className="text-[11px] text-[#667085]">24 active contributors</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs px-3 py-1 border border-emerald-200">
                SSO Active
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF6B2C] text-white font-bold text-xs flex items-center justify-center">
                    EV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111318]">Eric Va</p>
                    <p className="text-[10px] text-[#667085]">ericva014@gmail.com</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#FFF1E8] text-[#FF6B2C] font-bold text-[10px] uppercase">
                  Workspace Owner
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#111318] text-white font-bold text-xs flex items-center justify-center">
                    SC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111318]">Sarah Chen</p>
                    <p className="text-[10px] text-[#667085]">sarah@glideo.design</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] text-[#111318] font-semibold text-[10px] uppercase">
                  Admin
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#667085] text-white font-bold text-xs flex items-center justify-center">
                    AR
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111318]">Alex Rivera</p>
                    <p className="text-[10px] text-[#667085]">alex@glideo.pm</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] text-[#667085] font-semibold text-[10px] uppercase">
                  Editor
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-xs text-[#667085]">Need customized roles?</span>
              <Link
                href="/desktop?view=team"
                className="text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] flex items-center gap-1"
              >
                <span>Manage team settings</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
