import fs from "fs";
import path from "path";
import sharp from "sharp";

// Ensure output directory
const outDir = path.resolve("src-tauri/installer");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Convert raw RGBA Buffer to uncompressed 24-bit Windows BMP Buffer
function rgbaToBmp(rgbaBuffer, width, height) {
  const rowBytes = width * 3;
  const padding = (4 - (rowBytes % 4)) % 4;
  const rowSize = rowBytes + padding;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;

  const buf = Buffer.alloc(fileSize);
  // BMP File Header (14 bytes)
  buf.write("BM", 0);
  buf.writeUInt32LE(fileSize, 2);
  buf.writeUInt32LE(0, 6); // reserved
  buf.writeUInt32LE(54, 10); // offset to pixel data

  // DIB Header (BITMAPINFOHEADER - 40 bytes)
  buf.writeUInt32LE(40, 14);
  buf.writeInt32LE(width, 18);
  buf.writeInt32LE(height, 22); // positive = bottom-to-top
  buf.writeUInt16LE(1, 26); // planes
  buf.writeUInt16LE(24, 28); // 24 bpp
  buf.writeUInt32LE(0, 30); // BI_RGB (uncompressed)
  buf.writeUInt32LE(pixelArraySize, 34);
  buf.writeInt32LE(2835, 38); // 72 DPI
  buf.writeInt32LE(2835, 42);
  buf.writeUInt32LE(0, 46);
  buf.writeUInt32LE(0, 50);

  // Write pixels bottom-up, in BGR order
  for (let y = 0; y < height; y++) {
    const srcRow = (height - 1 - y) * width * 4;
    const dstRow = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const srcPx = srcRow + x * 4;
      const dstPx = dstRow + x * 3;
      const r = rgbaBuffer[srcPx];
      const g = rgbaBuffer[srcPx + 1];
      const b = rgbaBuffer[srcPx + 2];
      const a = rgbaBuffer[srcPx + 3] / 255;

      // Composite onto white if transparent
      buf[dstPx] = Math.round(b * a + 255 * (1 - a)); // Blue
      buf[dstPx + 1] = Math.round(g * a + 255 * (1 - a)); // Green
      buf[dstPx + 2] = Math.round(r * a + 255 * (1 - a)); // Red
    }
  }

  return buf;
}

