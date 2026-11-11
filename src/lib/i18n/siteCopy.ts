// Copy for the redesigned marketing site. Kept apart from translations.ts so
// the website's words can be edited without touching the app's strings.
import type { Locale } from "@/lib/i18n/translations";

interface TitleBody { title: string; body: string }

export interface SiteCopy {
  nav: { features: string; download: string; about: string; resources: string; github: string; openStudio: string; signIn: string; menu: string; main: string };
  home: {
    title: string; lead: string; openStudio: string; downloadApp: string;
    stageLabel: string; noGl: string; play: string; pause: string; of: string;
    scrubLabel: string; scrubHint: string; marks: string[];
    movesTitle: string; moves: TitleBody[];
    stepsTitle: string; steps: TitleBody[];
    agentTitle: string; agentBody: string; agentLink: string; agentAsk: string; agentPrompts: string[];
    localTitle: string; localBody: string; localFacts: TitleBody[];
    faqTitle: string; faqs: { q: string; a: string }[];
    closing: string;
  };
  features: {
    title: string; lead: string; tryTitle: string; movesLabel: string;
    moves: { label: string; note: string }[];
    groups: { title: string; body: string; items: string[] }[];
    closing: string;
  };
  download: {
    title: string; lead: string; computer: string; installer: string; size: string; get: string;
    macHint: string; studioTitle: string; studioBody: string; newTitle: string; older: string;
    platforms: Record<"win" | "macArm" | "macIntel" | "linux" | "deb" | "rpm", string>;
    kinds: Record<"exe" | "msi" | "dmg" | "appimage" | "deb" | "rpm", string>;
  };
  about: {
    title: string; story: string[]; maintainer: string; principles: TitleBody[];
    openTitle: string; openBody: string; viewSource: string;
    contactTitle: string; contactLead: string;
    emailTitle: string; emailBody: string; discussTitle: string; discussBody: string; discussLink: string;
    form: {
      name: string; email: string; topic: string; topics: string[]; message: string;
      send: string; sending: string; sent: string;
      needName: string; needEmail: string; badEmail: string; needMessage: string;
    };
  };
  resources: { title: string; lead: string; shortcutsTitle: string; key: string; action: string; guidesTitle: string };
  footer: { blurb: string; product: string; project: string; aboutContact: string; source: string; releases: string };
}

