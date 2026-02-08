import Image from "next/image";

import { createProductAction, deleteProductAction, updateProductAction } from "@/app/admin/actions";
import { getCategories, getProducts } from "@/lib/data-store";

type Props = {
  searchParams: Promise<{ ok?: string; error?: string }>;
};

function feedback(ok?: string, error?: string): string | null {
  if (error) {
    return `Erreur: ${error}`;
  }
  if (ok === "create") {
    return "Produit cree avec succes.";
  }
  if (ok === "update") {
    return "Produit mis a jour avec succes.";
  }
  if (ok === "delete") {
    return "Produit supprime avec succes.";
  }
  return null;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const [params, categories, products] = await Promise.all([searchParams, getCategories(), getProducts()]);
  const message = feedback(params.ok, params.error);
  const isError = Boolean(params.error);

  return (
    <div className="space-y-6">
      <section className="ms-card p-6 md:p-8">
        <p className="ms-kicker">Administration catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink-950">Gestion produits</h1>
        <p className="mt-2 text-sm font-semibold text-ink-700">
          Ajoute, modifie et supprime les produits affiches sur la boutique.
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
        <h2 className="font-display text-3xl font-black text-ink-950">Nouveau produit</h2>

        <form action={createProductAction} encType="multipart/form-data" className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="ms-label" htmlFor="create-name">
              Nom
            </label>
            <input id="create-name" name="name" required className="ms-input" />
          </div>

          <div>
            <label className="ms-label" htmlFor="create-slug">
              Slug (optionnel)
            </label>
            <input id="create-slug" name="slug" className="ms-input" />
          </div>

          <div>
            <label className="ms-label" htmlFor="create-category">
              Categorie
            </label>
            <select id="create-category" name="categoryId" required className="ms-select">
              <option value="">Choisir</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="ms-label" htmlFor="create-price">
              Prix FCFA
            </label>
            <input id="create-price" name="priceXof" type="number" min={0} defaultValue={0} required className="ms-input" />
          </div>

          <div>
            <label className="ms-label" htmlFor="create-compare">
              Ancien prix FCFA
            </label>
            <input id="create-compare" name="compareAtPriceXof" type="number" min={0} defaultValue={0} className="ms-input" />
          </div>

          <div>
            <label className="ms-label" htmlFor="create-stock">
              Stock
            </label>
            <input id="create-stock" name="stock" type="number" min={0} defaultValue={0} required className="ms-input" />
          </div>

          <div className="md:col-span-2">
            <label className="ms-label" htmlFor="create-description">
              Description
            </label>
            <textarea id="create-description" name="description" rows={4} className="ms-textarea" />
          </div>

          <div className="md:col-span-2">
            <label className="ms-label" htmlFor="create-images-files">
              Images produit
            </label>
            <input
              id="create-images-files"
              name="imagesFiles"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              required
              className="ms-input cursor-pointer file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
            />
            <p className="mt-1 text-xs font-semibold text-ink-600">
              Tu peux selectionner plusieurs images.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm font-bold text-ink-800">
              <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" />
              Actif
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-bold text-ink-800">
              <input type="checkbox" name="featured" defaultChecked className="h-4 w-4" />
              Vedette
            </label>
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="ms-btn-primary">
              Ajouter produit
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl font-black text-ink-950">Produits existants</h2>

        {products.map((product) => (
          <article key={product.id} className="ms-card p-5 md:p-6">
            <form
              action={updateProductAction}
              encType="multipart/form-data"
              className="grid gap-4 md:grid-cols-2"
            >
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="existingImages" value={product.images.join("\n")} />

              <div>
                <label className="ms-label" htmlFor={`name-${product.id}`}>
                  Nom
                </label>
                <input id={`name-${product.id}`} name="name" defaultValue={product.name} required className="ms-input" />
              </div>

              <div>
                <label className="ms-label" htmlFor={`slug-${product.id}`}>
                  Slug
                </label>
                <input id={`slug-${product.id}`} name="slug" defaultValue={product.slug} required className="ms-input" />
              </div>

              <div>
                <label className="ms-label" htmlFor={`category-${product.id}`}>
                  Categorie
                </label>
                <select
                  id={`category-${product.id}`}
                  name="categoryId"
                  defaultValue={product.categoryId}
                  required
                  className="ms-select"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ms-label" htmlFor={`price-${product.id}`}>
                  Prix FCFA
                </label>
                <input
                  id={`price-${product.id}`}
                  name="priceXof"
                  type="number"
                  min={0}
                  defaultValue={product.priceXof}
                  required
                  className="ms-input"
                />
              </div>

              <div>
                <label className="ms-label" htmlFor={`compare-${product.id}`}>
                  Ancien prix FCFA
                </label>
                <input
                  id={`compare-${product.id}`}
                  name="compareAtPriceXof"
                  type="number"
                  min={0}
                  defaultValue={product.compareAtPriceXof || 0}
                  className="ms-input"
                />
              </div>

              <div>
                <label className="ms-label" htmlFor={`stock-${product.id}`}>
                  Stock
                </label>
                <input
                  id={`stock-${product.id}`}
                  name="stock"
                  type="number"
                  min={0}
                  defaultValue={product.stock}
                  required
                  className="ms-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="ms-label" htmlFor={`description-${product.id}`}>
                  Description
                </label>
                <textarea
                  id={`description-${product.id}`}
                  name="description"
                  defaultValue={product.description}
                  rows={4}
                  className="ms-textarea"
                />
              </div>

              <div className="md:col-span-2">
                <p className="ms-label">Images actuelles</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {product.images.map((imagePath) => (
                    <article
                      key={`${product.id}-${imagePath}`}
                      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <Image
                        src={imagePath}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 45vw, 160px"
                        className="object-cover"
                      />
                    </article>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="ms-label" htmlFor={`images-files-${product.id}`}>
                  Ajouter de nouvelles images
                </label>
                <input
                  id={`images-files-${product.id}`}
                  name="imagesFiles"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  className="ms-input cursor-pointer file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                />
                <label className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-ink-800">
                  <input type="checkbox" name="replaceImages" className="h-4 w-4" />
                  Remplacer les images actuelles (sinon elles seront ajoutees)
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm font-bold text-ink-800">
                  <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="h-4 w-4" />
                  Actif
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-bold text-ink-800">
                  <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4" />
                  Vedette
                </label>
              </div>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" className="ms-btn-primary">
                  Sauvegarder
                </button>
              </div>
            </form>

            <form action={deleteProductAction} className="mt-4">
              <input type="hidden" name="id" value={product.id} />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-black text-rose-900 transition hover:bg-rose-100"
              >
                Supprimer ce produit
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
