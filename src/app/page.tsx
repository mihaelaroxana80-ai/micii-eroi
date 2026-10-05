import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { getAvailableStock, stockBySize } from "@/lib/stock";

// Stock depends on paid orders, so render per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const available = await getAvailableStock();

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 lg:min-h-[500px] lg:grid-cols-2 lg:py-16">
        <div>
          <span className="inline-block rounded-full bg-brand-tint px-4 py-1.5 text-sm font-bold text-brand">
            ✨ Costume pentru copii
          </span>
          <h1 className="mt-5 text-4xl leading-tight font-extrabold text-ink sm:text-5xl lg:text-6xl">
            Aventuri mari pentru eroi mici.
          </h1>
          <p className="mt-5 max-w-md text-lg text-stone-500">
            Costume pentru serbări, petreceri și zile pline de imaginație.
          </p>
          <a href="#catalog" className="btn-primary mt-8 px-8 text-lg">
            Descoperă costumele →
          </a>
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-2xl bg-white shadow-card sm:h-[460px]">
          <Image
            src="/products/vulpe-2.png"
            alt="Costum Vulpe pentru copii"
            fill
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-4"
          />
        </div>
      </section>

      <main id="catalog" className="mx-auto w-full max-w-6xl flex-1 scroll-mt-20 px-4 pt-4 pb-16">
        <h2 className="mb-6 text-3xl font-extrabold text-ink">Costumele noastre</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} stock={stockBySize(available, p)} />
          ))}
        </div>
      </main>
    </>
  );
}
