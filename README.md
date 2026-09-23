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

### Windows Desktop (Recommended)
Download the latest Windows installer from the [Releases Page](https://github.com/ericva01/focuZoom/releases):

| Format | Download |
| :--- | :--- |
| **Windows Setup (.exe)** | [Download FucuFlow Setup](https://github.com/ericva01/focuZoom/releases/latest) |
| **Windows Installer (.msi)** | [Download FucuFlow MSI](https://github.com/ericva01/focuZoom/releases/latest) |

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
