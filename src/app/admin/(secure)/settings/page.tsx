import { isSupabaseConfigured } from "@/lib/supabase/server";

function statusBadge(ok: boolean) {
  return ok
    ? "inline-flex rounded-full border border-lime-300 bg-lime-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-lime-900"
    : "inline-flex rounded-full border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-rose-900";
}

export default function AdminSettingsPage() {
  const supabaseReady = isSupabaseConfigured();
  const supabaseUrlReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKeyReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasAdminPasscode = Boolean(process.env.ADMIN_PASSCODE);
  const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || "products";
  const hasStorageBucket = Boolean(storageBucket);
  const hasCustomPasscode = Boolean(
    process.env.ADMIN_PASSCODE && process.env.ADMIN_PASSCODE !== "makhouadmin123"
  );
  const onVercel = Boolean(process.env.VERCEL);
  const vercelUrl = process.env.VERCEL_URL || null;

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Configuration backend</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Parametres admin</h1>
        <p className="mt-2 text-sm font-semibold text-ink-700">
          Verification rapide de l environnement, des variables et de la connexion Supabase.
        </p>
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
              <span className="text-sm font-bold text-ink-900">Code admin personalise</span>
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
              <span className={statusBadge(supabaseUrlReady)}>{supabaseUrlReady ? "OK" : "Manquant"}</span>
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
          </div>
        </article>
      </section>

      <section className="ms-card p-5 md:p-6">
        <h2 className="font-display text-2xl font-black text-ink-950">Checklist Vercel</h2>
        <div className="mt-4 space-y-2 text-sm font-semibold text-ink-800">
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            1. Ajoute les 3 variables dans Vercel Project Settings {">"} Environment Variables.
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            2. Execute le script SQL dans le projet Supabase: <code>supabase/schema.sql</code>.
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
