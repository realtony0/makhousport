import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="ms-card mx-auto max-w-2xl p-10 text-center">
      <p className="ms-kicker">Erreur 404</p>
      <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Page introuvable</h1>
      <p className="mt-3 text-sm font-semibold text-ink-700">
        La ressource demandee n existe pas ou a ete supprimee.
      </p>
      <Link href="/" className="ms-btn-primary mt-6">
        Retour accueil
      </Link>
    </section>
  );
}
