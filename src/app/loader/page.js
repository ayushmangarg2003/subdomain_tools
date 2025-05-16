"use client";

import { Suspense } from "react";
import LoaderPageInner from "./LoaderPageInner";

export default function LoaderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-lg">Loading...</div>}>
      <LoaderPageInner />
    </Suspense>
  );
} 