"use client";

import { SignIn } from "@clerk/react";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={null}>
        <SignIn routing="hash" />
      </Suspense>
    </div>
  );
}
