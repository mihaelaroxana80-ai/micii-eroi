import { LegalPage, Section, Todo, legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("shipping");

export default function ShippingPage() {
  return (
    <LegalPage page="shipping">
      <Section title="Zona de livrare">
        <p><Todo>unde se livrează (doar România? localități excluse?)</Todo></p>
      </Section>
      <Section title="Curier și termen de livrare">
        <p><Todo>firma de curierat și termenul estimat, confirmate cu curierul</Todo></p>
      </Section>
      <Section title="Costuri de livrare">
        <p>
          <Todo>
            costurile confirmate la lansare (configurarea actuală a site-ului: 17 lei, gratuit pentru comenzi de minimum
            200 lei — de confirmat)
          </Todo>
        </p>
      </Section>
      <Section title="Metode de plată">
        <p><Todo>metodele de plată active la lansare (ex.: card prin procesatorul ales)</Todo></p>
      </Section>
      <Section title="Factura">
        <p><Todo>cum și când se emite factura — de stabilit cu contabilul</Todo></p>
      </Section>
      <Section title="Colete deteriorate sau incomplete">
        <p><Todo>ce trebuie să facă clientul și în ce termen</Todo></p>
      </Section>
    </LegalPage>
  );
}
