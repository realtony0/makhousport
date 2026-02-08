import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction
} from "@/app/admin/actions";
import { getCategories } from "@/lib/data-store";

type Props = {
  searchParams: Promise<{ ok?: string; error?: string }>;
};

function feedback(ok?: string, error?: string): string | null {
  if (error) {
    return `Erreur: ${error}`;
  }
  if (ok === "create") {
    return "Categorie creee avec succes.";
  }
  if (ok === "update") {
    return "Categorie mise a jour avec succes.";
  }
  if (ok === "delete") {
    return "Categorie supprimee avec succes.";
  }
  return null;
}

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const [params, categories] = await Promise.all([searchParams, getCategories()]);
  const message = feedback(params.ok, params.error);
  const isError = Boolean(params.error);

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Organisation boutique</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Gestion categories</h1>
        <p className="mt-2 text-sm font-semibold text-ink-700">
          Ajoute, modifie et supprime les categories du catalogue.
        </p>
      </section>

      {message ? (
        <section
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            isError
              ? "border-rose-300 bg-rose-100 text-rose-900"
              : "border-lime-300 bg-lime-100 text-ink-900"
          }`}
        >
          {message}
        </section>
      ) : null}

      <section className="ms-card p-5 md:p-6">
        <h2 className="font-display text-3xl font-black text-ink-950">Nouvelle categorie</h2>

        <form action={createCategoryAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label" htmlFor="create-category-name">
              Nom
            </label>
            <input id="create-category-name" name="name" required className="ms-input" />
          </div>

          <div>
            <label className="ms-label" htmlFor="create-category-slug">
              Slug (optionnel)
            </label>
            <input id="create-category-slug" name="slug" className="ms-input" />
          </div>

          <div className="md:col-span-2">
            <label className="ms-label" htmlFor="create-category-description">
              Description
            </label>
            <textarea id="create-category-description" name="description" rows={4} className="ms-textarea" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="ms-btn-primary">
              Ajouter categorie
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl font-black text-ink-950">Categories existantes</h2>

        {categories.length === 0 ? (
          <article className="ms-card p-5 text-sm font-bold text-ink-700">Aucune categorie enregistree.</article>
        ) : null}

        {categories.map((category) => (
          <article key={category.id} className="ms-card p-5 md:p-6">
            <form action={updateCategoryAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={category.id} />

              <div>
                <label className="ms-label" htmlFor={`category-name-${category.id}`}>
                  Nom
                </label>
                <input
                  id={`category-name-${category.id}`}
                  name="name"
                  defaultValue={category.name}
                  required
                  className="ms-input"
                />
              </div>

              <div>
                <label className="ms-label" htmlFor={`category-slug-${category.id}`}>
                  Slug
                </label>
                <input
                  id={`category-slug-${category.id}`}
                  name="slug"
                  defaultValue={category.slug}
                  required
                  className="ms-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="ms-label" htmlFor={`category-description-${category.id}`}>
                  Description
                </label>
                <textarea
                  id={`category-description-${category.id}`}
                  name="description"
                  defaultValue={category.description}
                  rows={4}
                  className="ms-textarea"
                />
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="ms-btn-primary">
                  Sauvegarder
                </button>
              </div>
            </form>

            <form action={deleteCategoryAction} className="mt-4">
              <input type="hidden" name="id" value={category.id} />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-black text-rose-900 transition hover:bg-rose-100"
              >
                Supprimer cette categorie
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
