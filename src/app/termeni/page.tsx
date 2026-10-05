import Link from "next/link";
import { LegalPage, Section, legalMetadata } from "@/components/LegalPage";
import { CONTACT, telLink } from "@/lib/config";
import { LEGAL_LAST_UPDATED, LEGAL_PAGES, SELLER_NAME } from "@/lib/legal";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/products";

export const metadata = legalMetadata("terms");

export default function TermsPage() {
  return (
    <LegalPage page="terms">
      <Section title="1. Vânzătorul">
        <p>
          Produsele de pe acest site sunt vândute de <strong>{SELLER_NAME}</strong>, persoană fizică.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {CONTACT.email && (
            <li>
              E-mail:{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-brand underline">
                {CONTACT.email}
              </a>
            </li>
          )}
          {CONTACT.phone && (
            <li>
              Telefon:{" "}
              <a href={telLink(CONTACT.phone)} className="text-brand underline">
                {CONTACT.phone}
              </a>
            </li>
          )}
        </ul>
      </Section>

      <Section title="2. Produse">
        <p>
          Pe site sunt prezentate costume pentru copii și accesorii pentru petreceri, vândute online. Fiecare produs are
          descrierea, mărimile disponibile și prețul afișate pe pagina sa. Fotografiile au rol de prezentare; pot exista
          mici diferențe de culoare față de produsul real, în funcție de ecranul folosit.
        </p>
      </Section>

      <Section title="3. Prețuri">
        <p>
          Prețurile sunt exprimate în lei (RON) și reprezintă prețul final al produsului. Costul livrării este afișat
          separat în coș, înainte de finalizarea comenzii.
        </p>
      </Section>

      <Section title="4. Comanda">
        <p>
          Alegi produsele și mărimile, le adaugi în coș și finalizezi comanda prin plata online. Contractul se încheie în
          momentul confirmării comenzii. Dacă un produs nu mai este disponibil, te anunțăm și îți returnăm integral suma
          plătită pentru acesta.
        </p>
      </Section>

      <Section title="5. Livrare">
        <ul className="list-disc space-y-1 pl-5">
          <li>Livrăm în România, prin curier.</li>
          <li>
            Costul livrării este de {SHIPPING_COST} lei; livrarea este gratuită pentru comenzile de minimum{" "}
            {FREE_SHIPPING_THRESHOLD} lei.
          </li>
          <li>Termenul estimat de livrare este de 3–5 zile lucrătoare de la confirmarea comenzii.</li>
        </ul>
      </Section>

      <Section title="6. Plată">
        <p>
          Plata se face online, cu cardul bancar, prin procesatorul de plăți Stripe. Nu primim și nu stocăm datele
          cardului tău.
        </p>
      </Section>

      <Section title="7. Dreptul de retragere">
        <p>
          Ai dreptul să te retragi din contract în termen de 14 zile calendaristice de la primirea produsului, fără a
          preciza motivul, conform OUG nr. 34/2014. Toate detaliile, inclusiv modelul de formular de retragere, se găsesc
          în{" "}
          <Link href={LEGAL_PAGES.returns.href} className="text-brand underline">
            Politica de retur
          </Link>
          .
        </p>
      </Section>

      <Section title="8. Garanția legală de conformitate">
        <p>
          Produsele beneficiază de garanția legală de conformitate prevăzută de OUG nr. 140/2021. Dacă un produs are o
          problemă, scrie-ne
          {CONTACT.email ? (
            <>
              {" "}la{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-brand underline">
                {CONTACT.email}
              </a>
            </>
          ) : null}{" "}
          și îți vom răspunde cât mai repede.
        </p>
      </Section>

      <Section title="9. Date personale">
        <p>
          Modul în care folosim datele tale este descris în{" "}
          <Link href={LEGAL_PAGES.privacy.href} className="text-brand underline">
            Politica de confidențialitate
          </Link>
          .
        </p>
      </Section>

      <Section title="10. Litigii">
        <p>
          Încercăm să rezolvăm orice neînțelegere pe cale amiabilă — te rugăm să ne contactezi mai întâi. Dacă nu
          găsim o soluție, te poți adresa Autorității Naționale pentru Protecția Consumatorilor (
          <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            anpc.ro
          </a>
          ) sau instanțelor române competente. Acestor termeni li se aplică legea română.
        </p>
      </Section>

      <p className="text-sm text-stone-500">Ultima actualizare: {LEGAL_LAST_UPDATED}</p>
    </LegalPage>
  );
}
