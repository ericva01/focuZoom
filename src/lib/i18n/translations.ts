export type Locale = "en" | "km" | "kh";

export interface Translations {
  nav: {
    product: string;
    features: string;
    solutions: string;
    openSource: string;
    resources: string;
    download: string;
    launchApp: string;
    skipToContent: string;
    loginWorkspace: string;
    downloadClient: string;
    githubBadge: string;
  };
  hero: {
    pill: string;
    titleMain: string;
    titleGradient: string;
    subtitle: string;
    launchStudio: string;
    downloadClient: string;
    viewGithub: string;
    badges: {
      free: string;
      privacy: string;
      noCloud: string;
      export4k: string;
    };
    preview: {
      timeline: string;
      cursorZoom: string;
      tilt3D: string;
      autoTrack: string;
      playing: string;
      paused: string;
      zoomIn: string;
      autoEasing: string;
      exportAction: string;
      activeTrack: string;
    };
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    cards: {
      record: { badge: string; title: string; desc: string; highlight: string; };
      collaborate: { badge: string; title: string; desc: string; highlight: string; };
      share: { badge: string; title: string; desc: string; highlight: string; };
      manage: { badge: string; title: string; desc: string; highlight: string; };
      canvas: { badge: string; title: string; desc: string; highlight: string; };
      export: { badge: string; title: string; desc: string; highlight: string; };
    };
  };
  workflow: {
    badge: string;
    title: string;
    steps: {
      step1: { badge: string; title: string; desc: string; };
      step2: { badge: string; title: string; desc: string; };
      step3: { badge: string; title: string; desc: string; };
    };
  };
  security: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: {
      p1: { title: string; desc: string; };
      p2: { title: string; desc: string; };
      p3: { title: string; desc: string; };
      p4: { title: string; desc: string; };
    };
  };
  openSource: {
    badge: string;
    title: string;
    subtitle: string;
    columns: {
      col1: { title: string; desc: string; };
      col2: { title: string; desc: string; };
      col3: { title: string; desc: string; };
    };
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
      category: string;
    }>;
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    getStarted: string;
    starGithub: string;
    badges: {
      free: string;
      browser: string;
      local: string;
    };
  };
  footer: {
    desc: string;
    subscribeTitle: string;
    subscribePlaceholder: string;
    subscribeBtn: string;
    subscribedMsg: string;
    systemStatus: string;
    colProduct: string;
    colSolutions: string;
    colResources: string;
    colLegal: string;
    overview: string;
    features: string;
    webStudio: string;
    desktopApp: string;
    downloads: string;
    docs: string;
    shortcuts: string;
    privacyPolicy: string;
    terms: string;
    security: string;
    rights: string;
    solutionsList: {
      engineering: string;
      design: string;
      success: string;
      standups: string;
      sales: string;
    };
  };
  download: {
    modalTitle: string;
    modalDesc: string;
    winTitle: string;
    macTitle: string;
    linuxTitle: string;
    downloadNow: string;
    viewRelease: string;
  };
  lang: {
    name: string;
    enName: string;
    kmName: string;
    switchLang: string;
  };
  // Full Pages
  productPage: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
    launchStudio: string;
    exploreFeatures: string;
    pillarsHeader: {
      title: string;
      subtitle: string;
    };
    pillars: {
      zoom: {
        title: string;
        desc: string;
        f1: string;
        f2: string;
        f3: string;
      };
      privacy: {
        title: string;
        desc: string;
        f1: string;
        f2: string;
        f3: string;
      };
      timeline: {
        title: string;
        desc: string;
        f1: string;
        f2: string;
        f3: string;
      };
    };
  };
  featuresPage: {
    badge: string;
    title: string;
    subtitle: string;
    deepDives: Array<{
      id: string;
      badge: string;
      title: string;
      description: string;
      highlights: string[];
    }>;
  };
  solutionsPage: {
    badge: string;
    title: string;
    subtitle: string;
    solutions: Array<{
      id: string;
      title: string;
      subtitle: string;
      description: string;
      points: string[];
    }>;
  };
  openSourcePage: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    githubBtn: string;
    launchStudio: string;
    tenetsHeader: {
      title: string;
      subtitle: string;
    };
    tenets: Array<{
      title: string;
      desc: string;
    }>;
  };
  resourcesPage: {
    badge: string;
    title: string;
    subtitle: string;
    docsTitle: string;
    docsSubtitle: string;
    shortcutsTitle: string;
    shortcutsSubtitle: string;
    shortcuts: Array<{
      key: string;
      label: string;
      desc: string;
    }>;
    guides: Array<{
      title: string;
      desc: string;
      readTime: string;
    }>;
  };
  aboutPage: {
    badge: string;
    title: string;
    subtitle: string;
    principlesHeader: string;
    principles: Array<{
      title: string;
      badge: string;
      description: string;
    }>;
    storyHeader: string;
    storyP1: string;
    storyP2: string;
  };
  contactPage: {
    badge: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      category: string;
      categoryOptions: {
        general: string;
        bug: string;
        feature: string;
        security: string;
      };
      message: string;
      messagePlaceholder: string;
      sendBtn: string;
      sentSuccess: string;
    };
    info: {
      emailTitle: string;
      emailDesc: string;
      githubTitle: string;
      githubDesc: string;
      securityTitle: string;
      securityDesc: string;
    };
  };
  downloadPage: {
    badge: string;
    title: string;
    subtitle: string;
    platforms: {
      win: { title: string; desc: string; btn: string; };
      mac: { title: string; desc: string; btn: string; };
      linux: { title: string; desc: string; btn: string; };
    };
    webStudioTitle: string;
    webStudioDesc: string;
    webStudioBtn: string;
  };
}

