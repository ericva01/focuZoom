import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fucuflow.ericva.site";
  const locales = ["en", "kh"];
  const pages = [
    "",
    "/features",
    "/product",
    "/download",
    "/editor",
    "/desktop",
    "/open-source",
    "/solutions",
    "/resources",
    "/about",
    "/contact",
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  pages.forEach((page) => {
    // Canonical root entry
    entries.push({
      url: `${baseUrl}${page}`,
      lastModified: now,
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1.0 : page === "/features" || page === "/download" || page === "/product" ? 0.9 : 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page}`,
          km: `${baseUrl}/kh${page}`,
          "x-default": `${baseUrl}${page}`,
        },
      },
    });

    // Localized routes
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            km: `${baseUrl}/kh${page}`,
            "x-default": `${baseUrl}${page}`,
          },
        },
      });
    });
  });

  return entries;
}
