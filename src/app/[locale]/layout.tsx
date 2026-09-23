import { ReactNode } from "react";

export function generateStaticParams() {
  return [
    { locale: "kh" },
    { locale: "en" },
  ];
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