const en: SiteCopy = {
  nav: { features: "Features", download: "Download", about: "About", resources: "Resources", github: "GitHub", openStudio: "Open the studio", signIn: "Sign in", menu: "Menu", main: "Main" },
  home: {
    title: "Give your screen recording a camera.",
    lead: "FucuFlow turns a flat capture into a filmed one. The camera pushes in on every click, tilts in 3D and follows your cursor. It is free, open source, and renders on your own machine.",
    openStudio: "Open the studio",
    downloadApp: "Download the desktop app",
    stageLabel: "A screen recording of a web app, seen through a moving 3D camera that zooms to each click",
    noGl: "The 3D preview needs WebGL, which is switched off in this browser.",
    play: "Play", pause: "Pause", of: "of",
    scrubLabel: "Scrub the camera move",
    scrubHint: "Drag the playhead. Each orange diamond is a zoom keyframe, placed where the cursor clicked.",
    marks: ["Wide shot", "Push in on a click", "Tilt across", "Follow down the page", "Pull back"],
    movesTitle: "What the camera does while you get on with the demo",
    moves: [
      { title: "Pushes in on every click", body: "FucuFlow logs where you click as you record, then glides the camera to that spot. Clicks that come in a burst are grouped, so the shot never jitters." },
      { title: "Tilts and dollies in 3D", body: "Pitch, yaw and rotate the recording in real perspective. Start from a preset such as Front Studio, Isometric 3D or Filmic Slant, or set the angle yourself." },
      { title: "Keeps you in the frame", body: "Your webcam rides along as a circle, rounded square or square. A live audio meter shows the microphone is picking you up before you start talking." },
    ],
    stepsTitle: "From capture to finished video",
    steps: [
      { title: "Record", body: "Capture your full screen, one window or a browser tab, with system audio and your microphone." },
      { title: "Set the moves", body: "Your clicks arrive on the timeline as zoom keyframes. Drag them, change the hold time, set the zoom from 1.2× to 4×, or add your own." },
      { title: "Render", body: "Export the video on your own hardware. Save it to any folder, or send it to your own Google Drive." },
    ],
    agentTitle: "Or describe the edit and let an agent make it",
    agentBody: "Connect Gemini, OpenAI, Claude or a local Ollama model with your own key, then direct the edit in plain language. Agents that run outside the app, such as Claude Desktop and Cursor, can drive FucuFlow through its MCP server.",
    agentLink: "See what the agent can control",
    agentAsk: "Things people ask it",
    agentPrompts: [
      "Analyze my video duration and place 4 dynamic 3D zoom keyframes focused on key action points.",
      "Reformat this project for Reels: set the aspect ratio to 9:16.",
      "Apply a vivid cinematic color grade with a warm amber temperature.",
    ],
    localTitle: "Your recording stays on your machine",
    localBody: "Most recording tools upload your screen to their servers before you can edit it. FucuFlow does the editing, the camera work and the export on the computer in front of you.",
    localFacts: [
      { title: "No cloud storage", body: "Video and audio are kept on your local disk. Nothing is sent anywhere unless you connect your own Google Drive." },
      { title: "Works offline", body: "Editing, camera animation and export all run without an internet connection." },
      { title: "Runs on your GPU", body: "Rendering and encoding are hardware accelerated, so a short demo exports in moments." },
      { title: "Open to inspection", body: "The whole source is on GitHub under the MIT licence. No watermark and no subscription." },
    ],
    faqTitle: "Questions people ask first",
    faqs: [
      { q: "Do my recordings get uploaded anywhere?", a: "No. Recording, zoom processing and export all happen on your device, and the files stay on your disk. The one exception is Google Drive, and only if you connect your own account and choose to save there." },
      { q: "How does the automatic zoom decide where to look?", a: "It tracks your cursor and clicks over time, groups clicks that happen close together, and moves the camera along a smooth curve with spring easing, so there are no hard cuts. Every keyframe it places can be moved or removed." },
      { q: "Is there a desktop app?", a: "Yes. Alongside the studio that runs in your browser, there are installers for Windows, macOS on Apple Silicon and Intel, and Linux." },
      { q: "What does it cost?", a: "Nothing. FucuFlow is MIT licensed, with every feature included and no watermark on exports." },
    ],
    closing: "Record once. Zoom anywhere.",
  },
  features: {
    title: "A camera, a timeline and an export, all on your own machine",
    lead: "FucuFlow does one job: it takes a screen recording you already made and films it. This page lists everything it gives you to do that.",
    tryTitle: "Try the camera moves",
    movesLabel: "Camera move",
    moves: [
      { label: "Wide shot", note: "The whole recording, tilted a little so it reads as an object in a room and not a flat rectangle." },
      { label: "Push in on a click", note: "The cursor lands on a button and the camera closes in on it. This is the move FucuFlow adds for you at every click." },
      { label: "Tilt across", note: "The camera swings to the far side of the screen and looks back across it, which gives a chart or a panel some depth." },
      { label: "Follow down the page", note: "A low angle that tracks the cursor to a row further down, keeping the webcam bubble in view." },
      { label: "Pull back", note: "Back out to the full screen to close the scene, from the opposite side to where it began." },
    ],
    groups: [
      { title: "Automatic zoom", body: "FucuFlow records where your mouse goes and builds smooth camera moves to wherever the action happens.", items: ["The focal point is worked out from your clicks and cursor path", "Bursts of clicks are grouped into one move, so the camera never jumps", "Hold time, zoom speed from 0.2 to 2.5 seconds, and scale from 1.2× to 4× are yours to set"] },
      { title: "Multi-track timeline", body: "Separate tracks for video, zoom keyframes, voiceover and webcam, so one edit never disturbs another.", items: ["Split a clip with S, and ripple delete with Shift and Delete to close the gap", "Audio waveforms drawn as you edit", "Step through the video one frame at a time"] },
      { title: "3D stage and framing", body: "Rotate, pitch and yaw the recording in real perspective, then dress the frame around it.", items: ["Angle presets: Simple Smooth, Front Studio, Breathing Tilt, Isometric 3D and Filmic Slant", "Corner radius from 0 to 48 pixels, with gradient, solid, image or transparent backdrops", "Webcam picture-in-picture as a circle, rounded square or square", "Cursor overlays and click ripples that make small pointer movements easy to follow"] },
      { title: "Local storage and export", body: "Projects live on your disk and render on your hardware.", items: ["Hardware-accelerated export at 1080p, 2K or 4K, with no watermark", "Choose the save folder before or after rendering", "Optional upload to your own Google Drive, with a link you can share", "Everything keeps working with no internet connection"] },
      { title: "AI agent and MCP", body: "Describe the edit in plain language, inside the app or from an agent you already use.", items: ["An in-app copilot that works with your own Gemini, OpenAI or Claude key, or a local Ollama model", "An MCP server for Claude Desktop, Cursor and other agents", "14 tools the agent can call, covering zoom keyframes, vertical reformatting, canvas styling and trimming"] },
    ],
    closing: "Try it on a recording of your own",
  },
  download: {
    title: "Download FucuFlow",
    lead: "Version {version}, released on {date}. Every installer is free under the MIT licence and includes every feature.",
    computer: "Your computer", installer: "Installer", size: "Size", get: "Download",
    macHint: "Not sure which Mac you have? Open the Apple menu and choose About This Mac. A chip named M1 or later means Apple Silicon.",
    studioTitle: "Or use it in your browser",
    studioBody: "The studio also runs in a modern Chromium browser with nothing to install. Your recording is still edited and rendered on your own computer.",
    newTitle: "New in {version}",
    older: "Earlier versions and full release notes",
    platforms: { win: "Windows 10 and 11, 64-bit", macArm: "macOS, Apple Silicon", macIntel: "macOS, Intel", linux: "Linux, 64-bit", deb: "Linux, Debian and Ubuntu", rpm: "Linux, Fedora and RHEL" },
    kinds: { exe: "Setup program (.exe)", msi: "MSI package, for managed installs", dmg: "Disk image (.dmg)", appimage: "AppImage, runs on most distributions", deb: "Package (.deb)", rpm: "Package (.rpm)" },
  },
  about: {
    title: "Video editors were built for film crews. FucuFlow is for people showing their software.",
    story: [
      "Traditional editing software was designed decades ago for filmmakers. That makes it far more than an engineer, a designer or a teacher needs when all they want is to show what they built.",
      "FucuFlow leaves that out and keeps what makes a product video easy to watch: zooms that land where the action is, a recording that sits in 3D space, and an export that finishes on your own GPU.",
    ],
    maintainer: "FucuFlow is written and maintained by Eric Va.",
    principles: [
      { title: "Local and private", body: "Your screen captures never reach a server. Processing, zooming and rendering happen on your machine." },
      { title: "Fast on ordinary hardware", body: "Rendering runs on your GPU, so a laptop is enough to export a demo." },
      { title: "Camera moves without cuts", body: "The virtual camera follows a smooth curve with spring easing, so it glides between points and never snaps." },
      { title: "Free, with the source open", body: "Every line is on GitHub under the MIT licence. Fork it, extend it or ship it inside your own product." },
    ],
    openTitle: "Open source under the MIT licence",
    openBody: "There is no subscription and no export limit. Bug reports, feature requests and pull requests all happen in the open on GitHub.",
    viewSource: "View the source on GitHub",
    contactTitle: "Get in touch",
    contactLead: "Questions, feature ideas and bug reports are all welcome. Pick whichever route suits what you have to say.",
    emailTitle: "Email",
    emailBody: "For anything private, including security reports.",
    discussTitle: "GitHub Discussions",
    discussBody: "For bugs and feature requests that other people may share.",
    discussLink: "Open a discussion",
    form: {
      name: "Your name", email: "Email address", topic: "What is it about?",
      topics: ["A general question", "A bug", "A feature request", "A security concern"],
      message: "Message", send: "Send message", sending: "Sending",
      sent: "Message sent. Thank you, you will get a reply by email.",
      needName: "Enter your name.", needEmail: "Enter your email address.", badEmail: "That email address does not look right. Check it and try again.", needMessage: "Write a message before sending.",
    },
  },
  resources: { title: "Shortcuts and guides", lead: "The keys worth learning first, and short guides to getting a clean recording.", shortcutsTitle: "Keyboard shortcuts", key: "Key", action: "What it does", guidesTitle: "Guides" },
  footer: { blurb: "A post-processing studio that gives screen recordings a 3D camera. Made by Eric Va and released under the MIT licence.", product: "Product", project: "Project", aboutContact: "About and contact", source: "Source on GitHub", releases: "Release notes" },
};

