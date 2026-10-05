import Link from "next/link";
import { ORDERING_ENABLED, PRELAUNCH_MESSAGE, SHOP_UI_ENABLED, TEST_MODE } from "@/lib/config";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/products";
import { CartIcon } from "./CartIcon";
import { NavLinks } from "./NavLinks";

function TopBar() {
  if (ORDERING_ENABLED) {
    return (
      <p className="bg-brand px-4 py-2 text-center text-sm font-semibold text-white">
        🚚 Livrare gratuită la comenzi peste {FREE_SHIPPING_THRESHOLD} lei
      </p>
    );
  }
  // Local testing: no banner (the simulated checkout itself is clearly labelled).
  if (TEST_MODE) return null;
  return <p className="bg-brand px-4 py-2 text-center text-sm font-semibold text-white">{PRELAUNCH_MESSAGE}</p>;
}

export function SiteHeader() {
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-brand">
            MiciiEroi
          </Link>
          {/* Mobile keeps logo + contact + cart; desktop adds the catalog link. */}
          <nav className="flex items-center gap-1 sm:gap-6">
            <NavLinks />
            {SHOP_UI_ENABLED && <CartIcon />}
          </nav>
        </div>
      </header>
    </>
  );
}
