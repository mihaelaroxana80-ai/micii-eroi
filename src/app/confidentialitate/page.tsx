import { LegalPage, Section, legalMetadata } from "@/components/LegalPage";
import { CONTACT } from "@/lib/config";
import { LEGAL_LAST_UPDATED, SELLER_NAME } from "@/lib/legal";

export const metadata = legalMetadata("privacy");

// Factual parts reflect what the code actually does. Re-check whenever a feature,
// form, service or tracking tool is added.
export default function PrivacyPage() {
  const email = CONTACT.email ? (
    <a href={`mailto:${CONTACT.email}`} className="text-brand underline">
      {CONTACT.email}
    </a>
  ) : null;

  return (
    <LegalPage page="privacy">
      <Section title="Cine este operatorul datelor">
        <p>
          Operatorul datelor tale personale este <strong>{SELLER_NAME}</strong>, persoană fizică
          {email ? <>, e-mail: {email}</> : null}.
        </p>
      </Section>

      <Section title="Ce date colectăm">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Când plasezi o comandă:</strong> nume, telefon, e-mail, adresa de livrare, produsele comandate și
            valoarea comenzii.
          </li>
          <li>
            <strong>Când ne scrii</strong> pe e-mail, telefon sau WhatsApp: datele pe care ni le trimiți în mesaj.
          </li>
        </ul>
        <p>
          Navigarea în catalog nu necesită date personale. Site-ul nu folosește cookie-uri, instrumente de analiză
          (analytics) sau publicitate. Produsele din coș se salvează doar în browserul tău (localStorage), pe
          dispozitivul tău.
        </p>
      </Section>

      <Section title="De ce folosim datele și pe ce temei">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Procesarea, livrarea și gestionarea comenzilor, inclusiv retururi și reclamații — temei: executarea
            contractului (art. 6 alin. (1) lit. b) GDPR).
          </li>
          <li>Răspunsul la întrebările tale — temei: demersuri la cererea ta (art. 6 alin. (1) lit. b) GDPR).</li>
          <li>
            Respectarea obligațiilor legale (de exemplu, păstrarea documentelor financiare) — temei: obligație legală
            (art. 6 alin. (1) lit. c) GDPR).
          </li>
        </ul>
      </Section>

      <Section title="Plățile">
        <p>
          Plățile cu cardul sunt procesate de Stripe, pe pagina securizată a acestuia. Nu primim și nu stocăm datele
          cardului tău. Stripe prelucrează datele de plată conform propriei{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            politici de confidențialitate
          </a>
          .
        </p>
      </Section>

      <Section title="Cui transmitem datele">
        <p>Nu vindem datele tale. Le transmitem doar în măsura necesară:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>procesatorului de plăți (Stripe), pentru plata comenzii;</li>
          <li>firmei de curierat, pentru livrare (nume, telefon, adresă);</li>
          <li>furnizorului de găzduire a site-ului;</li>
          <li>WhatsApp (Meta), doar dacă alegi să ne contactezi prin WhatsApp.</li>
        </ul>
        <p>
          Unii dintre acești furnizori pot prelucra date și în afara Spațiului Economic European, cu garanțiile
          prevăzute de GDPR.
        </p>
      </Section>

      <Section title="Cât timp păstrăm datele">
        <p>
          Păstrăm datele pe durata necesară procesării comenzii și, ulterior, doar atât cât ne obligă legea (de exemplu,
          obligațiile privind documentele financiare). Mesajele de contact le păstrăm cât este necesar pentru a-ți
          răspunde.
        </p>
      </Section>

      <Section title="Drepturile tale">
        <p>
          Ai dreptul de acces, de rectificare, de ștergere, de restricționare a prelucrării, de portabilitate a datelor
          și dreptul de opoziție. Pentru exercitarea lor, scrie-ne{email ? <> la {email}</> : null}.
        </p>
        <p>
          Ai, de asemenea, dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
          Caracter Personal (
          <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            dataprotection.ro
          </a>
          ).
        </p>
        <p>Nu luăm decizii bazate exclusiv pe prelucrare automată și nu creăm profiluri.</p>
      </Section>

      <p className="text-sm text-stone-500">Ultima actualizare: {LEGAL_LAST_UPDATED}</p>
    </LegalPage>
  );
}
