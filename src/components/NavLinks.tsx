"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE = "min-h-11 items-center font-semibold transition hover:text-brand";
const ACTIVE = "text-brand underline decoration-2 underline-offset-8";

// Header links with an active state for the current page.
export function NavLinks() {
  const pathname = usePathname();
  const isContact = pathname === "/contact";

  return (
    <>
      <Link href="/#catalog" className={`hidden sm:flex ${BASE}`}>
        Costume
      </Link>
      <Link
        href="/contact"
        aria-current={isContact ? "page" : undefined}
        className={`flex px-2 sm:px-0 ${BASE} ${isContact ? ACTIVE : ""}`}
      >
        Contact
      </Link>
    </>
  );
}
