import { LegalPage, Section, legalMetadata } from "@/components/LegalPage";
import { CONTACT } from "@/lib/config";
import { LEGAL_LAST_UPDATED, SELLER_NAME } from "@/lib/legal";

export const metadata = legalMetadata("returns");

export default function ReturnsPage() {
  const email = CONTACT.email ? (
    <a href={`mailto:${CONTACT.email}`} className="text-brand underline">
      {CONTACT.email}
    </a>
  ) : (
    "adresa noastră de e-mail"
  );

  return (
    <LegalPage page="returns">
      <Section title="Dreptul de retragere — 14 zile">
        <p>
          Ai dreptul să te retragi din contract în termen de <strong>14 zile calendaristice</strong>, fără a preciza
          motivul și fără penalități. Termenul începe din ziua în care tu (sau o persoană indicată de tine, alta decât
          curierul) intri în posesia produsului (OUG nr. 34/2014).
        </p>
      </Section>

      <Section title="Cum faci returul">
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Trimite-ne un e-mail la {email}, cu numărul comenzii și produsele pe care le returnezi. Poți folosi modelul
            de formular de mai jos, dar nu este obligatoriu.
          </li>
          <li>Îți răspundem cu adresa la care trimiți coletul.</li>
          <li>
            Trimite produsele fără întârzieri nejustificate, cel târziu în 14 zile de la data la care ne-ai anunțat
            retragerea.
          </li>
        </ol>
      </Section>

      <Section title="Starea produselor">
        <p>
          Te rugăm să returnezi produsele complete, cu toate accesoriile, nefolosite și, de preferință, în ambalajul
          original. Poți verifica produsul așa cum ai face-o într-un magazin. Răspunzi doar pentru diminuarea valorii
          produsului rezultată din manipularea lui în alt mod decât cel necesar pentru a-i stabili natura,
          caracteristicile și funcționarea.
        </p>
      </Section>

      <Section title="Costul returului">
        <p>Costul direct al trimiterii produselor înapoi este suportat de client.</p>
      </Section>

      <Section title="Rambursarea">
        <p>
          Îți returnăm toate sumele primite pentru produsele returnate, inclusiv costul livrării standard plătit
          inițial, fără întârzieri nejustificate și în cel mult 14 zile de la data la care ne-ai informat despre
          decizia de retragere. Putem amâna rambursarea până la primirea produselor sau până când ne trimiți dovada
          expedierii lor, oricare dintre acestea intervine prima. Rambursarea se face prin aceeași metodă de plată
          folosită la comandă.
        </p>
      </Section>

      <Section title="Excepții">
        <p>Conform legii, dreptul de retragere nu se aplică, de exemplu, pentru:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>produsele realizate după specificațiile clientului sau personalizate în mod clar;</li>
          <li>
            produsele sigilate care nu pot fi returnate din motive de protecție a sănătății sau de igienă și care au
            fost desigilate după livrare.
          </li>
        </ul>
      </Section>

      <Section title="Model de formular de retragere">
        <div className="rounded-xl border border-line bg-white p-4 text-sm leading-relaxed">
          <p className="mb-2 italic">(completați și returnați acest formular doar dacă doriți să vă retrageți din contract)</p>
          <p>
            Către: {SELLER_NAME}
            {CONTACT.email ? `, ${CONTACT.email}` : ""}
          </p>
          <p className="mt-2">
            Vă informez prin prezenta cu privire la retragerea mea din contractul referitor la vânzarea următoarelor
            produse: …
          </p>
          <p>Comandate la data: … / Primite la data: …</p>
          <p>Numărul comenzii: …</p>
          <p>Numele consumatorului: …</p>
          <p>Adresa consumatorului: …</p>
          <p>Semnătura consumatorului (doar dacă formularul este transmis pe hârtie): …</p>
          <p>Data: …</p>
        </div>
      </Section>

      <p className="text-sm text-stone-500">Ultima actualizare: {LEGAL_LAST_UPDATED}</p>
    </LegalPage>
  );
}
