/** @type {import('next').NextConfig} */
// Default to static HTML export (generates the "out" directory) for Render, Tauri, and static web hosts.
// Only disabled if explicitly set to NEXT_EXPORT=false
const isNotExport = process.env.NEXT_EXPORT === "false";

const nextConfig = {
  ...(!isNotExport && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;

