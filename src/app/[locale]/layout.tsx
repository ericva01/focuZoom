import { ReactNode } from "react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { locale: "kh" },
    { locale: "en" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKh = locale === "kh" || locale === "km";
  const baseUrl = "https://fucuflow.ericva.site";

  const title = isKh
    ? "FucuFlow — កម្មវិធីថតអេក្រង់ និងពង្រីកស្វ័យប្រវត្តិ"
    : "FucuFlow — Cinematic Screen Recording and Auto-Zoom";

  const description = isKh
    ? "បង្កើតវីដេអូបង្ហាញផលិតផលយ៉ាងទាក់ទាញ ជាមួយការ Zoom ដោយស្វ័យប្រវត្តិ មុំកាមេរ៉ា 3D និងចលនារលូន។ ឥតគិតថ្លៃ និង Open Source 100%។"
    : "Create cinematic product demos with automatic zoom, 3D camera angles, and smooth motion. 100% free and open source.";

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        km: `${baseUrl}/kh`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: isKh ? "km_KH" : "en_US",
      alternateLocale: [isKh ? "en_US" : "km_KH"],
      url: `${baseUrl}/${locale}`,
      siteName: "FucuFlow Studio",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: "@ericva",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <>{children}</>;
}

