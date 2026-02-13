import { updateSiteSettingsAction } from "@/app/admin/actions";
import { getSiteSettings } from "@/lib/data-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const DEFAULT_SUPABASE_URL = "https://xjmfycgzqsgnddlhhcoh.supabase.co";

type Props = {
  searchParams: Promise<{ ok?: string; error?: string }>;
};

function statusBadge(ok: boolean) {
  return ok
    ? "inline-flex rounded-full border border-lime-300 bg-lime-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-lime-900"
    : "inline-flex rounded-full border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-rose-900";
}

export default async function AdminSettingsPage({ searchParams }: Props) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);
  const supabaseReady = isSupabaseConfigured();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseUrlReady = Boolean(supabaseUrl);
  const supabaseKeyReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasAdminPasscode = Boolean(process.env.ADMIN_PASSCODE);
  const hasWhatsAppOrderNumber = Boolean(process.env.WHATSAPP_ORDER_NUMBER);
  const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || "products";
  const hasStorageBucket = Boolean(storageBucket);
  const hasCustomPasscode = Boolean(
    process.env.ADMIN_PASSCODE && process.env.ADMIN_PASSCODE !== "150803"
  );
  const onVercel = Boolean(process.env.VERCEL);
  const vercelUrl = process.env.VERCEL_URL || null;

  const hasError = Boolean(params.error);
  const message = params.error
    ? `Erreur: ${params.error}`
    : params.ok === "site"
      ? "Configuration du site mise a jour."
      : null;

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Controle du site</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Reglages boutique</h1>
        <p className="mt-2 text-sm font-semibold text-ink-700">
          Cette page pilote les textes visibles cote client (accueil et footer).
        </p>
      </section>

      {message ? (
        <section
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            hasError
              ? "border-rose-300 bg-rose-100 text-rose-900"
              : "border-lime-300 bg-lime-100 text-ink-900"
          }`}
        >
          {message}
        </section>
      ) : null}

      <section className="ms-card p-5 md:p-6">
        <h2 className="font-display text-3xl font-black text-ink-950">Texte site client</h2>
        <form action={updateSiteSettingsAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label" htmlFor="heroBadge">
              Badge accueil
            </label>
            <input id="heroBadge" name="heroBadge" defaultValue={settings.heroBadge} className="ms-input" />
          </div>

          <div>
            <label className="ms-label" htmlFor="heroTitle">
              Titre accueil
            </label>
            <input id="heroTitle" name="heroTitle" defaultValue={settings.heroTitle} className="ms-input" />
          </div>

          <div className="md:col-span-2">
            <label className="ms-label" htmlFor="heroSubtitle">
              Sous-titre accueil
            </label>
            <textarea
              id="heroSubtitle"
              name="heroSubtitle"
              defaultValue={settings.heroSubtitle}
              rows={3}
              className="ms-textarea"
            />
          </div>

          <div>
            <label className="ms-label" htmlFor="heroPrimaryCtaLabel">
              Bouton principal (label)
            </label>
            <input
              id="heroPrimaryCtaLabel"
              name="heroPrimaryCtaLabel"
              defaultValue={settings.heroPrimaryCtaLabel}
              className="ms-input"
            />
          </div>

          <div>
            <label className="ms-label" htmlFor="heroPrimaryCtaHref">
              Bouton principal (lien)
            </label>
            <input
              id="heroPrimaryCtaHref"
              name="heroPrimaryCtaHref"
              defaultValue={settings.heroPrimaryCtaHref}
              className="ms-input"
            />
          </div>

          <div>
            <label className="ms-label" htmlFor="heroSecondaryCtaLabel">
              Bouton secondaire (label)
            </label>
            <input
              id="heroSecondaryCtaLabel"
              name="heroSecondaryCtaLabel"
              defaultValue={settings.heroSecondaryCtaLabel}
              className="ms-input"
            />
          </div>

          <div>
            <label className="ms-label" htmlFor="heroSecondaryCtaHref">
              Bouton secondaire (lien)
            </label>
            <input
              id="heroSecondaryCtaHref"
              name="heroSecondaryCtaHref"
              defaultValue={settings.heroSecondaryCtaHref}
              className="ms-input"
            />
          </div>

          <div>
            <label className="ms-label" htmlFor="footerLocation">
              Footer: ville
            </label>
            <input
              id="footerLocation"
              name="footerLocation"
              defaultValue={settings.footerLocation}
              className="ms-input"
            />
          </div>

          <div>
            <label className="ms-label" htmlFor="footerContactLabel">
              Footer: contact
            </label>
            <input
              id="footerContactLabel"
              name="footerContactLabel"
              defaultValue={settings.footerContactLabel}
              className="ms-input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="ms-label" htmlFor="footerDeliveryNote">
              Footer: livraison
            </label>
            <input
              id="footerDeliveryNote"
              name="footerDeliveryNote"
              defaultValue={settings.footerDeliveryNote}
              className="ms-input"
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="ms-btn-primary">
              Enregistrer les reglages
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="ms-card p-5 md:p-6">
          <h2 className="font-display text-2xl font-black text-ink-950">Etat global</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">Backend Supabase</span>
              <span className={statusBadge(supabaseReady)}>{supabaseReady ? "Actif" : "Inactif"}</span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">Environnement Vercel</span>
              <span className={statusBadge(onVercel)}>{onVercel ? "Actif" : "Local"}</span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">Code admin personnalise</span>
              <span className={statusBadge(hasCustomPasscode)}>
                {hasCustomPasscode ? "Oui" : "Defaut"}
              </span>
            </div>
          </div>
        </article>

        <article className="ms-card p-5 md:p-6">
          <h2 className="font-display text-2xl font-black text-ink-950">Variables critiques</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className={statusBadge(supabaseUrlReady)}>
                {supabaseUrlReady ? "OK" : "Manquant"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className={statusBadge(supabaseKeyReady)}>{supabaseKeyReady ? "OK" : "Manquant"}</span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">ADMIN_PASSCODE</span>
              <span className={statusBadge(hasAdminPasscode)}>{hasAdminPasscode ? "OK" : "Manquant"}</span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">SUPABASE_STORAGE_BUCKET</span>
              <span className={statusBadge(hasStorageBucket)}>
                {hasStorageBucket ? `OK (${storageBucket})` : "Manquant"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-sm font-bold text-ink-900">WHATSAPP_ORDER_NUMBER</span>
              <span className={statusBadge(hasWhatsAppOrderNumber)}>
                {hasWhatsAppOrderNumber ? "OK" : "Manquant"}
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="ms-card p-5 md:p-6">
        <h2 className="font-display text-2xl font-black text-ink-950">Checklist Vercel</h2>
        <div className="mt-4 space-y-2 text-sm font-semibold text-ink-800">
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            1. Ajoute les 5 variables dans Vercel Project Settings {">"} Environment Variables.
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            2. Execute les scripts SQL dans Supabase: <code>supabase/schema.sql</code>,{" "}
            <code>supabase/storage.sql</code>, puis <code>supabase/seed.sql</code>.
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            3. Redeploie l application pour appliquer la configuration.
          </p>
          {vercelUrl ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              URL Vercel detectee: <code>{vercelUrl}</code>
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
