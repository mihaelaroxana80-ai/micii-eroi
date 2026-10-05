// Central site settings. Values come from .env.local; NEXT_PUBLIC_* values are
// baked in at build time, so rebuild/restart after changing them.

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// 1) REAL TRANSACTIONS (Stripe payment + stored orders). OFF unless explicitly enabled.
// Turning it on requires a registered business and reviewed legal pages (see docs/LAUNCH_CHECKLIST.md).
export const ORDERING_ENABLED = process.env.NEXT_PUBLIC_ORDERING_ENABLED === "true";

// 2) SHOPPING INTERFACE (add to cart, cart page, quantities). Independent of real transactions:
// on by default in local development so the full flow can be tested; set
// NEXT_PUBLIC_SHOP_UI_ENABLED=false to preview the public catalog-only view. In production it is
// shown only when real ordering is live.
export const SHOP_UI_ENABLED =
  ORDERING_ENABLED || (!IS_PRODUCTION && process.env.NEXT_PUBLIC_SHOP_UI_ENABLED !== "false");

// Test mode: full shopping interface, but checkout is simulated — never in production.
export const TEST_MODE = SHOP_UI_ENABLED && !ORDERING_ENABLED && !IS_PRODUCTION;

export const PRELAUNCH_MESSAGE = "Magazin în pregătire — momentan nu preluăm comenzi.";
function clean(value: string | undefined) {
  const v = value?.trim();
  return v ? v : null;
}

// International format, digits only (e.g. 407xxxxxxxx). Anything else is treated as not configured.
function whatsappNumber(value: string | undefined) {
  const digits = clean(value)?.replace(/[\s+()-]/g, "") ?? null;
  return digits && /^\d{8,15}$/.test(digits) ? digits : null;
}

function email(value: string | undefined) {
  const v = clean(value);
  return v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : null;
}

// Unset contact methods are hidden everywhere instead of showing placeholder details.
// Romanian phone as displayed (e.g. 0730268155); digits/spaces/+ only.
function phone(value: string | undefined) {
  const v = clean(value);
  return v && /^\+?[\d\s]{8,16}$/.test(v) ? v : null;
}

export const CONTACT = {
  whatsapp: whatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  email: email(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  phone: phone(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  hours: clean(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
};

export const HAS_CONTACT = Boolean(CONTACT.whatsapp || CONTACT.email || CONTACT.phone);

// General enquiries only; ordering does not happen over WhatsApp.
export function whatsappLink(text?: string) {
  if (!CONTACT.whatsapp) return null;
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telLink(value: string) {
  return `tel:${value.replace(/\s/g, "")}`;
}

// ANPC SAL pictogram. Disabled until the official file and placement rules under the
// current ANPC order are verified (see docs/LAUNCH_CHECKLIST.md). Set src to a file in /public.
export const SAL_BADGE: { enabled: boolean; src: string; href: string } = {
  enabled: false,
  src: "",
  href: "",
};

// Tiny warm-cream blur shown while product images load.
export const BLUR_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><rect width='8' height='8' fill='#f6e3c6'/></svg>",
)}`;
