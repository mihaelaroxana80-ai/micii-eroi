import { LegalPage, Section, Todo, legalMetadata } from "@/components/LegalPage";
import { CONTACT } from "@/lib/config";

export const metadata = legalMetadata("merchant");

export default function MerchantPage() {
  return (
    <LegalPage page="merchant">
      <Section title="Datele comerciantului">
        <ul className="list-disc space-y-1 pl-5">
          <li>Denumire: <Todo>denumirea legală (SRL / PFA / II)</Todo></li>
          <li>Sediu / adresă: <Todo>adresa completă</Todo></li>
          <li>Nr. de ordine în Registrul Comerțului: <Todo>J…</Todo></li>
          <li>CUI / CIF: <Todo>cod fiscal</Todo></li>
          <li>Plătitor de TVA: <Todo>da/nu, cod TVA dacă e cazul</Todo></li>
          <li>Capital social (dacă e cazul): <Todo>…</Todo></li>
        </ul>
      </Section>

      <Section title="Contact">
        <ul className="list-disc space-y-1 pl-5">
          <li>E-mail: {CONTACT.email ?? <Todo>adresă de e-mail (NEXT_PUBLIC_CONTACT_EMAIL)</Todo>}</li>
          <li>Telefon / WhatsApp: {CONTACT.whatsapp ? `+${CONTACT.whatsapp}` : <Todo>număr (NEXT_PUBLIC_WHATSAPP_NUMBER)</Todo>}</li>
          <li>Program: {CONTACT.hours ?? <Todo>program de asistență (NEXT_PUBLIC_SUPPORT_HOURS)</Todo>}</li>
          <li>Adresă pentru corespondență / retururi: <Todo>dacă diferă de sediu</Todo></li>
        </ul>
      </Section>

      <Section title="Soluționarea litigiilor">
        <p>
          <Todo>
            informarea privind ANPC și soluționarea alternativă a litigiilor (SAL), conform reglementărilor ANPC în
            vigoare — de verificat juridic
          </Todo>
        </p>
      </Section>
    </LegalPage>
  );
}
