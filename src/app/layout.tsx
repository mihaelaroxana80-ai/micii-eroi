import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MiciiEroi - Costume pentru Copii",
  description: "Costume pentru serbări, petreceri și zile pline de imaginație.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream text-base text-ink">
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
