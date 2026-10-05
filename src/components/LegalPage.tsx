import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_PAGES, type LegalPageKey } from "@/lib/legal";

export function legalMetadata(key: LegalPageKey): Metadata {
  const page = LEGAL_PAGES[key];
  return {
    title: `${page.title} - MiciiEroi`,
    // Drafts must never be indexed.
    robots: page.published ? undefined : { index: false, follow: false },
  };
}

// Unpublished drafts: 404 in production, previewable with a warning banner in `next dev`.
export function LegalPage({ page: key, children }: { page: LegalPageKey; children: React.ReactNode }) {
  const page = LEGAL_PAGES[key];
  if (!page.published && process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      {!page.published && (
        <p role="note" className="mb-6 rounded-xl border-2 border-dashed border-orange-400 bg-orange-50 p-4 text-base font-semibold text-orange-900">
          CIORNĂ — pagină nepublicată, vizibilă doar în modul de dezvoltare. Necesită completarea informațiilor marcate și
          verificare juridică înainte de publicare.
        </p>
      )}
      <h1 className="mb-8 text-3xl font-extrabold text-ink sm:text-4xl">{page.title}</h1>
      <div className="space-y-8 text-base leading-relaxed text-stone-700">{children}</div>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-extrabold text-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

// Marks information the owner still has to supply; never shown in production (drafts 404 there).
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-yellow-100 px-1 text-yellow-900">[De completat: {children}]</mark>;
}
