# FucuFlow — Cinematic Screen Recording Post-Processing Studio

<p align="center">
  <img src="public/logo.png" alt="FucuFlow Logo" width="100" />
</p>

<p align="center">
  <strong>Transform raw screen recordings into professional, engaging video presentations with automated 3D camera dollies, cursor trails, and webcam picture-in-picture.</strong>
</p>

<p align="center">
  <a href="https://github.com/ericva01/focuZoom/releases">
    <img src="https://img.shields.io/github/downloads/ericva01/focuZoom/total?style=for-the-badge&color=fb7185&labelColor=1e293b&logo=github&label=TOTAL%20DOWNLOADS" alt="Total Downloads" />
  </a>
  <a href="https://github.com/ericva01/focuZoom/releases/latest">
    <img src="https://img.shields.io/github/downloads/ericva01/focuZoom/latest/total?style=for-the-badge&color=fb7185&labelColor=1e293b&label=LATEST%20RELEASE" alt="Latest Downloads" />
  </a>
  <a href="https://github.com/ericva01/focuZoom/releases">
    <img src="https://img.shields.io/github/v/release/ericva01/focuZoom?style=for-the-badge&color=fb7185&labelColor=1e293b&label=RELEASE" alt="GitHub Release" />
  </a>
  <a href="https://github.com/ericva01/focuZoom/stargazers">
    <img src="https://img.shields.io/github/stars/ericva01/focuZoom?style=for-the-badge&color=fb7185&labelColor=1e293b&logo=github&label=STARS" alt="GitHub Stars" />
  </a>
</p>

---

## ✨ Features

- 🎥 **3D Camera Dolly & Tilt Transitions:** Dynamic perspective shifts simulated in real time with WebGL & Three.js.
- 🎯 **Intelligent Click & Zoom Keyframing:** Auto-detects clicks or lets you visually set focal points on the multi-track timeline.
- 🫧 **Webcam Picture-in-Picture (PiP):** Floating facecam bubble with Circle, Rounded Square, and Square framing, border accents, and live audio VU meter.
- ⚡ **Local & Offline Rendering:** Render directly on your device with hardware-accelerated VP9/VP8 WebM encoding.
- 📁 **Custom Export Destination:** Choose your desired folder on any local drive before or after rendering.

---

## 🚀 Download & Installation

FucuFlow is available as a standalone native desktop application for **Windows**, **macOS**, and **Linux**, as well as an in-browser studio.

Download the latest release binaries directly from the [GitHub Releases Page](https://github.com/ericva01/focuZoom/releases/latest).

### Platform Binaries

| Operating System | Architecture | Package Format | Download Link |
| :--- | :--- | :--- | :--- |
| **Windows** | 64-bit (x64) | Setup Executable (`.exe`) | [Download .exe](https://github.com/ericva01/focuZoom/releases/latest) |
| **Windows** | 64-bit (x64) | Windows Installer (`.msi`) | [Download .msi](https://github.com/ericva01/focuZoom/releases/latest) |
| **macOS** | Apple Silicon (M1 / M2 / M3 / M4) | Apple Disk Image (`.dmg`) | [Download ARM64 .dmg](https://github.com/ericva01/focuZoom/releases/latest) |
| **macOS** | Intel Core (i5 / i7 / i9) | Apple Disk Image (`.dmg`) | [Download x64 .dmg](https://github.com/ericva01/focuZoom/releases/latest) |
| **Linux** | 64-bit (x86_64) | Universal AppImage (`.AppImage`) | [Download .AppImage](https://github.com/ericva01/focuZoom/releases/latest) |
| **Linux** | Debian / Ubuntu | Debian Package (`.deb`) | [Download .deb](https://github.com/ericva01/focuZoom/releases/latest) |

---

### 🍎 macOS Installation & Gatekeeper Fix

Because FucuFlow is a free, open-source project and is not yet signed with a paid Apple Developer ID certificate ($99/year), macOS Gatekeeper (Sonoma 14 and Sequoia 15) blocks unsigned apps by showing:

> **"FucuFlow is damaged and can't be opened. You should move it to the Trash."**  
> *or*  
> **"FucuFlow cannot be opened because Apple cannot check it for malicious software."**

#### Method 1: Instant Terminal Command (Recommended)

1. Open the downloaded `.dmg` and drag **FucuFlow** into your **`/Applications`** folder.
2. Open **Terminal** (<kbd>Cmd</kbd> + <kbd>Space</kbd>, type `Terminal`, hit Enter).
3. Paste and run this command:
   ```bash
   xattr -cr /Applications/FucuFlow.app
   ```
4. FucuFlow will now open immediately and run smoothly without any restrictions or warnings!

#### Method 2: System Settings (macOS Sequoia 15 & Sonoma 14)

1. Open **FucuFlow** from Applications once (macOS will show the warning). Click **Done** / **Cancel**.
2. Open **System Settings** (Apple menu  → *System Settings*).
3. Navigate to **Privacy & Security** in the sidebar.
4. Scroll down to the **Security** section. You will see:  
   *`"FucuFlow" was blocked from use because it is not from an identified developer.`*
5. Click **Open Anyway**, enter your Mac user password, and confirm **Open**.

---

### 🪟 Windows SmartScreen Instructions

When launching the `.exe` installer for the first time, Windows Defender SmartScreen may display: *"Windows protected your PC"*.

1. Click **More info** (underlined link).
2. Click **Run anyway**.
3. The setup installer will complete in seconds without requiring administrator elevation.

---

## 🛠️ Development & Building

```bash
# Clone the repository
git clone https://github.com/ericva01/focuZoom.git
cd focuZoom

# Install dependencies
npm install

# Run web studio development server
npm run dev

# Run native desktop app in dev mode
npx tauri dev

# Build production desktop installer (.exe & .msi)
npx tauri build
```

---

## 📄 License
Created by Eric Va. All rights reserved.
