import { LegalPage, Section, Todo, legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("warranty");

export default function WarrantyPage() {
  return (
    <LegalPage page="warranty">
      <Section title="Garanția legală de conformitate">
        <p><Todo>drepturile consumatorului și termenele aplicabile conform legislației în vigoare — de verificat juridic</Todo></p>
      </Section>
      <Section title="Garanție comercială">
        <p><Todo>doar dacă se oferă o garanție comercială suplimentară; altfel se elimină secțiunea</Todo></p>
      </Section>
      <Section title="Cum depui o reclamație">
        <p><Todo>canalul de reclamații (e-mail / adresă), informațiile necesare, termenul de răspuns</Todo></p>
      </Section>
      <Section title="Soluționarea alternativă a litigiilor">
        <p><Todo>informarea ANPC / SAL conform ordinului ANPC în vigoare — de verificat juridic</Todo></p>
      </Section>
    </LegalPage>
  );
}
