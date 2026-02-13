"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearAdminSession, createAdminSession, getAdminPasscode } from "@/lib/admin-auth";
import {
  getCategoryById,
  getCategories,
  getOrderById,
  getProductById,
  getProducts,
  getSiteSettings,
  removeCategory,
  removeOrder,
  removeProduct,
  saveCategory,
  saveSiteSettings,
  saveProduct,
  updateOrderStatus
} from "@/lib/data-store";
import { uploadProductImages } from "@/lib/product-images";
import {
  SITE_SETTINGS_CATEGORY_ID,
  SITE_SETTINGS_CATEGORY_LEGACY_SLUG,
  SITE_SETTINGS_CATEGORY_SLUG
} from "@/lib/site-settings";
import type { Category, OrderStatus, Product } from "@/lib/types";
import { slugify, toInt } from "@/lib/utils";

const orderStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "completed",
  "canceled"
];

function parseExistingImages(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== "string") {
    return [];
  }
  return raw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function buildProductFromForm(
  formData: FormData,
  images: string[],
  currentId?: string
): Promise<Product> {
  const categories = await getCategories();
  const products = await getProducts();

  const name = String(formData.get("name") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  const priceXof = Math.max(0, toInt(String(formData.get("priceXof") || "0")));
  const compareAtPriceXof = Math.max(0, toInt(String(formData.get("compareAtPriceXof") || "0")));
  const stock = Math.max(0, toInt(String(formData.get("stock") || "0")));
  const isActive = formData.get("isActive") === "on";
  const featured = formData.get("featured") === "on";

  if (!name) {
    throw new Error("Nom produit obligatoire");
  }
  if (!slug) {
    throw new Error("Slug invalide");
  }
  if (!categoryId || !categories.find((category) => category.id === categoryId)) {
    throw new Error("Categorie invalide");
  }
  if (images.length === 0) {
    throw new Error("Au moins une image est obligatoire");
  }

  const slugOwner = products.find((product) => product.slug === slug && product.id !== currentId);
  if (slugOwner) {
    throw new Error("Ce slug existe deja");
  }

  return {
    id: currentId || `prd-${Date.now().toString(36)}`,
    name,
    slug,
    categoryId,
    description,
    priceXof,
    compareAtPriceXof: compareAtPriceXof || undefined,
    stock,
    isActive,
    featured,
    images
  };
}

async function buildCategoryFromForm(formData: FormData, currentId?: string): Promise<Category> {
  const categories = await getCategories();

  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  const description = String(formData.get("description") || "").trim();

  if (!name) {
    throw new Error("Nom categorie obligatoire");
  }
  if (!slug) {
    throw new Error("Slug invalide");
  }
  if (slug === SITE_SETTINGS_CATEGORY_SLUG || slug === SITE_SETTINGS_CATEGORY_LEGACY_SLUG) {
    throw new Error("Slug reserve");
  }

  const slugOwner = categories.find((category) => category.slug === slug && category.id !== currentId);
  if (slugOwner) {
    throw new Error("Ce slug categorie existe deja");
  }

  return {
    id: currentId || `cat-${Date.now().toString(36)}`,
    name,
    slug,
    description
  };
}

export async function loginAction(formData: FormData) {
  const passcode = String(formData.get("passcode") || "");
  if (passcode !== getAdminPasscode()) {
    redirect("/admin/login?error=1");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createProductAction(formData: FormData) {
  try {
    const uploadedImages = await uploadProductImages(formData, "imagesFiles");
    const product = await buildProductFromForm(formData, uploadedImages);
    await saveProduct(product);
    revalidatePath("/");
    revalidatePath("/boutique");
    revalidatePath(`/boutique/${product.slug}`);
    revalidatePath("/admin/products");
    redirect("/admin/products?ok=create");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur creation produit";
    redirect(`/admin/products?error=${encodeURIComponent(message)}`);
  }
}

export async function updateProductAction(formData: FormData) {
  const productId = String(formData.get("id") || "");
  if (!productId) {
    redirect("/admin/products?error=Produit%20introuvable");
  }

  const existingProduct = await getProductById(productId);
  if (!existingProduct) {
    redirect("/admin/products?error=Produit%20introuvable");
  }

  try {
    const keepImages = parseExistingImages(formData.get("existingImages"));
    const uploadedImages = await uploadProductImages(formData, "imagesFiles");
    const replaceImages = formData.get("replaceImages") === "on";

    const finalImages =
      uploadedImages.length === 0
        ? keepImages
        : replaceImages
          ? uploadedImages
          : [...keepImages, ...uploadedImages];

    const updated = await buildProductFromForm(formData, finalImages, productId);
    await saveProduct(updated);
    revalidatePath("/");
    revalidatePath("/boutique");
    revalidatePath(`/boutique/${existingProduct.slug}`);
    revalidatePath(`/boutique/${updated.slug}`);
    revalidatePath("/admin/products");
    redirect("/admin/products?ok=update");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur mise a jour";
    redirect(`/admin/products?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteProductAction(formData: FormData) {
  const productId = String(formData.get("id") || "");
  if (!productId) {
    redirect("/admin/products?error=Produit%20introuvable");
  }

  const product = await getProductById(productId);
  if (!product) {
    redirect("/admin/products?error=Produit%20introuvable");
  }

  await removeProduct(productId);
  revalidatePath("/");
  revalidatePath("/boutique");
  revalidatePath(`/boutique/${product.slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products?ok=delete");
}

export async function createCategoryAction(formData: FormData) {
  try {
    const category = await buildCategoryFromForm(formData);
    await saveCategory(category);
    revalidatePath("/");
    revalidatePath("/boutique");
    revalidatePath(`/categorie/${category.slug}`);
    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    redirect("/admin/categories?ok=create");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur creation categorie";
    redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
  }
}

export async function updateCategoryAction(formData: FormData) {
  const categoryId = String(formData.get("id") || "");
  if (!categoryId) {
    redirect("/admin/categories?error=Categorie%20introuvable");
  }

  const existingCategory = await getCategoryById(categoryId);
  if (!existingCategory) {
    redirect("/admin/categories?error=Categorie%20introuvable");
  }

  try {
    const updated = await buildCategoryFromForm(formData, categoryId);
    await saveCategory(updated);
    revalidatePath("/");
    revalidatePath("/boutique");
    revalidatePath(`/categorie/${existingCategory.slug}`);
    revalidatePath(`/categorie/${updated.slug}`);
    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    redirect("/admin/categories?ok=update");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur mise a jour categorie";
    redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const categoryId = String(formData.get("id") || "");
  if (!categoryId) {
    redirect("/admin/categories?error=Categorie%20introuvable");
  }
  if (categoryId === SITE_SETTINGS_CATEGORY_ID) {
    redirect("/admin/categories?error=Categorie%20reservee");
  }

  const category = await getCategoryById(categoryId);
  if (!category) {
    redirect("/admin/categories?error=Categorie%20introuvable");
  }

  try {
    await removeCategory(categoryId);
    revalidatePath("/");
    revalidatePath("/boutique");
    revalidatePath(`/categorie/${category.slug}`);
    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    redirect("/admin/categories?ok=delete");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur suppression categorie";
    redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
  }
}

export async function updateSiteSettingsAction(formData: FormData) {
  try {
    const current = await getSiteSettings();
    await saveSiteSettings({
      heroBadge: String(formData.get("heroBadge") || current.heroBadge),
      heroTitle: String(formData.get("heroTitle") || current.heroTitle),
      heroSubtitle: String(formData.get("heroSubtitle") || current.heroSubtitle),
      heroPrimaryCtaLabel: String(formData.get("heroPrimaryCtaLabel") || current.heroPrimaryCtaLabel),
      heroPrimaryCtaHref: String(formData.get("heroPrimaryCtaHref") || current.heroPrimaryCtaHref),
      heroSecondaryCtaLabel: String(
        formData.get("heroSecondaryCtaLabel") || current.heroSecondaryCtaLabel
      ),
      heroSecondaryCtaHref: String(formData.get("heroSecondaryCtaHref") || current.heroSecondaryCtaHref),
      footerLocation: String(formData.get("footerLocation") || current.footerLocation),
      footerContactLabel: String(formData.get("footerContactLabel") || current.footerContactLabel),
      footerDeliveryNote: String(formData.get("footerDeliveryNote") || current.footerDeliveryNote)
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    redirect("/admin/settings?ok=site");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur mise a jour";
    redirect(`/admin/settings?error=${encodeURIComponent(message)}`);
  }
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  if (!orderId || !orderStatuses.includes(status)) {
    redirect("/admin/orders?error=Statut%20invalide");
  }

  await updateOrderStatus(orderId, status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders?ok=status");
}

export async function deleteOrderAction(formData: FormData) {
  const orderId = String(formData.get("id") || "");
  if (!orderId) {
    redirect("/admin/orders?error=Commande%20introuvable");
  }

  const order = await getOrderById(orderId);
  if (!order) {
    redirect("/admin/orders?error=Commande%20introuvable");
  }

  try {
    await removeOrder(orderId);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath(`/commande/${order.id}`);
    redirect("/admin/orders?ok=delete");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur suppression commande";
    redirect(`/admin/orders?error=${encodeURIComponent(message)}`);
  }
}
