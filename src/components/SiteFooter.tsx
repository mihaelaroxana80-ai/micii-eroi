import Image from "next/image";
import Link from "next/link";
import { CONTACT, HAS_CONTACT, SAL_BADGE } from "@/lib/config";
import { LEGAL_PAGES, SELLER_NAME, type LegalPageKey } from "@/lib/legal";
import { HideOnPath } from "./HideOnPath";
import { WhatsAppButton } from "./WhatsAppButton";

const FOOTER_LEGAL_LINKS: { key: LegalPageKey; label: string }[] = [
  { key: "terms", label: "Termeni și condiții" },
  { key: "privacy", label: "Confidențialitate" },
  { key: "returns", label: "Politică retur" },
];

const FOOTER_LINK = "inline-flex min-h-11 items-center text-sm font-semibold text-stone-600 hover:text-brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white px-4 py-12 text-center">
      {HAS_CONTACT && (
        // Not repeated on /contact, which already shows these details.
        <HideOnPath path="/contact">
        <section id="contact" className="scroll-mt-24">
          <h2 className="text-2xl font-extrabold text-ink">Ai o întrebare?</h2>
          <p className="mt-2 mb-6 text-base text-stone-500">Scrie-ne pentru informații despre costume și mărimi.</p>
          <div className="flex flex-col items-center gap-3">
            <WhatsAppButton />
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-11 items-center font-semibold text-brand hover:text-ink">
                {CONTACT.email}
              </a>
            )}
            {CONTACT.hours && <p className="text-sm text-stone-500">Program: {CONTACT.hours}</p>}
          </div>
        </section>
        </HideOnPath>
      )}

      {/* Legal pages are linked only once published; Contact and ANPC always. */}
      <nav aria-label="Informații pentru clienți" className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-1">
        {FOOTER_LEGAL_LINKS.filter(({ key }) => LEGAL_PAGES[key].published).map(({ key, label }) => (
          <Link key={key} href={LEGAL_PAGES[key].href} className={FOOTER_LINK}>
            {label}
          </Link>
        ))}
        <Link href="/contact" className={FOOTER_LINK}>
          Contact
        </Link>
        <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className={FOOTER_LINK}>
          ANPC
        </a>
      </nav>

      {SAL_BADGE.enabled && SAL_BADGE.src && SAL_BADGE.href && (
        <a href={SAL_BADGE.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Image src={SAL_BADGE.src} alt="ANPC – Soluționarea alternativă a litigiilor" width={250} height={50} />
        </a>
      )}

      <p className="mt-8 text-sm text-stone-400">
        © {new Date().getFullYear()} MiciiEroi · {SELLER_NAME}
      </p>
    </footer>
  );
}
