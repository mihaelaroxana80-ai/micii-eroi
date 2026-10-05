// Customer information pages. A page goes public (footer link + reachable in production)
// only after its missing information is supplied and the text is reviewed.
// Set `published: true` per page at that point — see docs/LAUNCH_CHECKLIST.md.
// Seller (natural person, no registered business yet). Contact details come from .env.local (CONTACT).
export const SELLER_NAME = "Mihaela-Roxana Frâncu";
export const LEGAL_LAST_UPDATED = "5 octombrie 2026";

export type LegalPageInfo ={ href: string; title: string; published: boolean };

export const LEGAL_PAGES = {
  merchant: { href: "/datele-comerciantului", title: "Datele comerciantului", published: false },
  terms: { href: "/termeni", title: "Termeni și condiții", published: true },
  shipping: { href: "/livrare-si-plata", title: "Livrare și plată", published: false },
  returns: { href: "/retur", title: "Politica de retur și dreptul de retragere", published: true },
  warranty: { href: "/garantie-si-reclamatii", title: "Garanția legală de conformitate și reclamații", published: false },
  privacy: { href: "/confidentialitate", title: "Politica de confidențialitate", published: true },
  cookies: { href: "/politica-de-cookie-uri", title: "Politica de cookie-uri", published: false },
} satisfies Record<string, LegalPageInfo>;

export type LegalPageKey = keyof typeof LEGAL_PAGES;