const en: Translations = {
  nav: {
    product: "Product",
    features: "Features",
    solutions: "Solutions",
    openSource: "Open Source",
    resources: "Resources",
    download: "Download",
    launchApp: "Launch App",
    skipToContent: "Skip to content",
    loginWorkspace: "Log in to Workspace",
    downloadClient: "Download Desktop Client",
    githubBadge: "Open Source",
  },
  hero: {
    pill: "v0.1.4 Open Source Release • Windows, Mac & Linux",
    titleMain: "Record once. Zoom anywhere.",
    titleGradient: "Export studio videos in minutes.",
    subtitle:
      "Turn ordinary screen recordings into cinematic product demos with automatic zoom, 3D camera angles, and smooth motion.",
    launchStudio: "Launch Web Studio",
    downloadClient: "Download Client",
    viewGithub: "Open Source on GitHub",
    badges: {
      free: "100% Free & Open Source",
      privacy: "Local-first Privacy",
      noCloud: "Zero Cloud Uploads",
      export4k: "4K 60fps Export",
    },
    preview: {
      timeline: "Multi-Track Timeline",
      cursorZoom: "Cursor Focus Zoom",
      tilt3D: "3D Spatial Angle",
      autoTrack: "Keyframe Automation",
      playing: "Live Playing",
      paused: "Paused",
      zoomIn: "Auto Zoom",
      autoEasing: "Smooth Spring",
      exportAction: "Export Video",
      activeTrack: "Main Screen 4K",
    },
  },
  features: {
    badge: "Core Features",
    title: "Capture, collaborate, and share with high impact.",
    subtitle:
      "Built from the ground up to replace clunky legacy recording tools with automated screen recording and camera focal zoom.",
    cards: {
      record: {
        badge: "Record",
        title: "Capture high-quality video and meetings.",
        desc: "High-definition 4K 60 FPS recording with automatic cursor zoom, noise-canceling mic isolation, and zero-latency client encoding.",
        highlight: "Auto-zoom & 60 FPS WebCodecs",
      },
      collaborate: {
        badge: "Collaborate",
        title: "Work together with your team in one workspace.",
        desc: "Time-stamped comments, interactive video reviews, and live emoji reactions so remote teams stay aligned without back-and-forth emails.",
        highlight: "Time-coded comments & reactions",
      },
      share: {
        badge: "Share",
        title: "Share videos quickly with your team or clients.",
        desc: "Instant link generation with customizable permissions, expiring links, password protection, and one-click embeddable players.",
        highlight: "Instant link & password control",
      },
      manage: {
        badge: "Manage",
        title: "Organize meetings, recordings, and content.",
        desc: "Categorize recordings with smart tags, workspace folders, and automated transcription indexing for lightning-fast retrieval.",
        highlight: "Smart folders & automated indexing",
      },
      canvas: {
        badge: "Studio Mockup",
        title: "Dynamic 3D Canvas & Studio Backgrounds.",
        desc: "Add realistic device bezels, sleek drop shadows, frosted glass blur, and gradient backdrops with customizable camera tilt.",
        highlight: "3D tilt angles & studio backdrops",
      },
      export: {
        badge: "Local-First",
        title: "100% Private, Zero Cloud Watermarks.",
        desc: "Your files never leave your computer. Export crisp MP4 and WebM videos without watermarks or forced subscriptions.",
        highlight: "No watermark & 100% private",
      },
    },
  },
  workflow: {
    badge: "Recording Workflow",
    title: "From recording to cinematic export in three steps.",
    steps: {
      step1: {
        badge: "Step 01",
        title: "Record Any Screen or Window",
        desc: "Select your full screen, specific app window, or browser tab. Record crystal-clear system audio and microphone with zero frame drops.",
      },
      step2: {
        badge: "Step 02",
        title: "Automatic Focal Zoom & 3D Tilt",
        desc: "Our smart engine detects your clicks and actions, smoothly zooming the camera to the focal area without manual keyframing.",
      },
      step3: {
        badge: "Step 03",
        title: "Export Crisp 4K Video Locally",
        desc: "Customize aspect ratios, background colors, paddings, and export instantly to MP4/WebM using your computer's GPU acceleration.",
      },
    },
  },
  security: {
    badge: "100% Private Architecture",
    title: "Your recordings stay on your machine. Period.",
    subtitle:
      "Unlike traditional recording tools that upload your private screens to remote cloud servers, FucuFlow processes everything locally on your hardware.",
    pillars: {
      p1: {
        title: "Zero Cloud Video Storage",
        desc: "Your video tracks and audio streams are stored directly in your local disk and browser IndexedDB.",
      },
      p2: {
        title: "Offline Capable",
        desc: "Full editing, camera animation, and export capabilities without requiring an active internet connection.",
      },
      p3: {
        title: "Hardware-Accelerated",
        desc: "Rendering and encoding use your GPU through WebGL 2.0 and WebCodecs for lightning-fast speeds.",
      },
      p4: {
        title: "Transparent & Auditable",
        desc: "Full source code available under MIT License ensures zero hidden telemetry or tracking.",
      },
    },
  },
  openSource: {
    badge: "Community & Transparency",
    title: "Built openly for developers and creators.",
    subtitle:
      "FucuFlow is completely free and licensed under permissive MIT. Inspect every line, contribute features, or self-host.",
    columns: {
      col1: {
        title: "Permissive MIT License",
        desc: "Use it for personal, commercial, or team projects without restrictions or hidden charges.",
      },
      col2: {
        title: "No Subscriptions or Paywalls",
        desc: "All features including 4K exports, multi-track timeline, and 3D tilts are free forever.",
      },
      col3: {
        title: "Active Open Source Development",
        desc: "Driven by feedback from developers, designers, and video creators across the globe.",
      },
    },
  },
  faq: {
    badge: "Got Questions?",
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about FucuFlow's local-first video studio.",
    items: [
      {
        question: "How does FucuFlow achieve 60 FPS recording directly inside the browser?",
        answer:
          "FucuFlow uses the modern W3C WebCodecs and WebGL 2.0 API standards. Rather than relying on heavyweight server queues or slow canvas capture, your local graphics hardware handles hardware-accelerated encoding (H.264/AV1/VP9) in real time with near-zero CPU overhead.",
        category: "Technology",
      },
      {
        question: "Do my screen captures or webcam recordings get uploaded to any cloud server?",
        answer:
          "No. FucuFlow is built completely local-first. All recordings, focal zoom processing, and video exports take place strictly on your local device hardware. Your video files remain on your local disk.",
        category: "Privacy",
      },
      {
        question: "How does the Automated Camera Zoom feature work?",
        answer:
          "FucuFlow tracks cursor activity, click clustering, and window events across time. It calculates Catmull-Rom spline curves with critically damped spring physics to glide the virtual camera seamlessly into the area of user focus, completely eliminating jarring visual cuts.",
        category: "Features",
      },
      {
        question: "Can I collaborate on video reviews with team members who don't have an account?",
        answer:
          "Yes! Public or password-protected review links permit teammates, clients, and external stakeholders to leave time-coded comments, reactions, and annotations directly without forcing them to register an account.",
        category: "Collaboration",
      },
      {
        question: "Does FucuFlow support desktop apps for macOS, Windows, and Linux?",
        answer:
          "Yes, in addition to the zero-install web application, FucuFlow offers lightweight native desktop applications built on Tauri and Rust, providing system tray quick recording, global hotkeys, and multi-monitor capture.",
        category: "Platforms",
      },
    ],
  },
  cta: {
    badge: "Start in 30 Seconds",
    title: "Ready to transform how your team communicates through video?",
    subtitle:
      "Join thousands of creators, engineers, and modern product teams using FucuFlow to tell clearer video stories.",
    getStarted: "Get Started Free",
    starGithub: "Star on GitHub",
    badges: {
      free: "100% Free & Open Source",
      browser: "Instant browser launch",
      local: "Stored 100% on your device",
    },
  },
  footer: {
    desc: "The modern video collaboration workspace. Record, auto-zoom, polish, and communicate with high-impact clarity. 100% free and open source.",
    subscribeTitle: "Subscribe to product updates",
    subscribePlaceholder: "Enter your work email",
    subscribeBtn: "Join",
    subscribedMsg: "You're subscribed to updates!",
    systemStatus: "All studio systems operational",
    colProduct: "Product",
    colSolutions: "Solutions",
    colResources: "Resources",
    colLegal: "Legal & Trust",
    overview: "Overview",
    features: "Features",
    webStudio: "Web Studio",
    desktopApp: "Desktop App",
    downloads: "Downloads & Releases",
    docs: "Documentation",
    shortcuts: "Shortcuts",
    privacyPolicy: "Privacy Policy",
    terms: "Terms of Service",
    security: "Security & Trust",
    rights: "All rights reserved. Free & Open Source under MIT License.",
    solutionsList: {
      engineering: "Engineering Demos",
      design: "Design Critiques",
      success: "Customer Success",
      standups: "Async Standups",
      sales: "Sales Outreach",
    },
  },
  download: {
    modalTitle: "Download FucuFlow Desktop",
    modalDesc: "Native performance with global hotkeys, background tray recording, and multi-monitor capture.",
    winTitle: "Windows x64",
    macTitle: "macOS (Apple Silicon & Intel)",
    linuxTitle: "Linux (AppImage & deb)",
    downloadNow: "Download Now",
    viewRelease: "View Release Notes",
  },
  lang: {
    name: "Language",
    enName: "English",
    kmName: "ភាសាខ្មែរ",
    switchLang: "Switch to Khmer",
  },
  productPage: {
    badge: "The Video Studio Reimagined",
    titleMain: "Every tool you need to create",
    titleHighlight: "studio-grade",
    description: "FucuFlow is a fast, modern, and open-source video creation suite. Record your screen, automatically animate smooth camera focus, trim multiple tracks, and export crisp 4K videos without subscription paywalls or cloud lock-in.",
    launchStudio: "Launch Web Studio",
    exploreFeatures: "Explore Features",
    pillarsHeader: {
      title: "Engineered for speed, precision, and privacy.",
      subtitle: "Built from the ground up to replace clunky legacy recording tools with a browser and desktop engine.",
    },
    pillars: {
      zoom: {
        title: "Automated Zoom Framing",
        desc: "Automatically tracks your clicks and interactions, synthesizing smooth Catmull-Rom spline camera dollies so your audience never loses focus.",
        f1: "Auto-burst click grouping",
        f2: "Dynamic focal center calculation",
        f3: "Custom zoom speeds & hold spans",
      },
      privacy: {
        title: "100% Local User Storage",
        desc: "Your video files never upload to third-party cloud servers. Everything is recorded, processed, stored, and exported directly on your local device.",
        f1: "Local disk & IndexedDB storage",
        f2: "Zero telemetry or tracking",
        f3: "Compliant with enterprise security",
      },
      timeline: {
        title: "Pro Multi-Track Timeline",
        desc: "Split clips, ripple delete unwanted pauses, preview live audio waveforms, and snap keyframe timestamps with millisecond accuracy.",
        f1: "Split (S) and Ripple Delete (Shift+Del)",
        f2: "Live Web Audio waveform rendering",
        f3: "Sub-second precision magnetic snapping",
      },
    },
  },
  featuresPage: {
    badge: "Deep Dive Architecture",
    title: "Crafted for creators who refuse to compromise.",
    subtitle: "From spring-damped camera physics to zero-copy GPU video rendering, explore the technical innovation behind FucuFlow Studio.",
    deepDives: [
      {
        id: "auto-zoom",
        badge: "Camera Intelligence",
        title: "Focal Auto-Zoom with Catmull-Rom Spline Easing",
        description: "Never lose your viewer's focus. FucuFlow logs mouse coordinates during screen recording and automatically creates smooth, cinematic camera dollies right to where action happens.",
        highlights: [
          "Dynamic focal center calculation targeting user inputs",
          "Burst click grouping prevents rapid jarring cuts",
          "Custom hold spans, zoom speeds (0.2s - 2.5s), and scale ratios (1.2x - 4x)",
        ],
      },
      {
        id: "multi-track",
        badge: "Timeline Precision",
        title: "Pro Multi-Track Timeline & Audio Waveforms",
        description: "Edit screen recordings with millisecond precision. Independent tracks for Video, Auto Zoom keyframes, Voiceover Audio, and Webcam overlays.",
        highlights: [
          "Razor tool (S) and Ripple Delete (Shift+Del) to close gaps effortlessly",
          "Real-time audio waveform canvas powered by Web Audio API",
          "Magnetic timecode snapping with sub-second accurate SMPTE markers",
        ],
      },
      {
        id: "3d-transform",
        badge: "Visual Depth",
        title: "3D Stage Tilt & Spatial Orientation",
        description: "Turn flat screen recordings into high-end product showcases. Rotate, pitch, and yaw your video canvas in 3D perspective with realistic studio lighting.",
        highlights: [
          "Presets for Front Studio, Isometric Left/Right, and Subtle Float",
          "Smooth canvas border radii (0px - 48px) and inset padding controls",
          "Curated mesh gradients, modern macOS wallpapers, and solid studio backdrops",
        ],
      },
      {
        id: "local-storage",
        badge: "100% Privacy",
        title: "Local Device Storage & Zero Cloud Uploads",
        description: "Your recordings never leave your machine. Projects are stored directly in your local IndexedDB and native desktop filesystem.",
        highlights: [
          "Zero third-party cloud uploads or remote database storage",
          "No user registration, license checks, or forced subscriptions",
          "Permanent offline functionality for air-gapped environments",
        ],
      },
    ],
  },
  solutionsPage: {
    badge: "Tailored Workflows",
    title: "Engineered for every video communication need.",
    subtitle: "Discover how engineering, design, customer success, and product teams use FucuFlow to replace meetings with high-clarity video.",
    solutions: [
      {
        id: "engineering",
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
        title: "Product Marketing & Sales Outreach",
        subtitle: "Convert prospects with studio-grade video demos",
        description: "Stand out in crowded inboxes with personalized 3D product previews. Add studio shadows, gradient backdrops, and crisp 60 FPS motion.",
        points: [
          "Eye-catching 3D tilt previews that boost click-throughs",
          "Export lightweight MP4/WebM videos for email embeds",
          "Polished branding without costly video production agencies",
        ],
      },
    ],
  },
  openSourcePage: {
    badge: "MIT Licensed Software",
    titleMain: "100% Free &",
    titleHighlight: "Open Source",
    subtitle: "We believe video creation software should be open, private, and accessible to everyone. No recurring subscription fees, no artificial export limitations, and no cloud surveillance.",
    githubBtn: "View on GitHub",
    launchStudio: "Launch Web Studio",
    tenetsHeader: {
      title: "Built on four unwavering principles.",
      subtitle: "How FucuFlow protects user freedom, privacy, and sovereignty.",
    },
    tenets: [
      {
        title: "Permissive MIT License",
        desc: "Fork it, embed it, commercialize it, or extend it. Free forever for individuals, startups, and enterprises.",
      },
      {
        title: "100% Local-First Data",
        desc: "Your recordings never touch external cloud servers. All video frames reside safely on your local disk.",
      },
      {
        title: "Hardware Accelerated",
        desc: "Built directly on W3C WebCodecs and WebGL 2.0 for buttery 60 FPS rendering without burning CPU cycles.",
      },
      {
        title: "Community Governed",
        desc: "Shaped by open pull requests, feature requests, and feedback from creators and developers worldwide.",
      },
    ],
  },
  resourcesPage: {
    badge: "Knowledge Hub",
    title: "Documentation, Shortcuts, and Guides.",
    subtitle: "Master FucuFlow Studio with comprehensive keyboard shortcuts, architecture deep dives, and production tips.",
    docsTitle: "Essential Documentation",
    docsSubtitle: "Get up to speed with FucuFlow's local video pipeline.",
    shortcutsTitle: "Keyboard Shortcuts",
    shortcutsSubtitle: "Speed up your editing workflow with high-velocity keybindings.",
    shortcuts: [
      { key: "Space", label: "Play / Pause", desc: "Toggle playback on the timeline canvas" },
      { key: "S", label: "Split Clip", desc: "Split video track at the current playhead cursor" },
      { key: "Shift + Del", label: "Ripple Delete", desc: "Delete active segment and automatically close the gap" },
      { key: "Z", label: "Add Focal Zoom", desc: "Insert a keyframed camera dolly at cursor position" },
      { key: "Cmd/Ctrl + E", label: "Export Studio", desc: "Open 4K hardware-accelerated export dialogue" },
    ],
    guides: [
      { title: "Recording Setup & Best Practices", desc: "How to capture crystal-clear system audio and microphone isolation.", readTime: "4 min read" },
      { title: "Mastering Automated Camera Easing", desc: "Configure Catmull-Rom tension, zoom scales, and click grouping.", readTime: "6 min read" },
      { title: "Customizing 3D Canvas Backgrounds", desc: "Add frosted glass bezels, drop shadows, and modern desktop wallpapers.", readTime: "5 min read" },
    ],
  },
  aboutPage: {
    badge: "Our Story",
    title: "Empowering developers to tell clearer stories.",
    subtitle: "FucuFlow was founded on a simple belief: high-impact video creation should be fast, private, and free of subscription paywalls.",
    principlesHeader: "Core Engineering Principles",
    principles: [
      {
        title: "100% Local & Private",
        badge: "Zero Cloud",
        description: "Your screen captures never touch a cloud server. Video processing, zooming, and rendering happen entirely on your machine via IndexedDB and GPU shaders.",
      },
      {
        title: "Hardware-Accelerated WebCodecs",
        badge: "60 FPS Core",
        description: "Built on modern W3C WebCodecs and WebGL 2.0 to deliver real-time 4K rendering with silky-smooth frame rates and negligible battery consumption.",
      },
      {
        title: "Intelligent Focal Camera Easing",
        badge: "Spring Dynamics",
        description: "Catmull-Rom spline curves with critically damped spring physics glide the virtual camera effortlessly into user interactions, banishing abrupt cuts.",
      },
      {
        title: "Permissive MIT Open Source",
        badge: "Free Forever",
        description: "Every single line of code is open on GitHub. No subscription gates, no feature paywalls, and no hidden telemetry. Built by developers, for creators.",
      },
    ],
    storyHeader: "The Vision Behind FucuFlow",
    storyP1: "Traditional video editing software was built decades ago for Hollywood filmmakers, making it hopelessly complex for modern software engineers, product designers, and creators who just want to showcase their work.",
    storyP2: "FucuFlow strips away the bloat and focuses on what makes product videos look breathtaking: automatic focal zooms, 3D perspective tilts, drop shadows, and instantaneous local GPU exports.",
  },
  contactPage: {
    badge: "Get in Touch",
    title: "We'd love to hear from you.",
    subtitle: "Have questions, feature suggestions, or security feedback? Reach out to the FucuFlow community and maintainers.",
    form: {
      name: "Your Name",
      namePlaceholder: "Eric Va",
      email: "Email Address",
      emailPlaceholder: "you@company.com",
      category: "Inquiry Type",
      categoryOptions: {
        general: "General Inquiry",
        bug: "Bug Report",
        feature: "Feature Request",
        security: "Security & Auditing",
      },
      message: "Message",
      messagePlaceholder: "Tell us about your project or suggestion...",
      sendBtn: "Send Message",
      sentSuccess: "Thank you! Your message has been sent successfully.",
    },
    info: {
      emailTitle: "Direct Email",
      emailDesc: "Send feedback or questions directly to maintainers.",
      githubTitle: "GitHub Issues & Discussions",
      githubDesc: "File public bugs, submit pull requests, and discuss features.",
      securityTitle: "Security & Audits",
      securityDesc: "Confidential vulnerability reports and architecture inquiries.",
    },
  },
  downloadPage: {
    badge: "Native Performance",
    title: "Download FucuFlow for Desktop",
    subtitle: "Supercharged with native OS integrations, system tray recording, global hotkeys, and multi-monitor capture for Windows, Mac, and Linux.",
    platforms: {
      win: {
        title: "Windows 10 / 11",
        desc: "64-bit native installer (.exe) with DirectX hardware acceleration.",
        btn: "Download for Windows (.exe)",
      },
      mac: {
        title: "macOS Universal",
        desc: "Apple Silicon (M1/M2/M3/M4) and Intel installer (.dmg) with Metal GPU.",
        btn: "Download for Mac (.dmg)",
      },
      linux: {
        title: "Linux Standalone",
        desc: "Universal AppImage & Debian package (.deb) with Wayland support.",
        btn: "Download for Linux (.AppImage)",
      },
    },
    webStudioTitle: "Prefer no installation?",
    webStudioDesc: "FucuFlow runs with 100% feature parity directly inside modern Chromium browsers (Chrome, Edge, Brave).",
    webStudioBtn: "Launch Web Studio Instantly",
  },
};

