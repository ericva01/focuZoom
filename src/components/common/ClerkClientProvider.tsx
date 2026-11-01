"use client";

import React from "react";
import { ClerkProvider } from "@clerk/react";

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZGVjaWRpbmctZm94LTk4NzcuY2xlcmsuYWNjb3VudHMuZGV2JA";

export function ClerkClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
