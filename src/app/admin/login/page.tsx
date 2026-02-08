import { redirect } from "next/navigation";

import { loginAction } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const [params, isAuth] = await Promise.all([searchParams, isAdminAuthenticated()]);
  if (isAuth) {
    redirect("/admin");
  }

  const hasError = params.error === "1";

  return (
    <section className="mx-auto max-w-xl space-y-5">
      <div className="ms-card-dark p-6 md:p-8">
        <p className="ms-kicker text-lime-300">Acces securise</p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-white">Connexion admin</h1>
        <p className="mt-2 text-sm font-semibold text-white/80">Entrez le code admin pour gerer la boutique.</p>
      </div>

      <div className="ms-card p-5 md:p-6">
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="ms-label" htmlFor="passcode">
              Code admin
            </label>
            <input id="passcode" name="passcode" type="password" placeholder="Votre code" required className="ms-input" />
          </div>

          {hasError ? (
            <p className="rounded-2xl border border-rose-300 bg-rose-100 px-4 py-2 text-sm font-bold text-rose-900">
              Code incorrect. Reessayez.
            </p>
          ) : null}

          <button type="submit" className="ms-btn-primary w-full">
            Se connecter
          </button>
        </form>
      </div>
    </section>
  );
}
