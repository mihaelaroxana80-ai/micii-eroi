"use client";

import { usePathname } from "next/navigation";

// Hides server-rendered children on one route (e.g. the footer contact block on /contact).
export function HideOnPath({ path, children }: { path: string; children: React.ReactNode }) {
  return usePathname() === path ? null : children;
}
