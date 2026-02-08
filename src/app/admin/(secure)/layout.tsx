import { redirect } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const backendLabel = isSupabaseConfigured() ? "Supabase" : "Supabase non configure";
  const environmentLabel = process.env.VERCEL ? "Vercel" : "Local";
  const domain = process.env.VERCEL_URL;

  return (
    <div className="space-y-6">
      <section className="ms-card-dark p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="ms-kicker text-sky-200">Espace securise</p>
            <h1 className="mt-1 font-display text-3xl font-black text-white">Admin Makhou Sport</h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              Catalogue, commandes et configuration de la boutique.
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl border border-rose-300/50 bg-rose-500/20 px-4 py-2 text-sm font-black text-rose-100 transition hover:bg-rose-500/30"
            >
              Deconnexion
            </button>
          </form>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
            Backend: {backendLabel}
          </span>
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
            Env: {environmentLabel}
          </span>
          {domain ? (
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
              {domain}
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          <AdminNav />
        </div>
      </section>

      {children}
    </div>
  );
}
