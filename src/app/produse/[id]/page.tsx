import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductGallery } from "@/components/ProductGallery";
import { getProduct } from "@/lib/products";
import { getAvailableStock, stockBySize } from "@/lib/stock";

// Stock depends on paid orders, so render per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/produse/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return product
    ? { title: `${product.name} - MiciiEroi`, description: product.shortDescription }
    : { title: "Produs negăsit - MiciiEroi" };
}

export default async function ProductPage({ params }: PageProps<"/produse/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const stock = stockBySize(await getAvailableStock(), product);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-4 pb-12 sm:pt-6">
      <Link href="/#catalog" className="mb-4 inline-flex min-h-11 items-center font-semibold text-stone-500 hover:text-brand">
        ← Înapoi la costume
      </Link>
      {/* Mobile: gallery, then info. Desktop: two columns. */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductDetail product={product} stock={stock} />
      </div>
    </main>
  );
}
