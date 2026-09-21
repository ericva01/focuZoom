"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Video,
  Clock,
  Film,
  Users,
  Calendar as CalendarIcon,
  BarChart3,
  Boxes,
  Settings as SettingsIcon,
  HelpCircle,
  Search,
  Bell,
  Plus,
  Play,
  Share2,
  Download,
  Copy,
  Trash2,
  Edit,
  Check,
  ChevronRight,
  TrendingUp,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Grid,
  List,
  Eye,
  Radio,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

type DashboardTab =
  | "overview"
  | "meetings"
  | "meeting-room"
  | "recordings"
  | "recording-workspace"
  | "videos"
  | "team"
  | "calendar"
  | "analytics"
  | "integrations"
  | "settings";

type SettingsTab =
  | "profile"
  | "account"
  | "workspace"
  | "notifications"
  | "security"
  | "integrations"
  | "billing";

export function DesktopAppDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [videoFilter, setVideoFilter] = useState<"All" | "My Videos" | "Shared With Me" | "Recent" | "Favorites">("All");
  const [videoViewMode, setVideoViewMode] = useState<"grid" | "list">("grid");
  const [settingsSection, setSettingsSection] = useState<SettingsTab>("profile");

  // Modals
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Meeting Room State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isRecordingMeeting, setIsRecordingMeeting] = useState(true);
  const [meetingChatOpen, setMeetingChatOpen] = useState(false);

  // Selected recording in workspace
  const [selectedRecording, setSelectedRecording] = useState({
    id: "rec-1",
    title: "Q3 Video Platform Architecture & Hardware Decode",
    duration: "12:40",
    date: "Sep 20, 2026",
    owner: "Eric Va",
    views: "1.4k",
    description: "Detailed overview of the WebCodecs pipeline, Catmull-Rom spline camera easing, and zero-latency audio mixing.",
    visibility: "Workspace",
  });

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText?.("https://glideo.io/share/v-894201");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Mock Meetings
  const recentMeetings = [
    {
      id: "m-1",
      title: "Glideo 2.0 Launch Strategy & Video Engine Sync",
      date: "Today, 10:00 AM",
      duration: "45 mins",
      participants: ["EV", "SC", "AR", "+4"],
      status: "Live" as const,
    },
    {
      id: "m-2",
      title: "Design System & 3D Bezels Review",
      date: "Yesterday, 3:30 PM",
      duration: "30 mins",
      participants: ["EV", "SC"],
      status: "Completed" as const,
    },
    {
      id: "m-3",
      title: "Customer Success Onboarding Demo: Stripe",
      date: "Sep 19, 2:00 PM",
      duration: "50 mins",
      participants: ["AR", "DM", "+2"],
      status: "Completed" as const,
    },
    {
      id: "m-4",
      title: "Sprint 43 Backlog & Video Scrubber Planning",
      date: "Tomorrow, 11:00 AM",
      duration: "60 mins",
      participants: ["EV", "AR", "DM", "ER"],
      status: "Scheduled" as const,
    },
  ];

  // Mock Recordings
  const recentRecordings = [
    {
      id: "rec-1",
      title: "Q3 Video Platform Architecture & Hardware Decode",
      duration: "12:40",
      date: "Sep 20, 2026",
      owner: "Eric Va",
      views: "1.4k",
      favorite: true,
      category: "My Videos",
    },
    {
      id: "rec-2",
      title: "Focal Auto-Zoom Interaction Demo",
      duration: "04:15",
      date: "Sep 19, 2026",
      owner: "Sarah Chen",
      views: "892",
      favorite: true,
      category: "Shared With Me",
    },
    {
      id: "rec-3",
      title: "Bug Repro: Timeline Keyframe Drag Easing",
      duration: "02:30",
      date: "Sep 18, 2026",
      owner: "David Miller",
      views: "312",
      favorite: false,
      category: "Shared With Me",
    },
    {
      id: "rec-4",
      title: "Customer Walkthrough: Multi-Track Video Timeline",
      duration: "08:50",
      date: "Sep 17, 2026",
      owner: "Eric Va",
      views: "2.1k",
      favorite: true,
      category: "My Videos",
    },
    {
      id: "rec-5",
      title: "Engineering Onboarding: WebCodecs Local Pipeline",
      duration: "18:22",
      date: "Sep 16, 2026",
      owner: "Alex Rivera",
      views: "640",
      favorite: false,
      category: "Shared With Me",
    },
    {
      id: "rec-6",
      title: "Sales Pitch: 60 FPS Browser Recording for Enterprise",
      duration: "06:10",
      date: "Sep 15, 2026",
      owner: "Eric Va",
      views: "3.5k",
      favorite: true,
      category: "My Videos",
    },
  ];

  // Mock Team Members
  const [teamMembers] = useState([
    { name: "Eric Va", email: "ericva014@gmail.com", role: "Owner", status: "Active", lastActive: "Just now", avatar: "EV" },
    { name: "Sarah Chen", email: "sarah@glideo.design", role: "Admin", status: "Active", lastActive: "15m ago", avatar: "SC" },
    { name: "Alex Rivera", email: "alex@glideo.pm", role: "Editor", status: "Away", lastActive: "2h ago", avatar: "AR" },
    { name: "David Miller", email: "david@glideo.dev", role: "Editor", status: "Active", lastActive: "45m ago", avatar: "DM" },
    { name: "Elena Rostova", email: "elena@glideo.dev", role: "Viewer", status: "Active", lastActive: "1d ago", avatar: "ER" },
  ]);

  const filteredVideos = recentRecordings.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (videoFilter === "All") return true;
    if (videoFilter === "My Videos") return v.category === "My Videos";
    if (videoFilter === "Shared With Me") return v.category === "Shared With Me";
    if (videoFilter === "Favorites") return v.favorite;
    if (videoFilter === "Recent") return true;
    return true;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FB] text-[#111318] select-none font-sans">
      
      {/* =================================================== */}
      {/* DESKTOP LEFT SIDEBAR                                */}
      {/* =================================================== */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#E5E7EB] bg-white p-4 shrink-0">
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between px-2 py-3 mb-4">
            <Link href="/">
              <Logo size="md" theme="light" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "overview"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <Layers size={17} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("meetings")}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "meetings" || activeTab === "meeting-room"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Video size={17} />
                <span>Meetings</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B2C] animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab("recordings")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "recordings" || activeTab === "recording-workspace"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <Clock size={17} />
              <span>Recordings</span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "videos"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <Film size={17} />
              <span>Videos</span>
            </button>

            <button
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "team"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <Users size={17} />
              <span>Team</span>
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "calendar"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <CalendarIcon size={17} />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "analytics"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <BarChart3 size={17} />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("integrations")}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === "integrations"
                  ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                  : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
              }`}
            >
              <Boxes size={17} />
              <span>Integrations</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: Settings, Help, Profile */}
        <div className="pt-4 border-t border-[#E5E7EB] space-y-1 text-xs">
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors ${
              activeTab === "settings"
                ? "bg-[#FFF1E8] text-[#FF6B2C] font-semibold"
                : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
            }`}
          >
            <SettingsIcon size={16} />
            <span>Settings</span>
          </button>

          <Link
            href="/resources"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] transition-colors"
          >
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </Link>

          {/* User Profile Block */}
          <div className="mt-3 p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FF6B2C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                EV
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#111318] truncate">Eric Va</p>
                <p className="text-[10px] text-[#667085] truncate">ericva014@gmail.com</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF1E8] text-[#FF6B2C]">Free (MIT)</span>
          </div>
        </div>
      </aside>

      {/* =================================================== */}
      {/* MAIN CONTENT AREA                                   */}
      {/* =================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 border-b border-[#E5E7EB] bg-white px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          {/* Mobile Glideo Logo & Drawer Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Logo size="sm" theme="light" />
          </div>

          {/* Global Search Input */}
          <div className="relative w-72 max-w-full hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings, recordings, team..."
              className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] pl-9 pr-3.5 py-2 text-xs text-[#111318] placeholder-[#667085] focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          {/* Right Actions: Notifications & Primary CTAs */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318] transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6B2C]" />
            </button>

            {/* Secondary CTA: Start Recording */}
            <Link
              href="/editor"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#111318] hover:bg-[#F8F9FB] hover:border-[#D1D5DB] transition-all shadow-xs"
            >
              <Radio size={14} className="text-[#FF6B2C]" />
              <span>Start Recording</span>
            </Link>

            {/* Primary CTA: + New Meeting */}
            <button
              onClick={() => setIsNewMeetingModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all hover:shadow-orange-sm active:scale-95"
            >
              <Plus size={15} />
              <span>+ New Meeting</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          
          {/* ------------------------------------------------- */}
          {/* TAB: OVERVIEW                                     */}
          {/* ------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Dashboard Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111318]">
                    Good morning, Eric
                  </h1>
                  <p className="text-sm text-[#667085] mt-1">
                    Here&apos;s what&apos;s happening with your workspace today.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#667085]">Workspace:</span>
                  <span className="rounded-lg bg-[#FFF1E8] text-[#FF6B2C] font-semibold text-xs px-2.5 py-1">
                    Glideo HQ (24 members)
                  </span>
                </div>
              </div>

              {/* 4 Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Total Meetings */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-sm hover:border-[#FF6B2C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#667085]">Total Meetings</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                      <Video size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-[#111318]">128</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp size={13} /> +12.4% this month
                    </p>
                  </div>
                </div>

                {/* Recordings */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-sm hover:border-[#FF6B2C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#667085]">Recordings</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-[#111318]">84</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp size={13} /> +8.1% this month
                    </p>
                  </div>
                </div>

                {/* Team Members */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-sm hover:border-[#FF6B2C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#667085]">Team Members</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                      <Users size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-[#111318]">24</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp size={13} /> +4 new this month
                    </p>
                  </div>
                </div>

                {/* Video Views */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:shadow-sm hover:border-[#FF6B2C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#667085]">Video Views</span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] flex items-center justify-center">
                      <Eye size={16} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-[#111318]">14.2k</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp size={13} /> +23.8% this month
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Meetings Table / Card List */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-[#111318]">Recent Meetings</h2>
                    <p className="text-xs text-[#667085]">Track live sessions, scheduled reviews, and meeting recordings</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("meetings")}
                    className="text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] flex items-center gap-1"
                  >
                    <span>View all meetings</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] text-[#667085] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Meeting Title</th>
                        <th className="pb-3 font-semibold">Date & Time</th>
                        <th className="pb-3 font-semibold">Duration</th>
                        <th className="pb-3 font-semibold">Participants</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {recentMeetings.map((m) => (
                        <tr key={m.id} className="hover:bg-[#F8F9FB] transition-colors">
                          <td className="py-3.5 pr-4 font-bold text-[#111318]">
                            {m.title}
                          </td>
                          <td className="py-3.5 pr-4 text-[#667085]">{m.date}</td>
                          <td className="py-3.5 pr-4 text-[#667085]">{m.duration}</td>
                          <td className="py-3.5 pr-4">
                            <div className="flex -space-x-1.5">
                              {m.participants.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111318] text-white text-[9px] font-bold ring-2 ring-white"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 pr-4">
                            {m.status === "Live" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF1E8] text-[#FF6B2C] font-bold text-[10px] border border-[#FF6B2C]/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-pulse" />
                                Live Now
                              </span>
                            )}
                            {m.status === "Scheduled" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-[10px] border border-blue-200">
                                Scheduled
                              </span>
                            )}
                            {m.status === "Completed" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#667085] font-semibold text-[10px]">
                                Completed
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            {m.status === "Live" ? (
                              <button
                                onClick={() => setActiveTab("meeting-room")}
                                className="rounded-lg bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-3 py-1 font-bold text-[11px] transition-colors shadow-xs"
                              >
                                Join Room
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveTab("recording-workspace")}
                                className="text-xs font-semibold text-[#667085] hover:text-[#FF6B2C] transition-colors"
                              >
                                View Notes
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Recordings Visual Grid */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-[#111318]">Recent Recordings</h2>
                    <p className="text-xs text-[#667085]">Video files, synthetic demo runs, and screen recordings</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("videos")}
                    className="text-xs font-bold text-[#FF6B2C] hover:text-[#E85A1F] flex items-center gap-1"
                  >
                    <span>View all library</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentRecordings.slice(0, 3).map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedRecording({
                          id: v.id,
                          title: v.title,
                          duration: v.duration,
                          date: v.date,
                          owner: v.owner,
                          views: v.views,
                          description: "Glideo high-definition screen capture with automated focal tracking and WebCodecs 60 FPS output.",
                          visibility: "Workspace",
                        });
                        setActiveTab("recording-workspace");
                      }}
                      className="rounded-2xl border border-[#E5E7EB] bg-white p-3 hover:border-[#FF6B2C]/40 hover:shadow-card-hover transition-all duration-200 group cursor-pointer"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative rounded-xl overflow-hidden bg-[#17191F] aspect-[16/10] flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#FF6B2C] group-hover:scale-110 flex items-center justify-center mx-auto transition-all shadow-md">
                            <Play size={18} className="fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
                          {v.duration}
                        </span>
                      </div>

                      {/* Video Info */}
                      <div className="mt-3 px-1">
                        <h4 className="text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors truncate">
                          {v.title}
                        </h4>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#667085]">
                          <span>{v.owner}</span>
                          <span>{v.views} views · {v.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: MEETING ROOM UI                              */}
          {/* ------------------------------------------------- */}
          {(activeTab === "meeting-room" || activeTab === "meetings") && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Meeting Room Card */}
              <div className="rounded-3xl bg-[#17191F] text-white p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/10 flex flex-col justify-between min-h-[620px]">
                
                {/* Meeting Room Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FF6B2C] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      LIVE MEETING
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Glideo 2.0 Launch Strategy & Video Engine Sync
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">00:42:15</span>
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 size={14} className="text-[#FF6B2C]" />
                      <span>Share Invite</span>
                    </button>
                  </div>
                </div>

                {/* Main Video Screen & Participant Grid */}
                <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
                  
                  {/* Big Video Canvas */}
                  <div className="lg:col-span-8 rounded-2xl bg-[#0F1116] border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden aspect-[16/10] sm:aspect-auto">
                    <div className="flex items-center justify-between z-10">
                      <span className="rounded-md bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/10">
                        {isSharingScreen ? "Screen Share Active (60 FPS)" : "Active Speaker Video"}
                      </span>
                      {isRecordingMeeting && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B2C] px-3 py-1 text-xs font-bold text-white shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          RECORDING
                        </span>
                      )}
                    </div>

                    {/* Visual Center */}
                    <div className="text-center my-auto z-10 select-none">
                      <div className="w-20 h-20 rounded-2xl bg-[#FF6B2C] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-lg">
                        EV
                      </div>
                      <h3 className="text-base font-bold text-white mt-3">Eric Va (Speaking)</h3>
                      <p className="text-xs text-slate-400">Glideo Studio Core Developer</p>
                    </div>

                    <div className="flex items-center justify-between z-10 text-xs text-slate-400">
                      <span>Lossless Opus 48 kHz</span>
                      <span>1080p @ 60 FPS</span>
                    </div>
                  </div>

                  {/* Side Participant Tiles */}
                  <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <div className="rounded-xl bg-[#0F1116] border border-white/10 p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Sarah Chen</span>
                        <Mic size={12} className="text-emerald-400" />
                      </div>
                      <div className="text-center my-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm mx-auto">
                          SC
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">Design Lead</span>
                    </div>

                    <div className="rounded-xl bg-[#0F1116] border border-white/10 p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Alex Rivera</span>
                        <MicOff size={12} className="text-rose-400" />
                      </div>
                      <div className="text-center my-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mx-auto">
                          AR
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">Product Manager</span>
                    </div>

                    <div className="rounded-xl bg-[#0F1116] border border-white/10 p-4 flex flex-col justify-between hidden lg:flex">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">David Miller</span>
                        <Mic size={12} className="text-emerald-400" />
                      </div>
                      <div className="text-center my-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mx-auto">
                          DM
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">Frontend Engineer</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Meeting Control Bar */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 hidden sm:block">
                    Connected: MacBook Pro Audio
                  </div>

                  {/* Central Control Buttons */}
                  <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
                    {/* Microphone Toggle */}
                    <button
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-3 rounded-xl transition-colors ${
                        isMicOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                      title="Toggle Microphone"
                    >
                      {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                    </button>

                    {/* Camera Toggle */}
                    <button
                      onClick={() => setIsCamOn(!isCamOn)}
                      className={`p-3 rounded-xl transition-colors ${
                        isCamOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                      title="Toggle Camera"
                    >
                      {isCamOn ? <Video size={18} /> : <VideoOff size={18} />}
                    </button>

                    {/* Screen Share Toggle */}
                    <button
                      onClick={() => setIsSharingScreen(!isSharingScreen)}
                      className={`p-3 rounded-xl transition-colors ${
                        isSharingScreen
                          ? "bg-[#FF6B2C] text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      title="Share Screen"
                    >
                      <Monitor size={18} />
                    </button>

                    {/* Record Action with Orange Live Indicator */}
                    <button
                      onClick={() => setIsRecordingMeeting(!isRecordingMeeting)}
                      className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isRecordingMeeting
                          ? "bg-[#FF6B2C] hover:bg-[#E85A1F] text-white shadow-sm"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      title="Recording"
                    >
                      <span className={`w-2 h-2 rounded-full ${isRecordingMeeting ? "bg-white animate-pulse" : "bg-[#FF6B2C]"}`} />
                      <span>{isRecordingMeeting ? "Recording Active" : "Record Meeting"}</span>
                    </button>

                    <button
                      onClick={() => setMeetingChatOpen(!meetingChatOpen)}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Chat"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>

                  {/* Danger Action: Leave Meeting (Red only for destructive actions) */}
                  <button
                    onClick={() => setActiveTab("overview")}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-bold text-white transition-colors shadow-xs"
                  >
                    <PhoneOff size={15} />
                    <span>Leave Meeting</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: RECORDINGS (Dedicated Workspace)             */}
          {/* ------------------------------------------------- */}
          {(activeTab === "recordings" || activeTab === "recording-workspace") && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#111318]">Recording Workspace</h1>
                  <p className="text-xs text-[#667085]">Inspect, edit, share, and export your video captures</p>
                </div>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="text-xs font-semibold text-[#667085] hover:text-[#111318]"
                >
                  ← Back to Overview
                </button>
              </div>

              {/* Split Layout: Left Video Preview, Right Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Video Player + Timeline */}
                <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-[#17191F] aspect-[16/10] flex items-center justify-center">
                    <div className="text-center text-white select-none">
                      <div className="w-16 h-16 rounded-full bg-[#FF6B2C] text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 transition-transform cursor-pointer">
                        <Play size={24} className="fill-current ml-1" />
                      </div>
                      <p className="mt-3 text-xs text-slate-300">Click to preview 60 FPS recording</p>
                    </div>

                    <span className="absolute top-4 left-4 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white border border-white/10">
                      4K 60 FPS · WebCodecs
                    </span>
                  </div>

                  {/* Player Scrubber & Timeline */}
                  <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-2">
                    <div className="relative h-2 bg-[#E5E7EB] rounded-full overflow-hidden cursor-pointer">
                      <div className="bg-[#FF6B2C] h-full w-2/5 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#667085]">
                      <span className="font-mono">04:32 / {selectedRecording.duration}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#111318]">Speed: 1.0x</span>
                        <span>Auto-Zoom: Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Recording Information */}
                <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF1E8] text-[#FF6B2C]">
                      {selectedRecording.visibility} Recording
                    </span>
                    <h3 className="text-lg font-bold text-[#111318] mt-2">
                      {selectedRecording.title}
                    </h3>
                    <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                      {selectedRecording.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-[#667085] pt-3 border-t border-[#E5E7EB]">
                    <div className="flex justify-between">
                      <span>Owner</span>
                      <span className="font-semibold text-[#111318]">{selectedRecording.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span className="font-semibold text-[#111318]">{selectedRecording.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Views</span>
                      <span className="font-semibold text-[#111318]">{selectedRecording.views}</span>
                    </div>
                  </div>

                  {/* Share Link Field */}
                  <div className="pt-3 border-t border-[#E5E7EB]">
                    <label className="text-xs font-bold text-[#111318] block mb-1.5">Share Link</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://glideo.io/share/v-894201"
                        className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3 py-2 text-xs text-[#667085] font-mono"
                      />
                      <button
                        onClick={handleCopyShareLink}
                        className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white p-2 shrink-0 transition-colors shadow-xs"
                        title="Copy Link"
                      >
                        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons: Edit, Download, Delete */}
                  <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                    <Link
                      href="/editor"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white py-2.5 text-xs font-bold transition-all shadow-xs"
                    >
                      <Edit size={14} />
                      <span>Open in Studio Editor</span>
                    </Link>

                    <button
                      onClick={() => alert("Downloading 60 FPS WebM file...")}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8F9FB] text-[#111318] py-2.5 text-xs font-bold transition-all shadow-xs"
                    >
                      <Download size={14} />
                      <span>Download Video (4K)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this recording?")) {
                          alert("Recording deleted.");
                          setActiveTab("overview");
                        }
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 py-2.5 text-xs font-bold transition-all"
                    >
                      <Trash2 size={14} />
                      <span>Delete Recording</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: VIDEO LIBRARY                                */}
          {/* ------------------------------------------------- */}
          {activeTab === "videos" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#111318]">Video Library</h1>
                  <p className="text-xs text-[#667085]">Manage, filter, and organize all team video content</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl bg-white border border-[#E5E7EB] p-1 shadow-xs">
                    <button
                      onClick={() => setVideoViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-colors ${videoViewMode === "grid" ? "bg-[#FFF1E8] text-[#FF6B2C]" : "text-[#667085]"}`}
                      title="Grid view"
                    >
                      <Grid size={15} />
                    </button>
                    <button
                      onClick={() => setVideoViewMode("list")}
                      className={`p-1.5 rounded-lg transition-colors ${videoViewMode === "list" ? "bg-[#FFF1E8] text-[#FF6B2C]" : "text-[#667085]"}`}
                      title="List view"
                    >
                      <List size={15} />
                    </button>
                  </div>

                  <Link
                    href="/editor"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-3.5 py-2 text-xs font-semibold shadow-xs"
                  >
                    <Plus size={14} />
                    <span>New Video</span>
                  </Link>
                </div>
              </div>

              {/* Filters Bar: All, My Videos, Shared With Me, Recent, Favorites */}
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                {(["All", "My Videos", "Shared With Me", "Recent", "Favorites"] as const).map((filterName) => (
                  <button
                    key={filterName}
                    onClick={() => setVideoFilter(filterName)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      videoFilter === filterName
                        ? "bg-[#FF6B2C] text-white shadow-xs"
                        : "bg-white border border-[#E5E7EB] text-[#667085] hover:text-[#111318] hover:border-[#D1D5DB]"
                    }`}
                  >
                    {filterName}
                  </button>
                ))}
              </div>

              {/* Video Grid or List */}
              {videoViewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVideos.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedRecording({
                          id: v.id,
                          title: v.title,
                          duration: v.duration,
                          date: v.date,
                          owner: v.owner,
                          views: v.views,
                          description: "Glideo high-definition screen capture with automated focal tracking.",
                          visibility: "Workspace",
                        });
                        setActiveTab("recording-workspace");
                      }}
                      className="rounded-2xl border border-[#E5E7EB] bg-white p-3 hover:border-[#FF6B2C]/50 hover:shadow-card-hover transition-all duration-200 group cursor-pointer"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-[#17191F] aspect-[16/10] flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#FF6B2C] group-hover:scale-110 flex items-center justify-center transition-all">
                          <Play size={18} className="fill-current text-white ml-0.5" />
                        </div>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
                          {v.duration}
                        </span>
                      </div>

                      <div className="mt-3 px-1">
                        <h4 className="text-xs font-bold text-[#111318] group-hover:text-[#FF6B2C] transition-colors truncate">
                          {v.title}
                        </h4>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#667085]">
                          <span>{v.owner}</span>
                          <span>{v.views} views · {v.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white divide-y divide-[#E5E7EB] shadow-xs">
                  {filteredVideos.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedRecording({
                          id: v.id,
                          title: v.title,
                          duration: v.duration,
                          date: v.date,
                          owner: v.owner,
                          views: v.views,
                          description: "Glideo screen capture with automated focal tracking.",
                          visibility: "Workspace",
                        });
                        setActiveTab("recording-workspace");
                      }}
                      className="p-4 flex items-center justify-between hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/10 text-[#FF6B2C] flex items-center justify-center">
                          <Play size={14} className="fill-current ml-0.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111318]">{v.title}</p>
                          <p className="text-[11px] text-[#667085]">{v.owner} · {v.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-mono text-[#667085]">{v.duration}</span>
                        <span className="text-[#667085]">{v.views} views</span>
                        <ChevronRight size={16} className="text-[#667085]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: TEAM PAGE                                    */}
          {/* ------------------------------------------------- */}
          {activeTab === "team" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#111318]">Team Members</h1>
                  <p className="text-xs text-[#667085]">Manage team roles, access permissions, and invites</p>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-4 py-2 text-xs font-semibold shadow-xs"
                >
                  <Plus size={14} />
                  <span>Invite Member</span>
                </button>
              </div>

              {/* Members Table */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-[#667085] uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Last Active</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {teamMembers.map((member, idx) => (
                      <tr key={idx} className="hover:bg-[#F8F9FB] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#111318] text-white font-bold text-xs flex items-center justify-center">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-[#111318]">{member.name}</p>
                              <p className="text-[11px] text-[#667085]">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            member.role === "Owner"
                              ? "bg-[#FFF1E8] text-[#FF6B2C]"
                              : "bg-[#F8F9FB] text-[#111318] border border-[#E5E7EB]"
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {member.status}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-[#667085]">{member.lastActive}</td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => alert(`Settings for ${member.name}`)}
                            className="text-xs font-semibold text-[#667085] hover:text-[#FF6B2C]"
                          >
                            Edit Permissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: CALENDAR                                     */}
          {/* ------------------------------------------------- */}
          {activeTab === "calendar" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#111318]">Meeting Calendar</h1>
                  <p className="text-xs text-[#667085]">Scheduled syncs, client reviews, and async recordings</p>
                </div>
                <button
                  onClick={() => setIsNewMeetingModalOpen(true)}
                  className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-4 py-2 text-xs font-semibold shadow-xs"
                >
                  + Schedule Sync
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentMeetings.map((m) => (
                  <div key={m.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF1E8] text-[#FF6B2C]">
                        {m.status}
                      </span>
                      <span className="text-xs text-[#667085]">{m.duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#111318]">{m.title}</h3>
                    <p className="text-xs text-[#667085]">{m.date}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-[#667085]">4 participants</span>
                      <button
                        onClick={() => setActiveTab("meeting-room")}
                        className="rounded-lg bg-[#FF6B2C] text-white px-3 py-1 text-xs font-semibold hover:bg-[#E85A1F]"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: ANALYTICS                                    */}
          {/* ------------------------------------------------- */}
          {activeTab === "analytics" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#111318]">Analytics & Viewer Telemetry</h1>
                <p className="text-xs text-[#667085]">Deep engagement metrics, watch curves, and viewer drop-off</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-xs text-[#667085]">Video Views</span>
                  <p className="text-2xl font-bold text-[#111318] mt-2">142,800</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+24.5% vs last month</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-xs text-[#667085]">Watch Time</span>
                  <p className="text-2xl font-bold text-[#111318] mt-2">84.2%</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+12.1% retention</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-xs text-[#667085]">Unique Viewers</span>
                  <p className="text-2xl font-bold text-[#111318] mt-2">38,620</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+18.9% growth</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-xs text-[#667085]">Engagement Rate</span>
                  <p className="text-2xl font-bold text-[#111318] mt-2">92.4%</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+6.8% comments</p>
                </div>
              </div>

              {/* Minimal SVG Chart with Orange Theme */}
              <div className="p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111318]">Views Over Time (30 Days)</h3>
                  <span className="text-xs text-[#FF6B2C] font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
                    Orange: Unique Video Impressions
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#E5E7EB" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#E5E7EB" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#E5E7EB" strokeDasharray="3 3" />

                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 0 120 Q 80 70 160 90 T 320 40 T 420 50 T 500 20 L 500 160 L 0 160 Z"
                      fill="url(#chartFill)"
                    />
                    <path
                      d="M 0 120 Q 80 70 160 90 T 320 40 T 420 50 T 500 20"
                      fill="none"
                      stroke="#FF6B2C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: INTEGRATIONS                                 */}
          {/* ------------------------------------------------- */}
          {activeTab === "integrations" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#111318]">Connected Integrations</h1>
                <p className="text-xs text-[#667085]">Connect video events to Slack, Notion, GitHub, and Jira</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { name: "Slack", status: "Connected", desc: "Send notifications to #glideo-reviews" },
                  { name: "Notion", status: "Connected", desc: "Auto-embed video docs into team wiki" },
                  { name: "GitHub", status: "Connected", desc: "Sync 60 FPS bug screen captures to issues" },
                  { name: "Figma", status: "Available", desc: "Link recordings to Figma canvases" },
                  { name: "Jira", status: "Available", desc: "Attach lossless video recordings to sprint tickets" },
                  { name: "Google Meet", status: "Available", desc: "One-click meeting recording import" },
                ].map((item) => (
                  <div key={item.name} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[#111318] text-base">{item.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "Connected" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-[#667085]"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E5E7EB]">
                      <button className="text-xs font-semibold text-[#FF6B2C] hover:text-[#E85A1F]">
                        {item.status === "Connected" ? "Configure Settings" : "Connect App"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* TAB: SETTINGS                                     */}
          {/* ------------------------------------------------- */}
          {activeTab === "settings" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#111318]">Workspace Settings</h1>
                <p className="text-xs text-[#667085]">Manage profile, security, notifications, and billing</p>
              </div>

              {/* Left Sub-nav & Right Content Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Settings Navigation */}
                <div className="md:col-span-3 rounded-2xl bg-white border border-[#E5E7EB] p-3 shadow-xs space-y-1 text-xs font-medium">
                  {(["profile", "account", "workspace", "notifications", "security", "integrations", "billing"] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSettingsSection(sec)}
                      className={`w-full text-left px-3 py-2 rounded-xl capitalize transition-colors ${
                        settingsSection === sec
                          ? "bg-[#FFF1E8] text-[#FF6B2C] font-bold"
                          : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#111318]"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>

                {/* Right Content Panel */}
                <div className="md:col-span-9 rounded-2xl sm:rounded-3xl bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-6">
                  {settingsSection === "profile" && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-[#111318]">Profile Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-[#111318] block mb-1">Full Name</label>
                          <input
                            type="text"
                            defaultValue="Eric Va"
                            className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#111318] block mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue="ericva014@gmail.com"
                            className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#111318] block mb-1">Title / Role</label>
                        <input
                          type="text"
                          defaultValue="Founder & Video Platform Engineer"
                          className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318]"
                        />
                      </div>
                      <button
                        onClick={() => alert("Profile changes saved.")}
                        className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}

                  {settingsSection === "billing" && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-[#111318]">License & Open Source</h3>
                      <div className="p-4 rounded-xl bg-[#FFF1E8] border border-[#FF6B2C]/20 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#FF6B2C]">Glideo Community Edition</p>
                          <p className="text-[11px] text-[#667085]">Free & Open Source under the MIT License</p>
                        </div>
                        <span className="rounded-md bg-[#FF6B2C] text-white px-3 py-1 text-xs font-bold">
                          100% Free
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed">
                        Glideo is 100% free software. All screen captures, meetings, and project files are saved strictly on your local device. Zero cloud subscriptions, zero tracking, and no proprietary vendor lock-in.
                      </p>
                      <div className="pt-2">
                        <a
                          href="https://github.com/ericva01/focuZoom"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-[#111318] text-white px-4 py-2 text-xs font-bold hover:bg-[#222630] transition-colors shadow-xs"
                        >
                          <span>View on GitHub</span>
                          <span className="text-[#FF6B2C]">★</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {settingsSection !== "profile" && settingsSection !== "billing" && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-[#111318] capitalize">{settingsSection} Settings</h3>
                      <p className="text-xs text-[#667085]">
                        Configure your {settingsSection} policies, notifications, and security protocols.
                      </p>
                      <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#667085]">
                        All changes are automatically synchronized with your Glideo workspace.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =================================================== */}
      {/* MOBILE APP UI (BOTTOM NAVIGATION)                   */}
      {/* =================================================== */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E5E7EB] py-2 px-4 z-40 flex items-center justify-around">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === "overview" ? "text-[#FF6B2C]" : "text-[#667085]"
          }`}
        >
          <Layers size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab("meetings")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === "meetings" || activeTab === "meeting-room" ? "text-[#FF6B2C]" : "text-[#667085]"
          }`}
        >
          <Video size={18} />
          <span>Meetings</span>
        </button>

        {/* Floating Orange Main Action Button */}
        <Link
          href="/editor"
          className="-mt-5 w-12 h-12 rounded-full bg-[#FF6B2C] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </Link>

        <button
          onClick={() => setActiveTab("videos")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === "videos" ? "text-[#FF6B2C]" : "text-[#667085]"
          }`}
        >
          <Film size={18} />
          <span>Videos</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === "settings" ? "text-[#FF6B2C]" : "text-[#667085]"
          }`}
        >
          <SettingsIcon size={18} />
          <span>Profile</span>
        </button>
      </div>

      {/* =================================================== */}
      {/* MODAL: NEW MEETING                                  */}
      {/* =================================================== */}
      {isNewMeetingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E5E7EB] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-[#FF6B2C]" />
                <h3 className="text-base font-bold text-[#111318]">Start New Meeting</h3>
              </div>
              <button onClick={() => setIsNewMeetingModalOpen(false)} className="text-[#667085] hover:text-[#111318]">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#111318] block mb-1">Meeting Title</label>
              <input
                type="text"
                defaultValue="Instant Video Review & Engine Sync"
                className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318] focus:outline-none focus:border-[#FF6B2C]"
              />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#FF6B2C]" />
                <span>Record meeting automatically</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewMeetingModalOpen(false)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F8F9FB]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsNewMeetingModalOpen(false);
                  setActiveTab("meeting-room");
                }}
                className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-5 py-2 text-xs font-bold shadow-xs"
              >
                Join Room Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* MODAL: INVITE MEMBER                                */}
      {/* =================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E5E7EB] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#FF6B2C]" />
                <h3 className="text-base font-bold text-[#111318]">Invite Team Member</h3>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-[#667085] hover:text-[#111318]">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#111318] block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="colleague@company.com"
                className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318] focus:outline-none focus:border-[#FF6B2C]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#111318] block mb-1">Role & Permissions</label>
              <select className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs text-[#111318]">
                <option>Editor (Can create, record, and share videos)</option>
                <option>Viewer (Can view and comment on recordings)</option>
                <option>Admin (Full workspace administration)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F8F9FB]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Invitation email sent!");
                  setIsInviteModalOpen(false);
                }}
                className="rounded-xl bg-[#FF6B2C] hover:bg-[#E85A1F] text-white px-5 py-2 text-xs font-bold shadow-xs"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* MODAL: SHARE INVITE LINK                            */}
      {/* =================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E5E7EB] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#FF6B2C]" />
                <h3 className="text-base font-bold text-[#111318]">Share Meeting Link</h3>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="text-[#667085] hover:text-[#111318]">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#111318] block mb-1">Encrypted Room URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://glideo.io/room/sync-9824"
                  className="w-full rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] px-3.5 py-2 text-xs font-mono text-[#667085]"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="rounded-xl bg-[#FF6B2C] text-white p-2 shrink-0 hover:bg-[#E85A1F]"
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#667085]">
              Anyone with this link can join this meeting room and collaborate in real-time.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
