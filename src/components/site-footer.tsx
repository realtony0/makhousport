import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/data-store";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const orderContact = process.env.WHATSAPP_ORDER_NUMBER || null;

  return (
    <footer className="mt-14 border-t border-slate-200 bg-white/90">
      <div className="ms-container grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-3">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl border border-slate-200">
              <Image src="/logo.jpeg" alt="Logo Makhou Sport" fill className="object-cover" sizes="36px" />
            </span>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-slate-700">Makhou Sport</p>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-slate-700">
            Boutique de sport en ligne basee a Dakar.
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Navigation</p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-slate-700">
            <Link href="/" className="transition hover:text-slate-950">
              Accueil
            </Link>
            <Link href="/boutique" className="transition hover:text-slate-950">
              Boutique
            </Link>
            <Link href="/panier" className="transition hover:text-slate-950">
              Panier
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Paiements</p>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700">
            <li>Paiement a la livraison</li>
            <li>Orange Money</li>
            <li>Wave</li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Contact</p>
          <div className="mt-3 space-y-2 text-sm font-semibold text-slate-700">
            <p>{settings.footerLocation}</p>
            <p>{orderContact ? `${settings.footerContactLabel}: ${orderContact}` : settings.footerContactLabel}</p>
            <p>{settings.footerDeliveryNote}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs font-semibold text-slate-500">
        © {new Date().getFullYear()} Makhou Sport. Tous droits reserves.
      </div>
    </footer>
  );
}
