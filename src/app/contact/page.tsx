import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CONTACT, HAS_CONTACT, telLink } from "@/lib/config";

export const metadata: Metadata = { title: "Contact - MiciiEroi" };

// Public contact page: shows only contact details configured in .env.local.
export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Contact</h1>
      <p className="mt-2 mb-6 text-lg text-stone-500">Te ajutăm cu informații despre costume, mărimi și livrare.</p>

      {HAS_CONTACT ? (
        <div className="card space-y-5 p-6 text-base">
          {CONTACT.whatsapp && (
            <div>
              <WhatsAppButton />
            </div>
          )}
          <ul className="space-y-3">
            {CONTACT.email && (
              <ContactRow icon="📧">
                <a href={`mailto:${CONTACT.email}`} className="text-brand underline hover:text-ink">
                  {CONTACT.email}
                </a>
              </ContactRow>
            )}
            {CONTACT.phone && (
              <ContactRow icon="📞">
                <a href={telLink(CONTACT.phone)} className="text-brand underline hover:text-ink">
                  {CONTACT.phone}
                </a>
              </ContactRow>
            )}
            {CONTACT.hours && <ContactRow icon="🕐">{CONTACT.hours}</ContactRow>}
          </ul>
        </div>
      ) : (
        <div className="card p-6 text-base text-stone-600">Datele de contact vor fi publicate în curând.</div>
      )}
    </main>
  );
}

function ContactRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <li className="flex min-h-11 items-center gap-3">
      <span aria-hidden className="text-xl">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}
