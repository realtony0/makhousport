import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Makhou Sport",
    template: "%s | Makhou Sport"
  },
  description: "Boutique de sport en ligne basee au Senegal (Dakar).",
  applicationName: "Makhou Sport"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased text-ink-950">{children}</body>
    </html>
  );
}
