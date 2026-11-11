// Release data for the download page: types, and a bundled list used when
// the GitHub API is unreachable or rate limited.

export interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  prerelease: boolean;
  html_url: string;
  assets: ReleaseAsset[];
}

export const GITHUB_REPO = "ericva01/focuZoom";
// Hardcoded fallback data in case GitHub API rate limits or user is offline
export const FALLBACK_RELEASES: GitHubRelease[] = [
  {
    id: 1,
    tag_name: "v0.2.2",
    name: "FucuFlow v0.2.2",
    published_at: "2026-11-05T14:58:00Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.2.2`,
    body: `### FucuFlow v0.2.2 Release
- Autonomous AI Agent Copilot with Gemini, OpenAI, and local Ollama
- Model Context Protocol (MCP) server & Local Agent Bridge for Claude Desktop / Cursor
- Auto-fallback for Gemini high-demand errors (gemini-1.5-flash)
- Removed 'Leave site?' browser popup and fixed in-app back routing to Desktop Dashboard
- Native installers for Windows 10/11, macOS (Apple Silicon & Intel), and Linux`,
    assets: [
      {
        id: 101,
        name: "FucuFlow_0.2.2_x64-setup.exe",
        size: 7350000,
        download_count: 10,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.2/FucuFlow_0.2.2_x64-setup.exe`,
        created_at: "2026-11-05T14:58:00Z",
      },
      {
        id: 102,
        name: "FucuFlow_0.2.2_x64_en-US.msi",
        size: 9200000,
        download_count: 10,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.2/FucuFlow_0.2.2_x64_en-US.msi`,
        created_at: "2026-11-05T14:58:00Z",
      },
      {
        id: 103,
        name: "FucuFlow_0.2.2_aarch64.dmg",
        size: 9600000,
        download_count: 10,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.2/FucuFlow_0.2.2_aarch64.dmg`,
        created_at: "2026-11-05T14:58:00Z",
      },
      {
        id: 104,
        name: "FucuFlow_0.2.2_x64.dmg",
        size: 9700000,
        download_count: 10,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.2/FucuFlow_0.2.2_x64.dmg`,
        created_at: "2026-11-05T14:58:00Z",
      },
      {
        id: 105,
        name: "FucuFlow_0.2.2_amd64.AppImage",
        size: 99000000,
        download_count: 10,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.2/FucuFlow_0.2.2_amd64.AppImage`,
        created_at: "2026-11-05T14:58:00Z",
      },
      {
        id: 106,
        name: "FucuFlow_0.2.2_amd64.deb",
        size: 10050000,
        download_count: 10,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.2/FucuFlow_0.2.2_amd64.deb`,
        created_at: "2026-11-05T14:58:00Z",
      },
    ],
  },
  {
    id: 2,
    tag_name: "v0.2.0",
    name: "FucuFlow v0.2.0",
    published_at: "2026-11-01T10:47:33Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.2.0`,
    body: `### FucuFlow v0.2.0 Release
- Clerk authentication integration with secure login & profile management
- Automatic in-app update checker and notification banner
- Dynamic 3D camera pan & focal auto-zoom keyframe editor
- Multi-track timeline, zero-cloud local video storage, and 4K 60FPS export
- Native installers for Windows 10/11, macOS (Apple Silicon & Intel), and Linux`,
    assets: [
      {
        id: 201,
        name: "FucuFlow_0.2.0_x64-setup.exe",
        size: 7225188,
        download_count: 140,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_x64-setup.exe`,
        created_at: "2026-11-01T10:47:33Z",
      },
      {
        id: 202,
        name: "FucuFlow_0.2.0_x64_en-US.msi",
        size: 9097216,
        download_count: 65,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_x64_en-US.msi`,
        created_at: "2026-11-01T10:46:33Z",
      },
      {
        id: 203,
        name: "FucuFlow_0.2.0_aarch64.dmg",
        size: 9493747,
        download_count: 110,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_aarch64.dmg`,
        created_at: "2026-11-01T10:42:01Z",
      },
      {
        id: 204,
        name: "FucuFlow_0.2.0_x64.dmg",
        size: 9586500,
        download_count: 55,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_x64.dmg`,
        created_at: "2026-11-01T10:41:59Z",
      },
      {
        id: 205,
        name: "FucuFlow_0.2.0_amd64.AppImage",
        size: 98884088,
        download_count: 80,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_amd64.AppImage`,
        created_at: "2026-11-01T10:47:33Z",
      },
      {
        id: 206,
        name: "FucuFlow_0.2.0_amd64.deb",
        size: 9953306,
        download_count: 45,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow_0.2.0_amd64.deb`,
        created_at: "2026-11-01T10:47:33Z",
      },
      {
        id: 207,
        name: "FucuFlow-0.2.0-1.x86_64.rpm",
        size: 9955626,
        download_count: 20,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.2.0/FucuFlow-0.2.0-1.x86_64.rpm`,
        created_at: "2026-11-01T10:47:33Z",
      },
    ],
  },
  {
    id: 2,
    tag_name: "v0.1.6",
    name: "FucuFlow v0.1.6",
    published_at: "2026-09-21T18:00:00Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.6`,
    body: `### FucuFlow v0.1.6 Release
- High-performance desktop screen recorder and automated zoom editor
- Fixed mesh background rendering and instant playhead seeking
- Added cursor visibility toggle to hide real device cursor
- Native builds for Windows 10/11, macOS Apple Silicon & Intel, and Linux`,
    assets: [
      {
        id: 301,
        name: "FucuFlow_0.1.6_x64-setup.exe",
        size: 7063071,
        download_count: 120,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_x64-setup.exe`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 302,
        name: "FucuFlow_0.1.6_x64_en-US.msi",
        size: 8470528,
        download_count: 45,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_x64_en-US.msi`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 303,
        name: "FucuFlow_0.1.6_aarch64.dmg",
        size: 9349790,
        download_count: 85,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_aarch64.dmg`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 304,
        name: "FucuFlow_0.1.6_x64.dmg",
        size: 9437417,
        download_count: 40,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_x64.dmg`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 305,
        name: "FucuFlow_0.1.6_amd64.AppImage",
        size: 98740728,
        download_count: 65,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.AppImage`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 306,
        name: "FucuFlow_0.1.6_amd64.deb",
        size: 9806768,
        download_count: 30,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow_0.1.6_amd64.deb`,
        created_at: "2026-09-21T18:00:00Z",
      },
      {
        id: 307,
        name: "FucuFlow-0.1.6-1.x86_64.rpm",
        size: 9808158,
        download_count: 15,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.6/FucuFlow-0.1.6-1.x86_64.rpm`,
        created_at: "2026-09-21T18:00:00Z",
      },
    ],
  },
  {
    id: 2,
    tag_name: "v0.1.4",
    name: "FucuFlow v0.1.4",
    published_at: "2026-09-21T08:11:29Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.4`,
    body: `### FucuFlow v0.1.4 Release
- Rebranding to FucuFlow studio suite
- Light & dark mode full high-contrast theme support
- Ultra-smooth camera smoothing and sticky anchor locks for rapid clicks
- Timeline overlapping animation auto-grouping into segmented visual tracks
- Multi-track trimmer with precision scrubbing`,
    assets: [
      {
        id: 101,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 6510370,
        download_count: 1,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 102,
        name: "FucuFlow_0.1.0_x64_en-US.msi",
        size: 7905280,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_x64_en-US.msi`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 103,
        name: "FucuFlow_0.1.0_aarch64.dmg",
        size: 8770694,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_aarch64.dmg`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 104,
        name: "FucuFlow_0.1.0_x64.dmg",
        size: 8882212,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_x64.dmg`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 105,
        name: "FucuFlow_0.1.0_amd64.AppImage",
        size: 98179576,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_amd64.AppImage`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 106,
        name: "FucuFlow_0.1.0_amd64.deb",
        size: 9258278,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow_0.1.0_amd64.deb`,
        created_at: "2026-09-21T08:11:29Z",
      },
      {
        id: 107,
        name: "FucuFlow-0.1.0-1.x86_64.rpm",
        size: 9259723,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.4/FucuFlow-0.1.0-1.x86_64.rpm`,
        created_at: "2026-09-21T08:11:29Z",
      },
    ],
  },
  {
    id: 2,
    tag_name: "v0.1.3",
    name: "FucuFlow v0.1.3",
    published_at: "2026-09-21T03:50:48Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.3`,
    body: `### FucuFlow v0.1.3 Release
- Cross-platform macOS universal build workflow
- Improved screen recording framerate stability
- Interactive canvas zoom handles`,
    assets: [
      {
        id: 201,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 6495374,
        download_count: 1,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-21T03:50:48Z",
      },
      {
        id: 202,
        name: "FucuFlow_0.1.0_aarch64.dmg",
        size: 8758987,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_aarch64.dmg`,
        created_at: "2026-09-21T03:50:48Z",
      },
      {
        id: 203,
        name: "FucuFlow_0.1.0_amd64.AppImage",
        size: 98171384,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_amd64.AppImage`,
        created_at: "2026-09-21T03:50:48Z",
      },
      {
        id: 204,
        name: "FucuFlow_0.1.0_amd64.deb",
        size: 9245426,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.3/FucuFlow_0.1.0_amd64.deb`,
        created_at: "2026-09-21T03:50:48Z",
      },
    ],
  },
  {
    id: 3,
    tag_name: "v0.1.2",
    name: "FucuFlow v0.1.2",
    published_at: "2026-09-19T02:14:23Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.2`,
    body: `### FucuFlow v0.1.2 Release
- Enhanced camera choreography and spring dynamics
- WebGL GPU canvas acceleration
- Local file project export`,
    assets: [
      {
        id: 301,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 7681841,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.2/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-19T02:14:23Z",
      },
      {
        id: 302,
        name: "FucuFlow_0.1.0_aarch64.dmg",
        size: 10557052,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.2/FucuFlow_0.1.0_aarch64.dmg`,
        created_at: "2026-09-19T02:14:23Z",
      },
      {
        id: 303,
        name: "FucuFlow_0.1.0_amd64.AppImage",
        size: 98806264,
        download_count: 1,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.2/FucuFlow_0.1.0_amd64.AppImage`,
        created_at: "2026-09-19T02:14:23Z",
      },
    ],
  },
  {
    id: 4,
    tag_name: "v0.1.1",
    name: "FucuFlow v0.1.0 - Initial Release",
    published_at: "2026-09-14T03:39:18Z",
    prerelease: false,
    html_url: `https://github.com/${GITHUB_REPO}/releases/tag/v0.1.1`,
    body: `### What's New
- Autonomous click-to-zoom camera choreography
- Critically damped spring cursor tracking
- 3D perspective stage framing & WebGL GPU rendering
- Zero-cloud local in-browser processing`,
    assets: [
      {
        id: 401,
        name: "FucuFlow_0.1.0_x64-setup.exe",
        size: 9953955,
        download_count: 6,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.1/FucuFlow_0.1.0_x64-setup.exe`,
        created_at: "2026-09-14T03:39:18Z",
      },
      {
        id: 402,
        name: "FucuFlow_0.1.0_x64_en-US.msi",
        size: 18857984,
        download_count: 0,
        browser_download_url: `https://github.com/${GITHUB_REPO}/releases/download/v0.1.1/FucuFlow_0.1.0_x64_en-US.msi`,
        created_at: "2026-09-14T03:39:18Z",
      },
    ],
  },
];
