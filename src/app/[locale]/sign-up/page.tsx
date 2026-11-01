"use client";

import { SignUp } from "@clerk/react";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={null}>
        <SignUp routing="hash" />
      </Suspense>
    </div>
  );
}
