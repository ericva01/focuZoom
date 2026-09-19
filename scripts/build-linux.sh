#!/bin/bash
set -e

# ==============================================================================
# Glideo - Linux Build Script (.deb and .AppImage)
# Can be run directly on Ubuntu/Debian, inside WSL2, or in a Docker container.
# ==============================================================================

echo "================================================="
echo "  Glideo Linux Installer Build"
echo "================================================="

# 1. Check & install system dependencies
echo "[1/4] Checking Linux build dependencies..."
if command -v apt-get &> /dev/null; then
  echo "Installing required system packages via apt..."
  sudo apt-get update
  sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    patchelf \
    squashfs-tools
fi

# 2. Check Rust toolchain
echo "[2/4] Checking Rust environment..."
if ! command -v cargo &> /dev/null; then
  echo "Rust not found. Installing Rust toolchain..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
else
  echo "Rust found: $(cargo --version)"
fi

# 3. Install Node.js dependencies & compile web frontend
echo "[3/4] Installing Node dependencies and exporting frontend..."
npm install
npm run build:web

# 4. Build Linux packages via Tauri CLI
echo "[4/4] Bundling Linux installer packages (.deb & .AppImage)..."
npx tauri build --bundles deb,appimage

echo ""
echo "================================================="
echo "  Build Completed Successfully!"
echo "================================================="
echo "Installer files generated at:"
find src-tauri/target/release/bundle/ -type f \( -name "*.deb" -o -name "*.AppImage" \)
echo "================================================="
