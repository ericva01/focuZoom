#!/bin/bash
set -e

# ==============================================================================
# Glideo - macOS Build Script (.dmg and .app)
# Run on macOS (Apple Silicon or Intel).
# ==============================================================================

echo "================================================="
echo "  Glideo macOS Installer Build (.dmg)"
echo "================================================="

# 1. Check Xcode Command Line Tools
echo "[1/4] Checking Command Line Tools..."
if ! xcode-select -p &> /dev/null; then
  echo "Xcode Command Line Tools not found. Installing..."
  xcode-select --install
fi

# 2. Check Rust
echo "[2/4] Checking Rust environment..."
if ! command -v cargo &> /dev/null; then
  echo "Rust not found. Installing Rust toolchain..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  source "$HOME/.cargo/env"
else
  echo "Rust found: $(cargo --version)"
fi

# 3. Build Web Frontend
echo "[3/4] Installing Node dependencies and exporting frontend..."
npm install
npm run build:web

# 4. Build macOS bundles (.dmg & .app)
echo "[4/4] Bundling macOS disk image (.dmg)..."
# Detect architecture
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
  echo "Targeting Apple Silicon (aarch64-apple-darwin)..."
  rustup target add aarch64-apple-darwin 2>/dev/null || true
  npx tauri build --target aarch64-apple-darwin --bundles dmg,app
else
  echo "Targeting Intel (x86_64-apple-darwin)..."
  rustup target add x86_64-apple-darwin 2>/dev/null || true
  npx tauri build --target x86_64-apple-darwin --bundles dmg,app
fi

echo ""
echo "================================================="
echo "  Build Completed Successfully!"
echo "================================================="
echo "macOS Installer files located at:"
find src-tauri/target -type f -name "*.dmg"
echo "================================================="
