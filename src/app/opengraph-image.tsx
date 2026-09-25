import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "FucuFlow Studio — Cinematic Screen Recording & Focal Auto-Zoom";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Read official logo
  let logoBase64 = "";
  try {
    const logoBuffer = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch (e) {
    console.error("Failed to read logo.png for OG image", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#090D16",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-40px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255, 107, 44, 0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "80px",
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, rgba(255, 107, 44, 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Top bar with official logo & brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {logoBase64 ? (
              <img
                src={logoBase64}
                width={72}
                height={72}
                style={{
                  objectFit: "contain",
                }}
              />
            ) : null}
            <span
              style={{
                fontSize: "44px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
              }}
            >
              FucuFlow
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 107, 44, 0.12)",
              border: "1px solid rgba(255, 107, 44, 0.4)",
              color: "#FF8A4C",
              fontSize: "15px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#FF6B2C",
              }}
            />
            <span>100% Free &amp; Open Source</span>
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "58px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "1020px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Cinematic Screen Recording &nbsp;</span>
            <span style={{ color: "#FF6B2C" }}>&amp; Focal Auto-Zoom</span>
          </div>

          <p
            style={{
              marginTop: "18px",
              fontSize: "23px",
              lineHeight: 1.4,
              color: "#94A3B8",
              maxWidth: "920px",
            }}
          >
            Automatic click-to-zoom spline camera dollies, 3D stage orientation, and multi-track audio. 100% private with local storage on your device.
          </p>
        </div>

        {/* Bottom feature badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {[
            { title: "Focal Auto-Zoom", sub: "Catmull-Rom Spline" },
            { title: "3D Stage Tilt", sub: "Isometric Pitch & Yaw" },
            { title: "Multi-Track Timeline", sub: "60 FPS & Waveforms" },
            { title: "100% Local Privacy", sub: "Zero Cloud Uploads" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC" }}>
                {item.title}
              </span>
              <span style={{ fontSize: "12px", color: "#FF8A4C", marginTop: "2px" }}>
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
