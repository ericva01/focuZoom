"use client";

import { SignIn } from "@clerk/react";
import { Suspense } from "react";

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignInPage() {
  if (!hasClerkKey) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-sm text-slate-500">Sign in is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={null}>
        <SignIn routing="hash" />
      </Suspense>
    </div>
  );
}