const km: SiteCopy = {
  nav: { features: "មុខងារ", download: "ទាញយក", about: "អំពី", resources: "ធនធាន", github: "GitHub", openStudio: "បើកស្ទូឌីយោ", signIn: "ចូលគណនី", menu: "ម៉ឺនុយ", main: "ម៉ឺនុយចម្បង" },
  home: {
    title: "ផ្តល់កាមេរ៉ាឱ្យវីដេអូថតអេក្រង់របស់អ្នក។",
    lead: "FucuFlow ប្រែវីដេអូថតអេក្រង់រាបស្មើ ឱ្យក្លាយជាវីដេអូដែលមានចលនាកាមេរ៉ា។ កាមេរ៉ាពង្រីកចូលរាល់ពេលចុច ផ្អៀងជា 3D និងដើរតាម Cursor របស់អ្នក។ វាឥតគិតថ្លៃ ជា Open Source ហើយ Render នៅលើកុំព្យូទ័ររបស់អ្នកផ្ទាល់។",
    openStudio: "បើកស្ទូឌីយោ",
    downloadApp: "ទាញយកកម្មវិធី Desktop",
    stageLabel: "វីដេអូថតអេក្រង់នៃ Web App ដែលមើលតាមកាមេរ៉ា 3D ផ្លាស់ទី និងពង្រីកទៅកាន់ការចុចនីមួយៗ",
    noGl: "ការបង្ហាញ 3D ត្រូវការ WebGL ដែលបានបិទនៅក្នុង Browser នេះ។",
    play: "ចាក់", pause: "ផ្អាក", of: "នៃ",
    scrubLabel: "អូសដើម្បីរំកិលចលនាកាមេរ៉ា",
    scrubHint: "អូសក្បាលចាក់។ ពេជ្រពណ៌ទឹកក្រូចនីមួយៗ គឺជា Zoom Keyframe ដែលដាក់ត្រង់កន្លែង Cursor បានចុច។",
    marks: ["ទិដ្ឋភាពទូលាយ", "ពង្រីកចូលពេលចុច", "ផ្អៀងឆ្លងអេក្រង់", "តាមចុះក្រោម", "ដកថយមកវិញ"],
    movesTitle: "អ្វីដែលកាមេរ៉ាធ្វើ ខណៈអ្នកបន្តបង្ហាញការងាររបស់អ្នក",
    moves: [
      { title: "ពង្រីកចូលរាល់ពេលចុច", body: "FucuFlow កត់ត្រាកន្លែងដែលអ្នកចុចពេលកំពុងថត រួចរំកិលកាមេរ៉ាទៅកន្លែងនោះយ៉ាងរលូន។ ការចុចញាប់ៗជាប់គ្នា ត្រូវបានដាក់ជាក្រុមតែមួយ ដូច្នេះរូបភាពមិនញ័រឡើយ។" },
      { title: "ផ្អៀង និងរំកិលជា 3D", body: "បង្វិល និងផ្អៀងវីដេអូក្នុង Perspective ពិតប្រាកដ។ ចាប់ផ្តើមពី Preset ដូចជា Front Studio, Isometric 3D ឬ Filmic Slant ឬកំណត់មុំដោយខ្លួនឯង។" },
      { title: "រក្សាអ្នកឱ្យនៅក្នុងរូបភាព", body: "Webcam របស់អ្នកបង្ហាញជារង្វង់ ការ៉េជ្រុងមូល ឬការ៉េ។ រង្វាស់សំឡេងផ្ទាល់បង្ហាញថា Microphone កំពុងចាប់សំឡេងអ្នក មុនពេលអ្នកចាប់ផ្តើមនិយាយ។" },
    ],
    stepsTitle: "ពីការថត រហូតដល់វីដេអូរួចរាល់",
    steps: [
      { title: "ថត", body: "ថតអេក្រង់ទាំងមូល Window មួយ ឬ Tab របស់ Browser ជាមួយសំឡេងប្រព័ន្ធ និង Microphone របស់អ្នក។" },
      { title: "កំណត់ចលនា", body: "ការចុចរបស់អ្នកបង្ហាញនៅលើ Timeline ជា Zoom Keyframe។ អូសវា ប្តូររយៈពេលសម្រាក កំណត់ការពង្រីកពី 1.2× ដល់ 4× ឬបន្ថែមថ្មីដោយខ្លួនឯង។" },
      { title: "Render", body: "Export វីដេអូនៅលើ Hardware របស់អ្នកផ្ទាល់។ រក្សាទុកក្នុង Folder ណាក៏បាន ឬបញ្ជូនទៅ Google Drive ផ្ទាល់ខ្លួន។" },
    ],
    agentTitle: "ឬពណ៌នាអំពីការកាត់ត ហើយឱ្យ Agent ធ្វើជំនួស",
    agentBody: "ភ្ជាប់ Gemini, OpenAI, Claude ឬ Model Ollama ក្នុងកុំព្យូទ័រ ដោយប្រើ Key របស់អ្នកផ្ទាល់ រួចបញ្ជាការកាត់តជាភាសាធម្មតា។ Agent ខាងក្រៅដូចជា Claude Desktop និង Cursor អាចបញ្ជា FucuFlow តាមរយៈ MCP Server។",
    agentLink: "មើលអ្វីដែល Agent អាចបញ្ជាបាន",
    agentAsk: "អ្វីដែលគេតែងសុំឱ្យវាធ្វើ",
    agentPrompts: [
      "វិភាគរយៈពេលវីដេអូរបស់ខ្ញុំ ហើយដាក់ 3D Zoom Keyframe ចំនួន 4 ត្រង់ចំណុចសកម្មភាពសំខាន់ៗ។",
      "រៀបចំគម្រោងនេះសម្រាប់ Reels៖ កំណត់ Aspect Ratio ទៅ 9:16។",
      "ដាក់ Color Grade បែបភាពយន្តរស់រវើក ជាមួយសីតុណ្ហភាពពណ៌លឿងទុំកក់ក្តៅ។",
    ],
    localTitle: "វីដេអូរបស់អ្នកនៅលើកុំព្យូទ័ររបស់អ្នក",
    localBody: "កម្មវិធីថតអេក្រង់ភាគច្រើន Upload អេក្រង់របស់អ្នកទៅ Server របស់គេ មុនពេលអ្នកអាចកាត់តបាន។ FucuFlow ធ្វើការកាត់ត ចលនាកាមេរ៉ា និង Export នៅលើកុំព្យូទ័រដែលនៅពីមុខអ្នក។",
    localFacts: [
      { title: "គ្មានការរក្សាទុកលើ Cloud", body: "វីដេអូ និងសំឡេងរក្សាទុកនៅលើ Disk របស់អ្នក។ គ្មានអ្វីត្រូវបានបញ្ជូនទៅណាឡើយ លុះត្រាតែអ្នកភ្ជាប់ Google Drive ផ្ទាល់ខ្លួន។" },
      { title: "ដំណើរការ Offline", body: "ការកាត់ត ចលនាកាមេរ៉ា និង Export ដំណើរការបានទាំងអស់ដោយគ្មានអ៊ីនធឺណិត។" },
      { title: "ដំណើរការលើ GPU របស់អ្នក", body: "ការ Render និង Encode ប្រើ Hardware Acceleration ដូច្នេះវីដេអូខ្លីមួយ Export បានក្នុងពេលមួយភ្លែត។" },
      { title: "បើកចំហឱ្យពិនិត្យ", body: "Source Code ទាំងអស់នៅលើ GitHub ក្រោមអាជ្ញាបណ្ណ MIT។ គ្មាន Watermark និងគ្មានការជាវប្រចាំខែ។" },
    ],
    faqTitle: "សំណួរដែលគេសួរដំបូង",
    faqs: [
      { q: "តើវីដេអូរបស់ខ្ញុំត្រូវបាន Upload ទៅណាដែរឬទេ?", a: "ទេ។ ការថត ការគណនា Zoom និង Export សុទ្ធតែធ្វើនៅលើឧបករណ៍របស់អ្នក ហើយឯកសារនៅលើ Disk របស់អ្នក។ ករណីលើកលែងតែមួយគឺ Google Drive ហើយតែពេលអ្នកភ្ជាប់គណនីផ្ទាល់ខ្លួន និងជ្រើសរក្សាទុកនៅទីនោះប៉ុណ្ណោះ។" },
      { q: "តើ Zoom ស្វ័យប្រវត្តិសម្រេចថាត្រូវមើលកន្លែងណា ដោយរបៀបណា?", a: "វាតាមដាន Cursor និងការចុចរបស់អ្នកតាមពេលវេលា ដាក់ការចុចដែលនៅជិតគ្នាជាក្រុម ហើយរំកិលកាមេរ៉ាតាមខ្សែកោងរលូនជាមួយ Spring Easing ដូច្នេះគ្មានការកាត់ផ្តាច់ភ្លាមៗឡើយ។ Keyframe ទាំងអស់ដែលវាដាក់ អាចរំកិល ឬលុបបាន។" },
      { q: "តើមានកម្មវិធី Desktop ដែរឬទេ?", a: "មាន។ ក្រៅពីស្ទូឌីយោដែលដំណើរការក្នុង Browser មានកម្មវិធីដំឡើងសម្រាប់ Windows, macOS (Apple Silicon និង Intel) និង Linux។" },
      { q: "តើវាថ្លៃប៉ុន្មាន?", a: "ឥតគិតថ្លៃ។ FucuFlow ប្រើអាជ្ញាបណ្ណ MIT មានមុខងារទាំងអស់ និងគ្មាន Watermark លើវីដេអូ Export។" },
    ],
    closing: "ថតម្តង។ ពង្រីកបានគ្រប់កន្លែង។",
  },
  features: {
    title: "កាមេរ៉ា Timeline និង Export ទាំងអស់នៅលើកុំព្យូទ័ររបស់អ្នក",
    lead: "FucuFlow ធ្វើការងារតែមួយ៖ យកវីដេអូថតអេក្រង់ដែលអ្នកមានស្រាប់ មកថតវាឡើងវិញដោយកាមេរ៉ា។ ទំព័រនេះរាយអ្វីៗទាំងអស់ដែលវាផ្តល់ឱ្យអ្នកសម្រាប់ការងារនោះ។",
    tryTitle: "សាកល្បងចលនាកាមេរ៉ា",
    movesLabel: "ចលនាកាមេរ៉ា",
    moves: [
      { label: "ទិដ្ឋភាពទូលាយ", note: "វីដេអូទាំងមូល ផ្អៀងបន្តិច ដើម្បីឱ្យមើលទៅដូចវត្ថុនៅក្នុងបន្ទប់ មិនមែនជាចតុកោណរាបស្មើ។" },
      { label: "ពង្រីកចូលពេលចុច", note: "Cursor ទៅដល់ប៊ូតុងមួយ ហើយកាមេរ៉ាចូលទៅជិតវា។ នេះជាចលនាដែល FucuFlow បន្ថែមឱ្យអ្នករាល់ពេលចុច។" },
      { label: "ផ្អៀងឆ្លងអេក្រង់", note: "កាមេរ៉ាបង្វិលទៅម្ខាងទៀតនៃអេក្រង់ ហើយមើលត្រឡប់មកវិញ ដែលផ្តល់ជម្រៅដល់ក្រាហ្វ ឬផ្ទាំងមួយ។" },
      { label: "តាមចុះក្រោម", note: "មុំទាបដែលតាម Cursor ទៅជួរខាងក្រោម ដោយរក្សារង្វង់ Webcam ឱ្យនៅក្នុងរូបភាព។" },
      { label: "ដកថយមកវិញ", note: "ត្រឡប់មកមើលអេក្រង់ទាំងមូលដើម្បីបិទឈុត ពីម្ខាងផ្ទុយនឹងកន្លែងចាប់ផ្តើម។" },
    ],
    groups: [
      { title: "Zoom ស្វ័យប្រវត្តិ", body: "FucuFlow កត់ត្រាដំណើរ Mouse របស់អ្នក ហើយបង្កើតចលនាកាមេរ៉ារលូនទៅកន្លែងដែលមានសកម្មភាព។", items: ["ចំណុច Focus គណនាពីការចុច និងផ្លូវ Cursor របស់អ្នក", "ការចុចញាប់ៗត្រូវដាក់ជាចលនាតែមួយ ដូច្នេះកាមេរ៉ាមិនលោតឡើយ", "រយៈពេលសម្រាក ល្បឿន Zoom ពី 0.2 ដល់ 2.5 វិនាទី និងទំហំពី 1.2× ដល់ 4× អ្នកអាចកំណត់បាន"] },
      { title: "Timeline ច្រើន Track", body: "Track ដាច់ដោយឡែកសម្រាប់វីដេអូ Zoom Keyframe សំឡេង និង Webcam ដូច្នេះការកែមួយមិនប៉ះពាល់ដល់មួយទៀត។", items: ["កាត់ Clip ដោយចុច S និង Ripple Delete ដោយ Shift និង Delete ដើម្បីបិទចន្លោះ", "Waveform សំឡេងបង្ហាញខណៈអ្នកកែ", "រំកិលវីដេអូម្តងមួយ Frame"] },
      { title: "ឆាក 3D និងស៊ុម", body: "បង្វិល និងផ្អៀងវីដេអូក្នុង Perspective ពិត រួចតុបតែងស៊ុមជុំវិញវា។", items: ["Preset មុំ៖ Simple Smooth, Front Studio, Breathing Tilt, Isometric 3D និង Filmic Slant", "កាំជ្រុងពី 0 ដល់ 48 Pixel ជាមួយផ្ទៃខាងក្រោយ Gradient ពណ៌តែមួយ រូបភាព ឬថ្លា", "Webcam Picture-in-Picture ជារង្វង់ ការ៉េជ្រុងមូល ឬការ៉េ", "Cursor Overlay និងរលកពេលចុច ដែលធ្វើឱ្យចលនា Pointer តូចៗងាយមើលតាម"] },
      { title: "រក្សាទុកក្នុងម៉ាស៊ីន និង Export", body: "គម្រោងនៅលើ Disk របស់អ្នក ហើយ Render លើ Hardware របស់អ្នក។", items: ["Export ដោយ Hardware Acceleration កម្រិត 1080p, 2K ឬ 4K ដោយគ្មាន Watermark", "ជ្រើស Folder រក្សាទុក មុន ឬក្រោយពេល Render", "ជម្រើស Upload ទៅ Google Drive ផ្ទាល់ខ្លួន ជាមួយ Link សម្រាប់ចែករំលែក", "អ្វីៗទាំងអស់នៅតែដំណើរការដោយគ្មានអ៊ីនធឺណិត"] },
      { title: "AI Agent និង MCP", body: "ពណ៌នាការកាត់តជាភាសាធម្មតា នៅក្នុងកម្មវិធី ឬពី Agent ដែលអ្នកប្រើស្រាប់។", items: ["Copilot ក្នុងកម្មវិធី ដែលប្រើ Key Gemini, OpenAI ឬ Claude របស់អ្នក ឬ Model Ollama ក្នុងកុំព្យូទ័រ", "MCP Server សម្រាប់ Claude Desktop, Cursor និង Agent ផ្សេងទៀត", "ឧបករណ៍ 14 ដែល Agent អាចហៅប្រើ រួមមាន Zoom Keyframe ការប្តូរទៅវីដេអូបញ្ឈរ ការតុបតែង Canvas និងការកាត់"] },
    ],
    closing: "សាកល្បងជាមួយវីដេអូរបស់អ្នកផ្ទាល់",
  },
  download: {
    title: "ទាញយក FucuFlow",
    lead: "កំណែ {version} ចេញផ្សាយថ្ងៃទី {date}។ កម្មវិធីដំឡើងទាំងអស់ឥតគិតថ្លៃក្រោមអាជ្ញាបណ្ណ MIT និងមានមុខងារពេញលេញ។",
    computer: "កុំព្យូទ័ររបស់អ្នក", installer: "កម្មវិធីដំឡើង", size: "ទំហំ", get: "ទាញយក",
    macHint: "មិនប្រាកដថា Mac របស់អ្នកជាប្រភេទណា? បើកម៉ឺនុយ Apple ហើយជ្រើស About This Mac។ Chip ឈ្មោះ M1 ឬថ្មីជាងនេះ មានន័យថា Apple Silicon។",
    studioTitle: "ឬប្រើវាក្នុង Browser របស់អ្នក",
    studioBody: "ស្ទូឌីយោក៏ដំណើរការក្នុង Browser Chromium ទំនើបដោយមិនចាំបាច់ដំឡើងអ្វីឡើយ។ វីដេអូរបស់អ្នកនៅតែកាត់ត និង Render លើកុំព្យូទ័ររបស់អ្នកផ្ទាល់។",
    newTitle: "ថ្មីក្នុងកំណែ {version}",
    older: "កំណែមុនៗ និងកំណត់ត្រាចេញផ្សាយពេញលេញ",
    platforms: { win: "Windows 10 និង 11, 64-bit", macArm: "macOS, Apple Silicon", macIntel: "macOS, Intel", linux: "Linux, 64-bit", deb: "Linux, Debian និង Ubuntu", rpm: "Linux, Fedora និង RHEL" },
    kinds: { exe: "កម្មវិធីដំឡើង (.exe)", msi: "កញ្ចប់ MSI សម្រាប់ការដំឡើងតាមស្ថាប័ន", dmg: "Disk Image (.dmg)", appimage: "AppImage ដំណើរការលើ Distribution ភាគច្រើន", deb: "កញ្ចប់ (.deb)", rpm: "កញ្ចប់ (.rpm)" },
  },
  about: {
    title: "កម្មវិធីកាត់តវីដេអូត្រូវបានបង្កើតសម្រាប់ក្រុមផលិតភាពយន្ត។ FucuFlow សម្រាប់អ្នកដែលចង់បង្ហាញ Software របស់ខ្លួន។",
    story: [
      "កម្មវិធីកាត់តបែបប្រពៃណីត្រូវបានរចនាឡើងរាប់ទសវត្សរ៍មុនសម្រាប់អ្នកផលិតភាពយន្ត។ វាមានច្រើនហួសពីអ្វីដែលវិស្វករ អ្នករចនា ឬគ្រូបង្រៀនត្រូវការ ពេលដែលពួកគេគ្រាន់តែចង់បង្ហាញអ្វីដែលខ្លួនបានបង្កើត។",
      "FucuFlow ដកចំណុចទាំងនោះចេញ ហើយរក្សាអ្វីដែលធ្វើឱ្យវីដេអូផលិតផលងាយមើល៖ Zoom ដែលទៅត្រូវកន្លែងមានសកម្មភាព វីដេអូដែលស្ថិតក្នុងលំហ 3D និង Export ដែលបញ្ចប់លើ GPU របស់អ្នកផ្ទាល់។",
    ],
    maintainer: "FucuFlow សរសេរ និងថែទាំដោយ Eric Va។",
    principles: [
      { title: "ក្នុងម៉ាស៊ីន និងឯកជន", body: "វីដេអូថតអេក្រង់របស់អ្នកមិនដែលទៅដល់ Server ឡើយ។ ការគណនា Zoom និង Render ធ្វើនៅលើកុំព្យូទ័ររបស់អ្នក។" },
      { title: "លឿនលើ Hardware ធម្មតា", body: "ការ Render ដំណើរការលើ GPU របស់អ្នក ដូច្នេះ Laptop មួយគ្រប់គ្រាន់សម្រាប់ Export វីដេអូ។" },
      { title: "ចលនាកាមេរ៉ាគ្មានការកាត់ផ្តាច់", body: "កាមេរ៉ានិម្មិតដើរតាមខ្សែកោងរលូនជាមួយ Spring Easing ដូច្នេះវារំកិលពីចំណុចមួយទៅមួយដោយមិនលោត។" },
      { title: "ឥតគិតថ្លៃ និងបើក Source", body: "គ្រប់បន្ទាត់កូដនៅលើ GitHub ក្រោមអាជ្ញាបណ្ណ MIT។ Fork វា បន្ថែមលើវា ឬដាក់វាក្នុងផលិតផលរបស់អ្នក។" },
    ],
    openTitle: "Open Source ក្រោមអាជ្ញាបណ្ណ MIT",
    openBody: "គ្មានការជាវប្រចាំខែ និងគ្មានដែនកំណត់ Export។ របាយការណ៍ Bug សំណើមុខងារ និង Pull Request ទាំងអស់ធ្វើដោយបើកចំហនៅលើ GitHub។",
    viewSource: "មើល Source នៅលើ GitHub",
    contactTitle: "ទាក់ទងមកយើង",
    contactLead: "សំណួរ គំនិតមុខងារ និងរបាយការណ៍ Bug យើងស្វាគមន៍ទាំងអស់។ ជ្រើសផ្លូវណាដែលសមនឹងអ្វីដែលអ្នកចង់និយាយ។",
    emailTitle: "អ៊ីមែល",
    emailBody: "សម្រាប់រឿងឯកជន រួមទាំងរបាយការណ៍សុវត្ថិភាព។",
    discussTitle: "GitHub Discussions",
    discussBody: "សម្រាប់ Bug និងសំណើមុខងារដែលអ្នកផ្សេងអាចជួបដូចគ្នា។",
    discussLink: "បើកការពិភាក្សា",
    form: {
      name: "ឈ្មោះរបស់អ្នក", email: "អាសយដ្ឋានអ៊ីមែល", topic: "តើវាអំពីអ្វី?",
      topics: ["សំណួរទូទៅ", "Bug", "សំណើមុខងារ", "បញ្ហាសុវត្ថិភាព"],
      message: "សារ", send: "ផ្ញើសារ", sending: "កំពុងផ្ញើ",
      sent: "សារត្រូវបានផ្ញើ។ សូមអរគុណ អ្នកនឹងទទួលបានចម្លើយតាមអ៊ីមែល។",
      needName: "សូមបញ្ចូលឈ្មោះរបស់អ្នក។", needEmail: "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។", badEmail: "អ៊ីមែលនេះមិនត្រឹមត្រូវទេ។ សូមពិនិត្យ ហើយព្យាយាមម្តងទៀត។", needMessage: "សូមសរសេរសារមុនពេលផ្ញើ។",
    },
  },
  resources: { title: "Shortcut និងមគ្គុទ្ទេសក៍", lead: "គ្រាប់ចុចដែលគួររៀនមុនគេ និងមគ្គុទ្ទេសក៍ខ្លីៗសម្រាប់ការថតឱ្យបានស្អាត។", shortcutsTitle: "Keyboard Shortcut", key: "គ្រាប់ចុច", action: "អ្វីដែលវាធ្វើ", guidesTitle: "មគ្គុទ្ទេសក៍" },
  footer: { blurb: "ស្ទូឌីយោកែច្នៃក្រោយការថត ដែលផ្តល់កាមេរ៉ា 3D ឱ្យវីដេអូថតអេក្រង់។ បង្កើតដោយ Eric Va និងចេញផ្សាយក្រោមអាជ្ញាបណ្ណ MIT។", product: "ផលិតផល", project: "គម្រោង", aboutContact: "អំពី និងទំនាក់ទំនង", source: "Source នៅលើ GitHub", releases: "កំណត់ត្រាចេញផ្សាយ" },
};

export const siteCopy: Record<Locale, SiteCopy> = { en, km, kh: km };
