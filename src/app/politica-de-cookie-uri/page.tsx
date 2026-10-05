import { LegalPage, Section, Todo, legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("cookies");

// Reflects the current code: no cookies, one strictly necessary localStorage entry.
// If analytics, ads or embeds are ever added, a working consent mechanism is needed first.
export default function CookiesPage() {
  return (
    <LegalPage page="cookies">
      <Section title="Folosim cookie-uri?">
        <p>
          Site-ul MiciiEroi nu setează cookie-uri și nu folosește instrumente de analiză, publicitate sau urmărire.
          De aceea nu afișăm un banner de consimțământ.
        </p>
      </Section>

      <Section title="Memoria locală a browserului (localStorage)">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-4">Nume</th>
              <th className="py-2 pr-4">Scop</th>
              <th className="py-2">Durată</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line align-top">
              <td className="py-2 pr-4 font-mono">miciieroi-cart</td>
              <td className="py-2 pr-4">
                Păstrează produsele din coș. Strict necesar pentru serviciul cerut; folosit doar când comenzile sunt
                active.
              </td>
              <td className="py-2">Până la plasarea comenzii sau ștergerea datelor din browser</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Servicii terțe">
        <p>
          La plata cu cardul ești redirecționat pe pagina procesatorului de plăți, care poate folosi propriile cookie-uri
          conform politicii sale. <Todo>numele procesatorului și link către politica lui — de confirmat la lansare</Todo>
        </p>
      </Section>

      <Section title="Data ultimei actualizări">
        <p><Todo>data</Todo></p>
      </Section>
    </LegalPage>
  );
}
