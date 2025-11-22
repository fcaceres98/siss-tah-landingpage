"use client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import Content from "@/components/response/content/content";

export default function Home() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[20px]" />}>
      <Content />
    </Suspense>
  );
}