const km: Translations = {
  nav: {
    product: "ផលិតផល",
    features: "លក្ខណៈពិសេស",
    solutions: "ដំណោះស្រាយ",
    openSource: "កូដចំហ",
    resources: "ធនធាន",
    download: "ទាញយក",
    launchApp: "បើកកម្មវិធី",
    skipToContent: "រំលងទៅមាតិកា",
    loginWorkspace: "ចូលទៅកាន់កន្លែងធ្វើការ",
    downloadClient: "ទាញយកកម្មវិធីកុំព្យូទ័រ",
    githubBadge: "កូដចំហ",
  },
  hero: {
    pill: "v0.1.4 កំណែកូដចំហថ្មី • Windows, Mac និង Linux",
    titleMain: "ថតម្តង។ ពង្រីកគ្រប់កន្លែង។",
    titleGradient: "នាំចេញវីដេអូកម្រិតស្ទូឌីយោក្នុងប៉ុន្មាននាទី។",
    subtitle:
      "ប្រែក្លាយការថតអេក្រង់ធម្មតាឱ្យទៅជាវីដេអូបង្ហាញផលិតផលបែបភាពយន្ត ជាមួយនឹងការពង្រីកស្វ័យប្រវត្តិតាមការចុច មុំកាមេរ៉ា 3D រលូន និងចលនាធម្មជាតិ។",
    launchStudio: "បើកស្ទូឌីយោ Web",
    downloadClient: "ទាញយកកម្មវិធីកុំព្យូទ័រ",
    viewGithub: "មើលកូដចំហលើ GitHub",
    badges: {
      free: "ឥតគិតថ្លៃ & កូដចំហ ១០០%",
      privacy: "ឯកជនភាពផ្ទាល់លើម៉ាស៊ីន",
      noCloud: "គ្មានការបង្ហោះទៅ Cloud",
      export4k: "នាំចេញ 4K 60fps ច្បាស់ត្រជាក់ភ្នែក",
    },
    preview: {
      timeline: "បន្ទាត់ពេលវេលាច្រើន Track",
      cursorZoom: "ពង្រីកតាម Mouse",
      tilt3D: "មុំកាមេរ៉ា 3D",
      autoTrack: "Keyframe ស្វ័យប្រវត្តិ",
      playing: "កំពុងចាក់",
      paused: "ផ្អាក",
      zoomIn: "ពង្រីកស្វ័យប្រវត្តិ",
      autoEasing: "ចលនារលូន Spring",
      exportAction: "នាំចេញវីដេអូ",
      activeTrack: "អេក្រង់មេ 4K",
    },
  },
  features: {
    badge: "លក្ខណៈពិសេសស្នូល",
    title: "ថត សហការ និងចែករំលែកដោយប្រសិទ្ធភាពខ្ពស់បំផុត។",
    subtitle:
      "បង្កើតឡើងតាំងពីគ្រឹះ ដើម្បីជំនួសកម្មវិធីកាត់តវីដេអូស្មុគស្មាញ ដោយការថតអេក្រង់កម្រិតខ្ពស់ និងការពង្រីកចំណុចសំខាន់ដោយស្វ័យប្រវត្តិ។",
    cards: {
      record: {
        badge: "ការថត",
        title: "ថតវីដេអូ និងការប្រជុំកម្រិតច្បាស់ខ្ពស់បំផុត។",
        desc: "ការថតកម្រិត 4K 60 FPS ជាមួយការពង្រីកស្វ័យប្រវត្តិតាម Mouse, ការកាត់បន្ថយសំឡេងរំខានមីក្រូហ្វូន និងការ Encode ផ្ទាល់លើម៉ាស៊ីនគ្មានពន្យារពេល។",
        highlight: "ពង្រីកស្វ័យប្រវត្តិ & 60 FPS WebCodecs",
      },
      collaborate: {
        badge: "សហការ",
        title: "ធ្វើការរួមគ្នាជាមួយក្រុមការងាររបស់អ្នកក្នុងកន្លែងតែមួយ។",
        desc: "ការបញ្ចេញមតិកត់ត្រាពេលវេលា ការត្រួតពិនិត្យវីដេអូអន្តរកម្ម និង Emoji Reactions ដើម្បីឱ្យក្រុមការងារយល់ចិត្តគ្នាលឿនដោយមិនបាច់ផ្ញើអ៊ីមែលឆ្លើយឆ្លង។",
        highlight: "មតិកំណត់ម៉ោង & ប្រតិកម្មភ្លាមៗ",
      },
      share: {
        badge: "ចែករំលែក",
        title: "ចែករំលែកវីដេអូរហ័សជាមួយក្រុមការងារ ឬអតិថិជន។",
        desc: "បង្កើតតំណភ្ជាប់ចែករំលែកភ្លាមៗ ជាមួយការកំណត់សិទ្ធិ តំណកំណត់ពេលផុតកំណត់ ការការពារដោយពាក្យសម្ងាត់ និងចាក់វីដេអូបានគ្រប់ទីកន្លែង។",
        highlight: "តំណភ្ជាប់រហ័ស & ការពារពាក្យសម្ងាត់",
      },
      manage: {
        badge: "គ្រប់គ្រង",
        title: "រៀបចំការប្រជុំ ការថត និងមាតិកាប្រកបដោយរបៀបរៀបរយ។",
        desc: "ចាត់ថ្នាក់វីដេអូដោយស្លាកឆ្លាតវៃ ថតឯកសារ និងការស្រង់អត្ថបទស្វ័យប្រវត្តិដើម្បីស្វែងរកបានលឿនដូចផ្លេកបន្ទោរ។",
        highlight: "ថតឆ្លាតវៃ & ការស្វែងរកស្វ័យប្រវត្តិ",
      },
      canvas: {
        badge: "ស្ទូឌីយោ Mockup",
        title: "ផ្ទៃ Canvas 3D និងផ្ទៃខាងក្រោយបែបស្ទូឌីយោ។",
        desc: "បន្ថែមស៊ុមឧបករណ៍ដ៏ទាក់ទាញ ស្រមោលរលោង ផ្ទៃកញ្ចក់ប្លឺ និងផ្ទៃខាងក្រោយពណ៌ Gradient ជាមួយមុំកាមេរ៉ា 3D បត់បែនបាន។",
        highlight: "មុំបង្វិល 3D & ផ្ទៃខាងក្រោយស្ទូឌីយោ",
      },
      export: {
        badge: "ដំណើរការលើម៉ាស៊ីន",
        title: "ឯកជនភាព ១០០% គ្មាន Watermark លើ Cloud។",
        desc: "ឯកសាររបស់អ្នកមិនដែលចាកចេញពីកុំព្យូទ័រឡើយ។ នាំចេញវីដេអូ MP4 និង WebM កម្រិតខ្ពស់ដោយគ្មានជាប់ Watermark ឬបង្ខំទិញ Subscription។",
        highlight: "គ្មាន Watermark & ឯកជនភាព ១០០%",
      },
    },
  },
  workflow: {
    badge: "របៀបដំណើរការថត",
    title: "ពីការថតទៅជាវីដេអូបែបភាពយន្តក្នុង ៣ ជំហានយ៉ាងងាយ។",
    steps: {
      step1: {
        badge: "ជំហាន ០១",
        title: "ថតអេក្រង់ ឬបង្អួចកម្មវិធីណាមួយ",
        desc: "ជ្រើសរើសអេក្រង់ទាំងមូល បង្អួចកម្មវិធី ឬផ្ទាំង Browser។ ថតសំឡេងប្រព័ន្ធ និងមីក្រូហ្វូនច្បាស់ល្អ គ្មានទាក់ឬធ្លាក់ Frame ឡើយ។",
      },
      step2: {
        badge: "ជំហាន ០២",
        title: "ពង្រីកស្វ័យប្រវត្តិតាមការចុច & មុំកាមេរ៉ា 3D",
        desc: "ប្រព័ន្ធឆ្លាតវៃចាប់យកការចុច Mouse របស់អ្នក រួចពង្រីកកាមេរ៉ាទៅកាន់ចំណុចសំខាន់ដោយរលូន មិនបាច់កំណត់ Keyframe ដោយដៃឡើយ។",
      },
      step3: {
        badge: "ជំហាន ០៣",
        title: "នាំចេញវីដេអូ 4K ផ្ទាល់លើកុំព្យូទ័រ",
        desc: "កែប្រែទំហំសមាមាត្រ ពណ៌ផ្ទៃខាងក្រោយ គម្លាត និងនាំចេញជា MP4/WebM ភ្លាមៗដោយប្រើកម្លាំង GPU នៃកុំព្យូទ័ររបស់អ្នក។",
      },
    },
  },
  security: {
    badge: "ស្ថាបត្យកម្មឯកជនភាព ១០០%",
    title: "វីដេអូរបស់អ្នកស្ថិតនៅលើកុំព្យូទ័ររបស់អ្នកជានិច្ច។",
    subtitle:
      "ខុសពីកម្មវិធីថតចាស់ៗដែលបង្ហោះអេក្រង់ឯកជនរបស់អ្នកទៅកាន់ Cloud, FucuFlow ដំណើរការអ្វីៗទាំងអស់ផ្ទាល់លើ Hardware របស់អ្នក។",
    pillars: {
      p1: {
        title: "គ្មានការផ្ទុកវីដេអូលើ Cloud",
        desc: "វីដេអូ និងសំឡេងរបស់អ្នកត្រូវបានរក្សាទុកដោយផ្ទាល់នៅលើថាសរឹង និង IndexedDB លើម៉ាស៊ីនរបស់អ្នក។",
      },
      p2: {
        title: "ប្រើប្រាស់ដោយគ្មានអ៊ីនធឺណិត",
        desc: "កាត់ត ធ្វើចលនាកាមេរ៉ា និងនាំចេញវីដេអូបានពេញលេញ ដោយមិនចាំបាច់មានអ៊ីនធឺណិតឡើយ។",
      },
      p3: {
        title: "ជំនួយល្បឿនដោយ Hardware GPU",
        desc: "ការ Render និង Encode ប្រើប្រាស់ GPU តាមរយៈ WebGL 2.0 និង WebCodecs សម្រាប់ល្បឿនលឿនអស្ចារ្យ។",
      },
      p4: {
        title: "កូដចំហ & អាចត្រួតពិនិត្យបាន",
        desc: "កូដចំហក្រោមអាជ្ញាប័ណ្ណ MIT ធានានូវតម្លាភាព ១០០% ដោយគ្មានកម្មវិធីលួចតាមដាន ឬបញ្ជូនទិន្នន័យឡើយ។",
      },
    },
  },
  openSource: {
    badge: "សហគមន៍ & តម្លាភាព",
    title: "បង្កើតឡើងដោយចំហសម្រាប់អ្នកអភិវឌ្ឍន៍ និងអ្នកបង្កើតមាតិកា។",
    subtitle:
      "FucuFlow ឥតគិតថ្លៃទាំងស្រុង ក្រោមអាជ្ញាប័ណ្ណ MIT។ អាចពិនិត្យកូដគ្រប់បន្ទាត់ ចូលរួមអភិវឌ្ឍន៍ ឬដំឡើងប្រើដោយខ្លួនឯង។",
    columns: {
      col1: {
        title: "អាជ្ញាប័ណ្ណ MIT ដោយសេរី",
        desc: "ប្រើប្រាស់សម្រាប់គម្រោងផ្ទាល់ខ្លួន ពាណិជ្ជកម្ម ឬក្រុមការងារដោយគ្មានការរឹតត្បិត ឬគិតថ្លៃលាក់កំបាំងឡើយ។",
      },
      col2: {
        title: "គ្មាន Subscription ឬការទាមទារលុយ",
        desc: "មុខងារទាំងអស់ រួមទាំងការនាំចេញ 4K, Timeline ច្រើន Track និងមុំ 3D គឺឥតគិតថ្លៃជារៀងរហូត។",
      },
      col3: {
        title: "ការអភិវឌ្ឍកូដចំហយ៉ាងសកម្ម",
        desc: "ជំរុញដោយមតិយោបល់របស់អ្នកអភិវឌ្ឍន៍ អ្នករចនា និងអ្នកបង្កើតវីដេអូជុំវិញពិភពលោក។",
      },
    },
  },
  faq: {
    badge: "មានសំណួរមែនទេ?",
    title: "សំណួរដែលសួរញឹកញាប់",
    subtitle: "អ្វីៗទាំងអស់ដែលអ្នកត្រូវដឹងអំពីស្ទូឌីយោវីដេអូ FucuFlow លើម៉ាស៊ីនកុំព្យូទ័រ។",
    items: [
      {
        question: "តើ FucuFlow ថតវីដេអូ 60 FPS ក្នុង Browser ដោយរបៀបណា?",
        answer:
          "FucuFlow ប្រើប្រាស់ស្តង់ដារទំនើប W3C WebCodecs និង WebGL 2.0។ ជំនួសឱ្យការពឹងផ្អែកលើ Server ធ្ងន់ ឬ Canvas យឺត កាតក្រាហ្វិកលើកុំព្យូទ័ររបស់អ្នកផ្ទាល់ជាអ្នក Encode (H.264/AV1/VP9) ក្នុងពេលជាក់ស្តែងដោយមិនស៊ីកម្លាំង CPU ឡើយ។",
        category: "បច្ចេកវិទ្យា",
      },
      {
        question: "តើការថតអេក្រង់ ឬកាមេរ៉ារបស់ខ្ញុំត្រូវបានបង្ហោះទៅ Server ដែរឬទេ?",
        answer:
          "ទេ! FucuFlow ត្រូវបានបង្កើតឡើងលើគោលការណ៍ Local-First ទាំងស្រុង។ ការថត ការពង្រីកចំណុចសំខាន់ និងការនាំចេញវីដេអូ ដំណើរការតែនៅលើកុំព្យូទ័ររបស់អ្នកប៉ុណ្ណោះ។ ឯកសារវីដេអូរបស់អ្នកស្ថិតនៅលើម៉ាស៊ីនរបស់អ្នកជានិច្ច។",
        category: "ឯកជនភាព",
      },
      {
        question: "តើមុខងារពង្រីកកាមេរ៉ាស្វ័យប្រវត្តិតាម Mouse ដំណើរការយ៉ាងដូចម្តេច?",
        answer:
          "FucuFlow ចាប់យកសកម្មភាព Mouse ការចុច និងព្រឹត្តិការណ៍បង្អួចកម្មវិធី។ វាគណនាខ្សែកោង Catmull-Rom Spline ជាមួយចលនារលូនបែប Spring Physics ដើម្បីរុញកាមេរ៉ាទៅកាន់ចំណុចដែលអ្នកប្រើប្រាស់កំពុងចាប់អារម្មណ៍ដោយរលូន គ្មានការកាត់ប្តូរប្លុកៗឡើយ។",
        category: "មុខងារ",
      },
      {
        question: "តើខ្ញុំអាចសហការត្រួតពិនិត្យវីដេអូជាមួយសមាជិកក្រុមដែលគ្មានគណនីបានទេ?",
        answer:
          "បាទ/ចាសបាន! តំណភ្ជាប់ត្រួតពិនិត្យជាសាធារណៈ ឬការពារដោយពាក្យសម្ងាត់ អនុញ្ញាតឱ្យសមាជិកក្រុម អតិថិជន និងដៃគូខាងក្រៅអាចដាក់មតិកំណត់ពេលវេលា Reaction និងកំណត់ចំណាំបានភ្លាមៗ ដោយមិនបាច់ចុះឈ្មោះគណនីឡើយ។",
        category: "កិច្ចសហការ",
      },
      {
        question: "តើ FucuFlow មានកម្មវិធីកុំព្យូទ័រសម្រាប់ macOS, Windows និង Linux ដែរឬទេ?",
        answer:
          "បាទ/ចាសមាន! បន្ថែមពីលើកម្មវិធីលើ Web ដែលមិនបាច់ដំឡើង FucuFlow ក៏មានកម្មវិធី Desktop ស្រាលលឿនបង្កើតឡើងដោយ Tauri និង Rust ដែលផ្តល់នូវការថតរហ័សពី System Tray, គ្រាប់ចុចកាត់ (Hotkeys) និងការថតអេក្រង់ច្រើនក្នុងពេលតែមួយ។",
        category: "ប្រព័ន្ធប្រតិបត្តិការ",
      },
    ],
  },
  cta: {
    badge: "ចាប់ផ្តើមត្រឹមតែ ៣០ វិនាទី",
    title: "ត្រៀមខ្លួនរួចរាល់ហើយឬនៅ ក្នុងការផ្លាស់ប្តូរការទំនាក់ទំនងតាមវីដេអូ?",
    subtitle:
      "ចូលរួមជាមួយអ្នកបង្កើតមាតិកា វិស្វករ និងក្រុមការងាររាប់ពាន់នាក់ដែលកំពុងប្រើប្រាស់ FucuFlow ដើម្បីបង្ហាញរឿងរ៉ាវវីដេអូកាន់តែច្បាស់។",
    getStarted: "ចាប់ផ្តើមឥតគិតថ្លៃ",
    starGithub: "ផ្តល់ផ្កាយលើ GitHub",
    badges: {
      free: "ឥតគិតថ្លៃ & កូដចំហ ១០០%",
      browser: "ដំណើរការលើ Browser ភ្លាមៗ",
      local: "រក្សាទុក ១០០% លើម៉ាស៊ីនរបស់អ្នក",
    },
  },
  footer: {
    desc: "កន្លែងធ្វើការសហការវីដេអូទំនើប។ ថត ពង្រីកស្វ័យប្រវត្តិ កាត់តឱ្យស្អាត និងទំនាក់ទំនងកាន់តែច្បាស់។ ឥតគិតថ្លៃ និងកូដចំហ ១០០%។",
    subscribeTitle: "ជាវដំណឹងថ្មីៗអំពីផលិតផល",
    subscribePlaceholder: "បញ្ចូលអ៊ីមែលការងាររបស់អ្នក",
    subscribeBtn: "ចូលរួម",
    subscribedMsg: "អ្នកបានជាវដំណឹងជោគជ័យ!",
    systemStatus: "ប្រព័ន្ធស្ទូឌីយោដំណើរការប្រក្រតីទាំងអស់",
    colProduct: "ផលិតផល",
    colSolutions: "ដំណោះស្រាយ",
    colResources: "ធនធាន",
    colLegal: "ច្បាប់ & ទំនុកចិត្ត",
    overview: "ទិដ្ឋភាពទូទៅ",
    features: "លក្ខណៈពិសេស",
    webStudio: "ស្ទូឌីយោ Web",
    desktopApp: "កម្មវិធី Desktop",
    downloads: "ទាញយក & កំណែទម្រង់",
    docs: "ឯកសារណែនាំ",
    shortcuts: "គ្រាប់ចុចកាត់",
    privacyPolicy: "គោលការណ៍ឯកជនភាព",
    terms: "លក្ខខណ្ឌប្រើប្រាស់",
    security: "សុវត្ថិភាព & ទំនុកចិត្ត",
    rights: "រក្សាសិទ្ធិគ្រប់យ៉ាង។ ឥតគិតថ្លៃ និងកូដចំហក្រោមអាជ្ញាប័ណ្ណ MIT។",
    solutionsList: {
      engineering: "វីដេអូបង្ហាញវិស្វកម្ម",
      design: "ការពិនិត្យការរចនា",
      success: "ជោគជ័យរបស់អតិថិជន",
      standups: "ការប្រជុំ Async Standups",
      sales: "ការលក់ និងផ្សព្វផ្សាយ",
    },
  },
  download: {
    modalTitle: "ទាញយក FucuFlow សម្រាប់កុំព្យូទ័រ",
    modalDesc: "ល្បឿន Native ជាមួយ Hotkeys ថតលឿនពី Tray និងថតអេក្រង់ច្រើនក្នុងពេលតែមួយ។",
    winTitle: "Windows x64",
    macTitle: "macOS (Apple Silicon & Intel)",
    linuxTitle: "Linux (AppImage & deb)",
    downloadNow: "ទាញយកឥឡូវនេះ",
    viewRelease: "កំណត់សម្គាល់កំណែទម្រង់",
  },
  lang: {
    name: "ភាសា",
    enName: "English",
    kmName: "ភាសាខ្មែរ",
    switchLang: "ប្តូរទៅភាសាអង់គ្លេស",
  },
  productPage: {
    badge: "ស្ទូឌីយោវីដេអូកម្រិតខ្ពស់ជំនាន់ថ្មី",
    titleMain: "ឧបករណ៍គ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីបង្កើតវីដេអូ",
    titleHighlight: "កម្រិតស្ទូឌីយោ",
    description: "FucuFlow គឺជាឈុតឧបករណ៍បង្កើតវីដេអូកូដចំហ ទំនើប និងលឿនរហ័ស។ ថតអេក្រង់របស់អ្នក ពង្រីកកាមេរ៉ាស្វ័យប្រវត្តិតាមការចុច កាត់ត Track ច្រើន និងនាំចេញវីដេអូ 4K យ៉ាងច្បាស់ត្រជាក់ភ្នែក ដោយគ្មានជាប់លុយប្រចាំខែ ឬកាតព្វកិច្ច Cloud ឡើយ។",
    launchStudio: "បើកដំណើរការស្ទូឌីយោវិប",
    exploreFeatures: "ស្វែងយល់ពីលក្ខណៈពិសេស",
    pillarsHeader: {
      title: "រចនាឡើងសម្រាប់ល្បឿន ភាពច្បាស់លាស់ និងឯកជនភាព។",
      subtitle: "បង្កើតឡើងតាំងពីគ្រឹះដើម្បីជំនួសកម្មវិធីថតចាស់ៗដែលស្មុគស្មាញ ដោយប្រព័ន្ធដំណើរការលើ Browser និង Desktop ផ្ទាល់។",
    },
    pillars: {
      zoom: {
        title: "ការពង្រីកផ្តោតដោយស្វ័យប្រវត្តិ",
        desc: "តាមដានរាល់ការចុច Mouse និងអន្តរកម្មរបស់អ្នកដោយស្វ័យប្រវត្តិ រួចគណនាចលនាកាមេរ៉ា Catmull-Rom spline យ៉ាងរលូន ដើម្បីឱ្យទស្សនិកជនមិនដែលបាត់បង់ការចាប់អារម្មណ៍។",
        f1: "ការប្រមូលផ្តុំការចុច Mouse ស្វ័យប្រវត្តិ",
        f2: "ការគណនាចំណុចកណ្តាលនៃការផ្តោតអារម្មណ៍",
        f3: "ល្បឿនពង្រីក និងពេលវេលារង់ចាំតាមបំណង",
      },
      privacy: {
        title: "ការផ្ទុកទិន្នន័យលើម៉ាស៊ីន ១០០%",
        desc: "ឯកសារវីដេអូរបស់អ្នកមិនដែលត្រូវបានបង្ហោះទៅកាន់ Cloud ឡើយ។ អ្វីៗទាំងអស់ត្រូវបានថត កាត់ត រក្សាទុក និងនាំចេញដោយផ្ទាល់នៅលើកុំព្យូទ័ររបស់អ្នក។",
        f1: "រក្សាទុកលើថាសរឹង និង IndexedDB",
        f2: "គ្មានការលួចទិន្នន័យ ឬតាមដាន",
        f3: "អនុលោមតាមស្តង់ដារសុវត្ថិភាពសហគ្រាស",
      },
      timeline: {
        title: "បន្ទាត់ពេលវេលាកាត់តច្រើន Track កម្រិតអាជីព",
        desc: "កាត់បំបែកវីដេអូ លុបចន្លោះស្ងាត់ៗ មើលទម្រង់រលកសំឡេង Live និងកំណត់ Keyframe យ៉ាងត្រឹមត្រូវកម្រិតមីលីវិនាទី។",
        f1: "កាត់បំបែក (S) និងលុបបិទចន្លោះ (Shift+Del)",
        f2: "បង្ហាញទម្រង់រលកសំឡេង Live តាម Web Audio",
        f3: "ប្រព័ន្ធស្រូបទាញ Keyframe ជាក់លាក់បំផុត",
      },
    },
  },
  featuresPage: {
    badge: "ស្ថាបត្យកម្មលម្អិត",
    title: "បង្កើតឡើងសម្រាប់អ្នកបង្កើតមាតិកាដែលស្រឡាញ់គុណភាពខ្ពស់។",
    subtitle: "ចាប់ពីចលនាកាមេរ៉ារលូនបែប Spring Physics រហូតដល់ការ Render វីដេអូលើ GPU ផ្ទាល់ សូមស្វែងយល់ពីបច្ចេកវិទ្យាទំនើបរបស់ FucuFlow Studio។",
    deepDives: [
      {
        id: "auto-zoom",
        badge: "បញ្ញាកាមេរ៉ាឆ្លាតវៃ",
        title: "ការពង្រីកផ្តោតស្វ័យប្រវត្តិជាមួយចលនារលូន Catmull-Rom Spline",
        description: "កុំឱ្យអ្នកទស្សនាបាត់បង់ការផ្តោតអារម្មណ៍។ FucuFlow កត់ត្រាកូអរដោនេ Mouse អំឡុងពេលថត ហើយបង្កើតចលនាកាមេរ៉ារលូនបែបភាពយន្តទៅកាន់កន្លែងដែលសកម្មភាពកើតឡើងដោយស្វ័យប្រវត្តិ។",
        highlights: [
          "ការគណនាចំណុចកណ្តាលនៃការផ្តោតសំដៅលើការចុចរបស់អ្នកប្រើប្រាស់",
          "ការប្រមូលផ្តុំការចុចជាប់ៗគ្នា ការពារការកាត់ប្តូរប្លុកៗ",
          "អាចកំណត់ល្បឿនពង្រីក (0.2s - 2.5s) និងកម្រិតពង្រីក (1.2x - 4x)",
        ],
      },
      {
        id: "multi-track",
        badge: "បន្ទាត់ពេលវេលាជាក់លាក់",
        title: "បន្ទាត់ពេលវេលាច្រើន Track & ទម្រង់រលកសំឡេងកម្រិតអាជីព",
        description: "កាត់តការថតអេក្រង់ដោយភាពជាក់លាក់កម្រិតមីលីវិនាទី។ បែងចែក Track ដាច់ដោយឡែកសម្រាប់ វីដេអូ, Keyframe ពង្រីក, សំឡេងនិយាយ និងកាមេរ៉ា Webcam។",
        highlights: [
          "ឧបករណ៍កាត់ (S) និង Ripple Delete (Shift+Del) ដើម្បីបិទចន្លោះទំនេរភ្លាមៗ",
          "បង្ហាញរលកសំឡេងជាក់ស្តែងដំណើរការដោយ Web Audio API",
          "ប្រព័ន្ធស្រូបពេលវេលាម៉ាញេទិចត្រឹមត្រូវកម្រិត SMPTE",
        ],
      },
      {
        id: "3d-transform",
        badge: "ទិដ្ឋភាពជម្រៅ 3D",
        title: "ការបង្វិលមុំ 3D & ទិដ្ឋភាព Spatial",
        description: "ប្រែក្លាយការថតអេក្រង់ធម្មតាទៅជាការបង្ហាញផលិតផលបែបទំនើបអស្ចារ្យ។ បង្វិល ផ្អៀង និងកាច់មុំ Canvas ក្នុងលំហ 3D ជាមួយពន្លឺស្ទូឌីយោពិតៗ។",
        highlights: [
          "គំរូមុំស្រាប់សម្រាប់ Front Studio, Isometric ឆ្វេង/ស្តាំ និង Subtle Float",
          "កែសម្រួលកោងគែម Canvas (0px - 48px) និងគម្លាតខាងក្នុង",
          "ផ្ទាំងខាងក្រោយបែប Mesh Gradient, ផ្ទាំងរូបភាព macOS និងពណ៌ស្ទូឌីយោ",
        ],
      },
      {
        id: "local-storage",
        badge: "ឯកជនភាព ១០០%",
        title: "ការផ្ទុកទិន្នន័យលើឧបករណ៍ & គ្មានការបង្ហោះទៅ Cloud",
        description: "ការថតរបស់អ្នកមិនដែលចាកចេញពីកុំព្យូទ័ររបស់អ្នកឡើយ។ គម្រោងទាំងអស់ត្រូវបានរក្សាទុកដោយផ្ទាល់ក្នុង IndexedDB និងប្រព័ន្ធ File លើកុំព្យូទ័រ។",
        highlights: [
          "គ្មានការបង្ហោះទៅ Cloud ភាគីទីបី ឬ Server ខាងក្រៅឡើយ",
          "មិនបាច់ចុះឈ្មោះ គ្មានការត្រួតពិនិត្យ License ឬបង្ខំទិញ Subscription",
          "ដំណើរការដោយគ្មានអ៊ីនធឺណិតជារៀងរហូត សម្រាប់បរិយាកាសសុវត្ថិភាពខ្ពស់",
        ],
      },
    ],
  },
  solutionsPage: {
    badge: "ដំណោះស្រាយតាមតម្រូវការ",
    title: "រចនាឡើងសម្រាប់រាល់តម្រូវការទំនាក់ទំនងតាមវីដេអូ។",
    subtitle: "ស្វែងយល់ពីរបៀបដែលក្រុមវិស្វកម្ម ការរចនា ជោគជ័យអតិថិជន និងផលិតផលប្រើប្រាស់ FucuFlow ដើម្បីជំនួសការប្រជុំដោយវីដេអូច្បាស់ៗ។",
    solutions: [
      {
        id: "engineering",
        title: "ការបង្ហាញវិស្វកម្ម & ការពិនិត្យកូដ (Code Review)",
        subtitle: "បង្ហាញកូដកំពុងដំណើរការជាក់ស្តែង ដោយមិនបាច់ប្រជុំស្មុគស្មាញ",
        description: "ថតវីដេអូពន្យល់ Pull Request, ពាក្យបញ្ជា Terminal និងការបង្ហាញកំហុស Bug ដោយពង្រីកត្រង់កន្លែងខុសគ្នានៃកូដ (diff) ជួយឱ្យអ្នកពិនិត្យ Approve បានលឿនជាងមុនទ្វេដង។",
        points: [
          "ពង្រីកស្វ័យប្រវត្តិចំទិន្នន័យ Terminal និងបន្ទាត់កូដ",
          "ពន្យល់ស្ថាបត្យកម្មស្មុគស្មាញដោយមិនចាំបាច់មានវត្តមានផ្ទាល់",
          "រក្សាការថតទាំងអស់លើកុំព្យូទ័រអ្នកអភិវឌ្ឍន៍ដោយសុវត្ថិភាព",
        ],
      },
      {
        id: "design",
        title: "ការរិះគន់ការរចនា & ការបង្ហាញគំរូ Prototype",
        subtitle: "បង្ហាញ Figma, Framer និង UI ដោយភាពទាក់ទាញបែបភាពយន្ត",
        description: "ណែនាំដៃគូពាក់ព័ន្ធតាមរយៈ User Flow ជាមួយមុំកាមេរ៉ា 3D រលូន ការពង្រីកលើ Component ជាក់លាក់ និងសំឡេងពន្យល់ច្បាស់ៗ។ ល្អបំផុតសម្រាប់ក្រុម Design ពីចម្ងាយ។",
        points: [
          "កាមេរ៉ារុញទៅកាន់ Component ដែលបានចុចដោយរលូន",
          "ផ្ទៃខាងក្រោយប្ដូរតាមពណ៌ម៉ាកយីហោរបស់អ្នក",
          "នាំចេញកម្រិត 4K ផ្ទាល់សម្រាប់អក្សរច្បាស់ត្រជាក់ភ្នែក",
        ],
      },
      {
        id: "success",
        title: "ជំនួយអតិថិជន & មេរៀនណែនាំអន្តរកម្ម",
        subtitle: "ប្រែក្លាយសំណួរដដែលៗទៅជាចម្លើយវីដេអូដែលយល់ភ្លាមៗ",
        description: "បង្ហាញអតិថិជនឱ្យឃើញច្បាស់ពីប៊ូតុងដែលត្រូវចុច ជាមួយនឹងរង្វង់រលកលើ Mouse និងការចាប់ប្លង់កាមេរ៉ាយ៉ាងស្អាត។ កាត់បន្ថយការផ្ញើអ៊ីមែលឆ្លើយឆ្លងបានដល់ ៧០%។",
        points: [
          "រង្វង់បង្ហាញការចុច Mouse ធ្វើឱ្យការធ្វើតាមកាន់តែងាយស្រួល",
          "កាត់ចោលផ្ទាំងកំពុង Load និងភាពស្ងប់ស្ងាត់យូរៗ",
          "នាំចេញវីដេអូទំហំស្រាល ងាយស្រួលដាក់ក្នុងគេហទំព័រឯកសារ",
        ],
      },
      {
        id: "standups",
        title: "ការប្រជុំ Async Standup & ដំណឹងក្រុមការងារ",
        subtitle: "លុបបំបាត់ការកក់ម៉ោងពេញប្រតិទិន ដោយរក្សាការយល់ដឹងរួមគ្នា",
        description: "បង្ហាញលទ្ធផល Sprint ឬសេចក្តីសង្ខេបការងាររបស់អ្នក ជាមួយកាមេរ៉ាមុខ (PiP) និងការចែករំលែកអេក្រង់។ សមាជិកក្រុមអាចមើលក្នុងល្បឿន 1.5x ឬ 2x តាមពេលវេលាទំនេរ។",
        points: [
          "ថតអេក្រង់ និងកាមេរ៉ាមុខក្នុងពេលតែមួយ",
          "ជួយសមាជិកក្រុមពីភាពនឿយហត់នៃការប្រជុំច្រើនពេក",
          "គ្មានការគិតថ្លៃតាមចំនួនកៅអី សម្រាប់ក្រុមការងារដែលកំពុងរីកចម្រើន",
        ],
      },
      {
        id: "sales",
        title: "ការផ្សព្វផ្សាយផលិតផល & ការលក់",
        subtitle: "ទាក់ទាញអតិថិជនសក្តានុពលដោយវីដេអូបង្ហាញកម្រិតស្ទូឌីយោ",
        description: "លេចធ្លោជាងគេក្នុងប្រអប់សំបុត្រអតិថិជន ជាមួយវីដេអូបង្ហាញផលិតផល 3D ផ្ទាល់ខ្លួន។ បន្ថែមស្រមោលស្ទូឌីយោ ផ្ទៃខាងក្រោយ Gradient និងចលនា 60 FPS យ៉ាងរលូន។",
        points: [
          "ទិដ្ឋភាព 3D ទាក់ទាញភ្នែក បង្កើនការចុចមើលកាន់តែច្រើន",
          "នាំចេញវីដេអូ MP4/WebM ស្រាលលឿន សម្រាប់ផ្ញើតាមអ៊ីមែល",
          "វីដេអូកម្រិតខ្ពស់ ដោយមិនបាច់ជួលក្រុមហ៊ុនកាត់តថ្លៃៗ",
        ],
      },
    ],
  },
  openSourcePage: {
    badge: "កម្មវិធីកូដចំហក្រោមអាជ្ញាប័ណ្ណ MIT",
    titleMain: "ឥតគិតថ្លៃ ១០០% &",
    titleHighlight: "កូដចំហ",
    subtitle: "យើងជឿជាក់ថាកម្មវិធីបង្កើតវីដេអូគួរតែមានលក្ខណៈចំហ មានឯកជនភាព និងអាចប្រើប្រាស់បានសម្រាប់មនុស្សគ្រប់គ្នា។ គ្មានថ្លៃជាវប្រចាំខែ គ្មានការរឹតត្បិតលើការនាំចេញ និងគ្មានការលួចតាមដានឡើយ។",
    githubBtn: "មើលលើ GitHub",
    launchStudio: "បើកស្ទូឌីយោ Web",
    tenetsHeader: {
      title: "បង្កើតឡើងលើគោលការណ៍គ្រឹះចំនួន ៤។",
      subtitle: "របៀបដែល FucuFlow ការពារសេរីភាព ឯកជនភាព និងអធិបតេយ្យភាពរបស់អ្នកប្រើប្រាស់។",
    },
    tenets: [
      {
        title: "អាជ្ញាប័ណ្ណ MIT ដោយសេរី",
        desc: "យកទៅកែច្នៃ បញ្ចូលក្នុងប្រព័ន្ធផ្សេង ធ្វើពាណិជ្ជកម្ម ឬពង្រីកមុខងារ។ ឥតគិតថ្លៃជារៀងរហូតសម្រាប់បុគ្គល ក្រុមហ៊ុន Startup និងសហគ្រាស។",
      },
      {
        title: "ទិន្នន័យលើម៉ាស៊ីន ១០០%",
        desc: "ការថតរបស់អ្នកមិនដែលប៉ះពាល់ Server ខាងក្រៅឡើយ។ វីដេអូទាំងអស់ស្ថិតនៅលើថាសរឹងរបស់អ្នកដោយសុវត្ថិភាព។",
      },
      {
        title: "ជំនួយដោយកម្លាំង Hardware",
        desc: "បង្កើតឡើងដោយផ្ទាល់លើ W3C WebCodecs និង WebGL 2.0 សម្រាប់កម្រិត 60 FPS យ៉ាងរលូនដោយមិនស៊ីកម្លាំង CPU ឡើយ។",
      },
      {
        title: "ដឹកនាំដោយសហគមន៍",
        desc: "កែប្រែ និងអភិវឌ្ឍន៍តាមរយៈ Pull Request ការស្នើសុំមុខងារ និងមតិយោបល់ពីអ្នកបង្កើតមាតិកាទូទាំងពិភពលោក។",
      },
    ],
  },
  resourcesPage: {
    badge: "មជ្ឈមណ្ឌលចំណេះដឹង",
    title: "ឯកសារណែនាំ គ្រាប់ចុចកាត់ និងមេរៀន។",
    subtitle: "ប្រើប្រាស់ FucuFlow Studio ឱ្យស្ទាត់ជំនាញ ជាមួយនឹងគ្រាប់ចុចកាត់រហ័ស ស្ថាបត្យកម្មលម្អិត និងគន្លឹះផលិតវីដេអូ។",
    docsTitle: "ឯកសារសំខាន់ៗ",
    docsSubtitle: "ស្វែងយល់ឱ្យកាន់តែលឿនអំពីដំណើរការវីដេអូលើម៉ាស៊ីនរបស់ FucuFlow។",
    shortcutsTitle: "គ្រាប់ចុចកាត់ (Keyboard Shortcuts)",
    shortcutsSubtitle: "បង្កើនល្បឿននៃការកាត់តរបស់អ្នក ជាមួយនឹងគ្រាប់ចុចកាត់រហ័ស។",
    shortcuts: [
      { key: "Space", label: "ចាក់ / ផ្អាក", desc: "បើក ឬបិទការចាក់វីដេអូនៅលើ Timeline" },
      { key: "S", label: "កាត់បំបែក Segment", desc: "កាត់បំបែក Track វីដេអូត្រង់ចំណុចក្បាលចាក់ (Playhead)" },
      { key: "Shift + Del", label: "Ripple Delete", desc: "លុប Segment ដែលជ្រើសរើស រួចបិទចន្លោះទំនេរដោយស្វ័យប្រវត្តិ" },
      { key: "Z", label: "បន្ថែមការពង្រីក (Zoom)", desc: "បញ្ចូល Keyframe ពង្រីកកាមេរ៉ាត្រង់ទីតាំង Mouse" },
      { key: "Cmd/Ctrl + E", label: "នាំចេញវីដេអូ (Export)", desc: "បើកផ្ទាំងនាំចេញវីដេអូកម្រិត 4K ដោយប្រើ Hardware GPU" },
    ],
    guides: [
      { title: "ការរៀបចំការថត & ការអនុវត្តល្អបំផុត", desc: "របៀបថតសំឡេងប្រព័ន្ធឱ្យច្បាស់ និងការបំបែកសំឡេងមីក្រូហ្វូន។", readTime: "អាន ៤ នាទី" },
      { title: "ការប្រើប្រាស់ចលនាកាមេរ៉ាស្វ័យប្រវត្តិ", desc: "កំណត់រង្វាស់កម្លាំង Catmull-Rom កម្រិតពង្រីក និងការប្រមូលផ្តុំការចុច។", readTime: "អាន ៦ នាទី" },
      { title: "ការកែប្រែផ្ទៃខាងក្រោយ Canvas 3D", desc: "បន្ថែមស៊ុមឧបករណ៍កញ្ចក់ប្លឺ ស្រមោល និងផ្ទាំងរូបភាព Desktop ស្អាតៗ។", readTime: "អាន ៥ នាទី" },
    ],
  },
  aboutPage: {
    badge: "ដំណើររឿងរបស់យើង",
    title: "ផ្តល់អំណាចដល់អ្នកអភិវឌ្ឍន៍ក្នុងការបង្ហាញរឿងរ៉ាវកាន់តែច្បាស់។",
    subtitle: "FucuFlow ត្រូវបានបង្កើតឡើងដោយជំនឿសាមញ្ញមួយ៖ ការបង្កើតវីដេអូគុណភាពខ្ពស់គួរតែលឿន មានឯកជនភាព និងគ្មានការគិតលុយប្រចាំខែឡើយ។",
    principlesHeader: "គោលការណ៍វិស្វកម្មស្នូល",
    principles: [
      {
        title: "ដំណើរការលើម៉ាស៊ីន & ឯកជនភាព ១០០%",
        badge: "គ្មាន Cloud",
        description: "ការថតអេក្រង់របស់អ្នកមិនដែលប៉ះពាល់ Server លើ Cloud ឡើយ។ ការដំណើរការវីដេអូ ការពង្រីក និងការ Render ដំណើរការទាំងស្រុងលើម៉ាស៊ីនរបស់អ្នកតាមរយៈ IndexedDB និង GPU Shaders។",
      },
      {
        title: "ជំនួយដោយ Hardware WebCodecs",
        badge: "ស្នូល 60 FPS",
        description: "បង្កើតឡើងលើស្តង់ដារ W3C WebCodecs និង WebGL 2.0 ដើម្បីផ្តល់នូវការ Render 4K ក្នុងពេលជាក់ស្តែងយ៉ាងរលូន ដោយមិនស៊ីថ្ម ឬកម្លាំងម៉ាស៊ីនឡើយ។",
      },
      {
        title: "ចលនាកាមេរ៉ាផ្តោតឆ្លាតវៃ",
        badge: "ចលនា Spring",
        description: "ខ្សែកោង Catmull-Rom Spline ជាមួយចលនា Spring Physics ជួយរុញកាមេរ៉ាទៅកាន់សកម្មភាពរបស់អ្នកប្រើប្រាស់យ៉ាងរលូន ដោយគ្មានការកាត់ប្តូរប្លុកៗឡើយ។",
      },
      {
        title: "កូដចំហក្រោមអាជ្ញាប័ណ្ណ MIT",
        badge: "ឥតគិតថ្លៃជារៀងរហូត",
        description: "កូដគ្រប់បន្ទាត់ត្រូវបានបើកចំហនៅលើ GitHub។ គ្មានការបិទសិទ្ធិ គ្មានការទាមទារលុយ និងគ្មានកម្មវិធីលួចតាមដាន។ បង្កើតដោយអ្នកអភិវឌ្ឍន៍ សម្រាប់អ្នកបង្កើតមាតិកា។",
      },
    ],
    storyHeader: "ចក្ខុវិស័យនៅពីក្រោយ FucuFlow",
    storyP1: "កម្មវិធីកាត់តវីដេអូបុរាណត្រូវបានបង្កើតឡើងរាប់សិបឆ្នាំមុនសម្រាប់ផលិតករភាពយន្តហូលីវូដ ដែលធ្វើឱ្យវាស្មុគស្មាញខ្លាំងសម្រាប់វិស្វករសូហ្វវែរ អ្នករចនាផលិតផល និងអ្នកបង្កើតមាតិកាដែលគ្រាន់តែចង់បង្ហាញស្នាដៃរបស់ពួកគេ។",
    storyP2: "FucuFlow លុបបំបាត់ភាពស្មុគស្មាញទាំងអស់ ហើយផ្តោតលើអ្វីដែលធ្វើឱ្យវីដេអូផលិតផលមើលទៅអស្ចារ្យបំផុត៖ ការពង្រីកស្វ័យប្រវត្តិតាម Mouse មុំផ្អៀង 3D ស្រមោលស្អាតៗ និងការនាំចេញវីដេអូភ្លាមៗលើកាត GPU។",
  },
  contactPage: {
    badge: "ទំនាក់ទំនងមកយើង",
    title: "យើងរីករាយនឹងទទួលដំណឹងពីអ្នក។",
    subtitle: "មានសំណួរ សំណើមុខងារថ្មី ឬមតិយោបល់សុវត្ថិភាព? សូមទាក់ទងមកកាន់សហគមន៍ និងអ្នកអភិវឌ្ឍន៍ FucuFlow។",
    form: {
      name: "ឈ្មោះរបស់អ្នក",
      namePlaceholder: "វ៉ា អេរិក",
      email: "អាសយដ្ឋានអ៊ីមែល",
      emailPlaceholder: "you@company.com",
      category: "ប្រភេទសំណួរ",
      categoryOptions: {
        general: "សំណួរទូទៅ",
        bug: "រាយការណ៍កំហុស (Bug Report)",
        feature: "ស្នើសុំមុខងារថ្មី (Feature Request)",
        security: "សុវត្ថិភាព និងការត្រួតពិនិត្យ",
      },
      message: "សាររបស់អ្នក",
      messagePlaceholder: "ប្រាប់យើងអំពីគម្រោង ឬការផ្ដល់យោបល់របស់អ្នក...",
      sendBtn: "ផ្ញើសារ",
      sentSuccess: "សូមអរគុណ! សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។",
    },
    info: {
      emailTitle: "អ៊ីមែលផ្ទាល់",
      emailDesc: "ផ្ញើមតិយោបល់ ឬសំណួរផ្ទាល់ទៅកាន់អ្នកថែទាំគម្រោង។",
      githubTitle: "GitHub Issues & Discussions",
      githubDesc: "រាយការណ៍កំហុស បញ្ជូន Pull Request និងពិភាក្សាអំពីមុខងារថ្មីៗ។",
      securityTitle: "សុវត្ថិភាព និងសវនកម្ម",
      securityDesc: "របាយការណ៍ភាពងាយរងគ្រោះសម្ងាត់ និងសំណួរស្ថាបត្យកម្ម។",
    },
  },
  downloadPage: {
    badge: "ល្បឿន Native ខ្ពស់បំផុត",
    title: "ទាញយក FucuFlow សម្រាប់កុំព្យូទ័រ",
    subtitle: "កាន់តែមានថាមពលជាមួយការរួមបញ្ចូលប្រព័ន្ធប្រតិបត្តិការ Native, ការថតពី System Tray, គ្រាប់ចុចកាត់ និងការថតអេក្រង់ច្រើនសម្រាប់ Windows, Mac និង Linux។",
    platforms: {
      win: {
        title: "Windows 10 / 11",
        desc: "កម្មវិធីដំឡើង 64-bit (.exe) ជាមួយជំនួយល្បឿនក្រាហ្វិក DirectX។",
        btn: "ទាញយកសម្រាប់ Windows (.exe)",
      },
      mac: {
        title: "macOS Universal",
        desc: "កម្មវិធីដំឡើង Apple Silicon (M1/M2/M3/M4) និង Intel (.dmg) ជាមួយ Metal GPU។",
        btn: "ទាញយកសម្រាប់ Mac (.dmg)",
      },
      linux: {
        title: "Linux Standalone",
        desc: "កញ្ចប់ Universal AppImage & Debian (.deb) ជាមួយជំនួយ Wayland។",
        btn: "ទាញយកសម្រាប់ Linux (.AppImage)",
      },
    },
    webStudioTitle: "ចង់ប្រើប្រាស់ដោយមិនចាំបាច់ដំឡើង?",
    webStudioDesc: "FucuFlow ដំណើរការជាមួយមុខងារពេញលេញ ១០០% ដោយផ្ទាល់នៅលើ Browser Chromium ទំនើប (Chrome, Edge, Brave)។",
    webStudioBtn: "បើកស្ទូឌីយោ Web ភ្លាមៗ",
  },
};

export const translations: Record<Locale, Translations> = {
  en,
  km,
  kh: km,
};
