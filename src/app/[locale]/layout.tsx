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
      locale: isKh ? "km_KH" : "en_US",
      alternateLocale: [isKh ? "en_US" : "km_KH"],
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