async function generateInstallerGraphics() {
  console.log("Generating branded Windows installer graphics...");

  const iconPath = path.resolve("src-tauri/icons/icon.png");

  // 1. WiX Dialog Bitmap (493x312)
  // Left 164px: Dark theme FucuFlow branding. Right 329px: White background for wizard text.
  const icon72 = await sharp(iconPath).resize(72, 72).png().toBuffer();
  const iconBase64 = icon72.toString("base64");

  const wixDialogSvg = `
  <svg width="493" height="312" viewBox="0 0 493 312" xmlns="http://www.w3.org/2000/svg">
    <!-- Right side: Clean white background for Windows installer text -->
    <rect x="164" y="0" width="329" height="312" fill="#FFFFFF" />

    <!-- Left side: Deep dark branded panel -->
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#0E121D" />
        <stop offset="50%" stop-color="#141926" />
        <stop offset="100%" stop-color="#1B2234" />
      </linearGradient>
      <radialGradient id="orangeGlow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#FF6B2C" stop-opacity="0.35" />
        <stop offset="70%" stop-color="#FF6B2C" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#FF6B2C" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="accentLine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FF6B2C" />
        <stop offset="50%" stop-color="#FF8A4C" />
        <stop offset="100%" stop-color="#1B2234" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="164" height="312" fill="url(#bgGrad)" />
    <circle cx="82" cy="95" r="90" fill="url(#orangeGlow)" />

    <!-- Subtle geometric background grid lines -->
    <path d="M 0 60 L 164 60 M 0 120 L 164 120 M 0 180 L 164 180 M 0 240 L 164 240" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1" />
    <path d="M 40 0 L 40 312 M 82 0 L 82 312 M 124 0 L 124 312" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1" />

    <!-- Logo icon -->
    <image href="data:image/png;base64,${iconBase64}" x="46" y="48" width="72" height="72" />

    <!-- Brand name -->
    <text x="82" y="148" font-family="Segoe UI, -apple-system, sans-serif" font-size="19" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">
      Fucu<tspan fill="#FF6B2C">Flow</tspan>
    </text>

    <!-- Subtitle -->
    <text x="82" y="168" font-family="Segoe UI, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.5">
      STUDIO SUITE
    </text>

    <!-- Feature bullets -->
    <g transform="translate(18, 198)" font-family="Segoe UI, sans-serif" font-size="9" fill="#CBD5E1">
      <circle cx="5" cy="4" r="2.5" fill="#FF6B2C" />
      <text x="14" y="7" font-weight="600">Auto-Zoom &amp; 3D Pan</text>

      <circle cx="5" cy="22" r="2.5" fill="#FF6B2C" />
      <text x="14" y="25" font-weight="600">Ultra-Smooth 60 FPS</text>

      <circle cx="5" cy="40" r="2.5" fill="#FF6B2C" />
      <text x="14" y="43" font-weight="600">100% Offline &amp; Private</text>
    </g>

    <!-- Version tag -->
    <rect x="24" y="270" width="116" height="20" rx="10" fill="#FFFFFF" fill-opacity="0.08" stroke="#FF6B2C" stroke-opacity="0.3" stroke-width="1" />
    <text x="82" y="283" font-family="Segoe UI, sans-serif" font-size="9" font-weight="700" fill="#FF8A4C" text-anchor="middle">
      Native 64-bit App
    </text>

    <!-- Vertical separator line between sidebar and main dialog -->
    <line x1="164" y1="0" x2="164" y2="312" stroke="#E2E8F0" stroke-width="1" />
  </svg>
  `;

  const wixDialogRaw = await sharp(Buffer.from(wixDialogSvg)).raw().toBuffer();
  const wixDialogBmp = rgbaToBmp(wixDialogRaw, 493, 312);
  fs.writeFileSync(path.join(outDir, "wix-dialog.bmp"), wixDialogBmp);
  console.log("✓ Created wix-dialog.bmp (493x312)");

  // 2. WiX Top Banner (493x58)
  const icon40 = await sharp(iconPath).resize(40, 40).png().toBuffer();
  const icon40Base64 = icon40.toString("base64");

  const wixBannerSvg = `
  <svg width="493" height="58" viewBox="0 0 493 58" xmlns="http://www.w3.org/2000/svg">
    <!-- Clean white header background -->
    <rect x="0" y="0" width="493" height="58" fill="#FFFFFF" />
    <!-- Top orange accent bar -->
    <rect x="0" y="0" width="493" height="3" fill="#FF6B2C" />
    <!-- Bottom border line -->
    <line x1="0" y1="57" x2="493" y2="57" stroke="#E2E8F0" stroke-width="1" />

    <!-- Right side: Branded emblem icon -->
    <image href="data:image/png;base64,${icon40Base64}" x="444" y="9" width="40" height="40" />
  </svg>
  `;

  const wixBannerRaw = await sharp(Buffer.from(wixBannerSvg)).raw().toBuffer();
  const wixBannerBmp = rgbaToBmp(wixBannerRaw, 493, 58);
  fs.writeFileSync(path.join(outDir, "wix-banner.bmp"), wixBannerBmp);
  console.log("✓ Created wix-banner.bmp (493x58)");

  // 3. NSIS Sidebar (164x314)
  const nsisSidebarSvg = `
  <svg width="164" height="314" viewBox="0 0 164 314" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nsisBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0E121D" />
        <stop offset="60%" stop-color="#141926" />
        <stop offset="100%" stop-color="#1E2536" />
      </linearGradient>
      <radialGradient id="nsisGlow" cx="50%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#FF6B2C" stop-opacity="0.4" />
        <stop offset="70%" stop-color="#FF6B2C" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#FF6B2C" stop-opacity="0" />
      </radialGradient>
    </defs>

    <rect x="0" y="0" width="164" height="314" fill="url(#nsisBg)" />
    <circle cx="82" cy="95" r="95" fill="url(#nsisGlow)" />

    <!-- Subtle grid lines -->
    <path d="M 0 60 L 164 60 M 0 120 L 164 120 M 0 180 L 164 180 M 0 240 L 164 240" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1" />

    <!-- Logo icon -->
    <image href="data:image/png;base64,${iconBase64}" x="46" y="50" width="72" height="72" />

    <!-- Brand name -->
    <text x="82" y="152" font-family="Segoe UI, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">
      Fucu<tspan fill="#FF6B2C">Flow</tspan>
    </text>

    <!-- Subtitle -->
    <text x="82" y="172" font-family="Segoe UI, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.5">
      STUDIO SUITE
    </text>

    <!-- Features -->
    <g transform="translate(18, 202)" font-family="Segoe UI, sans-serif" font-size="9" fill="#CBD5E1">
      <circle cx="5" cy="4" r="2.5" fill="#FF6B2C" />
      <text x="14" y="7" font-weight="600">Auto-Zoom &amp; 3D Pan</text>

      <circle cx="5" cy="22" r="2.5" fill="#FF6B2C" />
      <text x="14" y="25" font-weight="600">Ultra-Smooth 60 FPS</text>

      <circle cx="5" cy="40" r="2.5" fill="#FF6B2C" />
      <text x="14" y="43" font-weight="600">100% Offline &amp; Private</text>
    </g>

    <!-- Bottom Badge -->
    <rect x="24" y="272" width="116" height="20" rx="10" fill="#FFFFFF" fill-opacity="0.08" stroke="#FF6B2C" stroke-opacity="0.3" stroke-width="1" />
    <text x="82" y="285" font-family="Segoe UI, sans-serif" font-size="9" font-weight="700" fill="#FF8A4C" text-anchor="middle">
      Native Desktop App
    </text>
  </svg>
  `;

  const nsisSidebarRaw = await sharp(Buffer.from(nsisSidebarSvg)).raw().toBuffer();
  const nsisSidebarBmp = rgbaToBmp(nsisSidebarRaw, 164, 314);
  fs.writeFileSync(path.join(outDir, "nsis-sidebar.bmp"), nsisSidebarBmp);
  console.log("✓ Created nsis-sidebar.bmp (164x314)");

  // 4. NSIS Header (150x57)
  const nsisHeaderSvg = `
  <svg width="150" height="57" viewBox="0 0 150 57" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="150" height="57" fill="#FFFFFF" />
    <rect x="0" y="0" width="150" height="3" fill="#FF6B2C" />
    <image href="data:image/png;base64,${icon40Base64}" x="100" y="9" width="40" height="40" />
  </svg>
  `;

  const nsisHeaderRaw = await sharp(Buffer.from(nsisHeaderSvg)).raw().toBuffer();
  const nsisHeaderBmp = rgbaToBmp(nsisHeaderRaw, 150, 57);
  fs.writeFileSync(path.join(outDir, "nsis-header.bmp"), nsisHeaderBmp);
  console.log("✓ Created nsis-header.bmp (150x57)");

  console.log("All installer graphics successfully generated!");
}

generateInstallerGraphics().catch(console.error);
