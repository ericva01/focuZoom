/** @type {import('next').NextConfig} */
// Static HTML export (generates the "out" directory) for Render, Tauri, and static web hosts.
// Only enabled during production builds when NEXT_EXPORT is set or not explicitly false.
const isDev = process.env.NODE_ENV === "development";
const isExport = !isDev && process.env.NEXT_EXPORT !== "false";

const nextConfig = {
  ...(isExport && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;

