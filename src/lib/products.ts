export type Variant = {
  size: string;
  cm: number | null;
  stock: number;
  // Overrides the product price for this size, when set.
  price?: number;
};

export type Party = {
  name: string;
  // Postal address (and electronic address, if any).
  address: string;
  contact?: string;
};

// Product safety / traceability information (EU GPSR 2023/988 and applicable Romanian rules).
// Fill ONLY from the product, its label/packaging or the supplier's documents — never guess.
// Every field is optional and the product page shows only what is filled in.
export type ProductCompliance = {
  manufacturer?: Party;
  // Required when the manufacturer is not established in the EU.
  euResponsiblePerson?: Party;
  identifiers?: { brand?: string; model?: string; sku?: string; ean?: string; batch?: string };
  // Romanian safety warnings exactly as on the label/packaging.
  safetyWarnings?: string[];
};

export type Product = {
  id: string;
  name: string;
  // Base price; a variant's own price takes precedence.
  price: number;
  shortDescription: string;
  details: string;
  features: string[];
  category: "costume" | "accesorii";
  // Gallery images; the first is the main photo.
  images: string[];
  variants: Variant[];
  // Not yet supplied for any product — see docs/LAUNCH_CHECKLIST.md.
  compliance?: ProductCompliance;
};

export const PRODUCTS: Product[] = [
  {
    id: "costum-superman",
    name: "Costum Superman",
    price: 109.88,
    shortDescription: "Costum de super-erou cu salopetă și pelerină, perfect pentru serbări și petreceri.",
    details:
      "Costumul Superman include o salopetă imprimată cu musculatură și sigla S, plus o pelerină roșie detașabilă. Design realist și atractiv, potrivit pentru carnaval, Halloween și petreceri tematice.",
    features: ["Salopetă cu imprimeu muscular", "Pelerină roșie inclusă", "Închidere ușoară", "Design oficial Superman"],
    category: "costume",
    images: ["/products/superman-1.png", "/products/superman-2.png"],
    variants: [
      { size: "3/4 ani", cm: 104, stock: 3 },
      { size: "4/6 ani", cm: 110, stock: 3 },
    ],
  },
  {
    id: "costum-vulpe",
    name: "Costum Vulpe",
    price: 99.88,
    shortDescription: "Rochie tutu de vulpiță cu glugă și detalii pufoase, ideală pentru serbări de toamnă.",
    details:
      "Costumul Vulpe include o rochie tutu portocalie cu sclipici și o glugă cu urechi de vulpe și față 3D. Perfectă pentru Halloween, carnaval și serbări.",
    features: ["Rochie tutu cu sclipici", "Glugă cu urechi de vulpe", "Coadă decorativă inclusă", "Material moale și confortabil"],
    category: "costume",
    images: ["/products/vulpe-1.png", "/products/vulpe-2.png", "/products/vulpe-3.png"],
    variants: [
      { size: "3/4 ani", cm: 104, stock: 2 },
      { size: "4/6 ani", cm: 110, stock: 2 },
      { size: "7/8 ani", cm: 128, stock: 2 },
    ],
  },
  {
    id: "costum-catelus",
    name: "Costum Cățeluș",
    price: 89.88,
    shortDescription: "Salopetă onesie de dalmațian, moale și caldă, cu glugă și coadă decorativă.",
    details:
      "Costumul Cățeluș este o salopetă tip onesie albă cu pete negre, glugă cu urechi și nas de câine și coadă decorativă. Fermoar față pentru îmbrăcare ușoară. Mărimea 10/12 ani (146 cm) este cea mai mare mărime disponibilă.",
    features: [
      "Salopetă onesie completă",
      "Glugă cu urechi și detalii adorabile",
      "Coadă decorativă",
      "Fermoar față",
      "Material pluș moale",
    ],
    category: "costume",
    images: ["/products/catelus-1.png", "/products/catelus-2.png", "/products/catelus-3.png"],
    variants: [
      { size: "8/10 ani", cm: 134, stock: 2, price: 89.88 },
      { size: "10/12 ani", cm: 146, stock: 2, price: 99.88 },
    ],
  },
  {
    id: "costum-ursulet",
    name: "Costum Ursuleț",
    price: 89.88,
    shortDescription: "Salopetă onesie de ursuleț, călduroasă și confortabilă, cu glugă cu urechi.",
    details:
      "Costumul Ursuleț este o salopetă maro cu detaliu burtic bej, glugă cu urechi rotunde și fermoar față. Ideal pentru petreceri, carnaval și zile reci.",
    features: [
      "Salopetă onesie completă",
      "Glugă cu urechi de urs",
      "Detaliu burtic bej",
      "Fermoar față",
      "Material confortabil și rezistent",
    ],
    category: "costume",
    images: ["/products/ursulet-1.png", "/products/ursulet-2.png", "/products/ursulet-3.png"],
    variants: [{ size: "6/8 ani", cm: 128, stock: 6 }],
  },
  {
    id: "costum-albinuta",
    name: "Costum Albinuță",
    price: 99.88,
    shortDescription: "Rochie de balerină albinuță cu tutu galben-negru, aripioare și bentiță cu antene.",
    details:
      "Costumul Albinuță include o rochie cu dungi galbene și negre, fustă tutu cu volane, aripioare decorative și bentiță cu antene pufoase. Accesoriile sunt incluse în pachet.",
    features: [
      "Rochie cu dungi albinuță",
      "Fustă tutu cu volane",
      "Aripioare incluse",
      "Bentiță cu antene pufoase",
      "Detaliu floare pe corsaj",
    ],
    category: "costume",
    images: ["/products/albinuta-1.png", "/products/albinuta-2.png", "/products/albinuta-3.png"],
    variants: [
      { size: "2/3 ani", cm: 98, stock: 3 },
      { size: "6/8 ani", cm: 128, stock: 5 },
    ],
  },
  {
    id: "costum-buburuza",
    name: "Costum Buburuză",
    price: 99.88,
    shortDescription: "Rochie de balerină buburuză roșie cu buline negre, aripioare și bentiță cu antene.",
    details:
      "Costumul Buburuză include o rochie roșie cu buline negre, fustă tutu cu volane, aripioare decorative și bentiță cu antene roșii pufoase. Set complet pentru petreceri și serbări.",
    features: [
      "Rochie roșie cu buline negre",
      "Fustă tutu cu volane",
      "Aripioare incluse",
      "Bentiță cu antene roșii",
      "Baghetă magică inclusă",
    ],
    category: "costume",
    images: ["/products/buburuza-1.png", "/products/buburuza-2.png", "/products/buburuza-3.png"],
    variants: [
      { size: "3/4 ani", cm: 105, stock: 3 },
      { size: "4/6 ani", cm: 110, stock: 5 },
      { size: "6/8 ani", cm: 128, stock: 3 },
    ],
  },
  {
    id: "costum-bluey",
    name: "Costum Bluey",
    price: 109.88,
    shortDescription: "Costum oficial Bluey din material 100% reciclat, cu mască și coadă decorativă.",
    details:
      "Costumul Bluey este un produs oficial Amscan, realizat din material 100% reciclat. Include salopetă albastru deschis, mască Bluey și coadă decorativă. Potrivit pentru fani Bluey de 2-6 ani.",
    features: [
      "Produs oficial licențiat Bluey",
      "Material 100% reciclat",
      "Mască Bluey inclusă",
      "Coadă decorativă",
      "Disponibil pentru 2-3 ani și 4-6 ani",
    ],
    category: "costume",
    images: ["/products/bluey-1.png", "/products/bluey-2.png", "/products/bluey-3.png"],
    variants: [
      { size: "2/3 ani", cm: 98, stock: 2 },
      { size: "4/6 ani", cm: 110, stock: 4 },
    ],
  },
  {
    id: "farfurii-bluey",
    name: "Farfurii Bluey set 8 buc",
    price: 21.88,
    shortDescription: "Set de 8 farfurii de hârtie cu design oficial Bluey, pentru petreceri tematice.",
    details:
      "Farfuriile Bluey sunt fabricate din hârtie certificată FSC, cu design colorat oficial. Diametru 23 cm, potrivite pentru tort și gustări la petreceri tematice Bluey.",
    features: ["8 bucăți în set", "Design oficial Bluey", "Hârtie certificată FSC", "Diametru 23 cm", "Produs eco-friendly"],
    category: "accesorii",
    images: ["/products/farfurii-1.png", "/products/farfurii-2.png"],
    variants: [{ size: "Set 8 buc", cm: null, stock: 36 }],
  },
  {
    id: "peruca-electra",
    name: "Perucă Electra Glow in Dark",
    price: 79.88,
    shortDescription: "Perucă lungă albă cu breton drept, ideală pentru costume și petreceri.",
    details:
      "Peruca Electra Platinum White are păr drept lung până la umeri, cu breton drept. Ușoară și confortabilă la purtat. Potrivită pentru costume diverse, petreceri și evenimente.",
    features: [
      "Culoare alb platinat",
      "Păr drept cu breton",
      "Ușoară și confortabilă",
      "Mărime universală",
      "Luminează în întuneric (Glow in the Dark)",
    ],
    category: "accesorii",
    images: ["/products/peruuca-1.png"],
    variants: [{ size: "Mărime unică", cm: null, stock: 2 }],
  },
];

export const FREE_SHIPPING_THRESHOLD = 200;
export const SHIPPING_COST = 17;

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

// Price for one size: the variant's own price, else the product price.
export function priceFor(product: Product, size: string | null) {
  const variant = size ? product.variants.find((v) => v.size === size) : undefined;
  return variant?.price ?? product.price;
}

// Lowest price across sizes, and whether sizes differ in price.
export function priceRange(product: Product) {
  const prices = product.variants.map((v) => v.price ?? product.price);
  const min = Math.min(...prices);
  return { min, varies: prices.some((p) => p !== min) };
}

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}
