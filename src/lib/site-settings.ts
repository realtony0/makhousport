import type { SiteSettings } from "@/lib/types";

export const SITE_SETTINGS_CATEGORY_ID = "cfg-site";
export const SITE_SETTINGS_CATEGORY_SLUG = "site-settings-config";
export const SITE_SETTINGS_CATEGORY_LEGACY_SLUG = "__site-settings";
export const SITE_SETTINGS_CATEGORY_NAME = "Configuration site";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroBadge: "Makhou Sport - Dakar",
  heroTitle: "Equipement sportif disponible en stock.",
  heroSubtitle: "Chaussettes, maintien articulaire et compression pour match et entrainement.",
  heroPrimaryCtaLabel: "Voir la boutique",
  heroPrimaryCtaHref: "/boutique",
  heroSecondaryCtaLabel: "Voir protection & maintien",
  heroSecondaryCtaHref: "/categorie/protection-maintien",
  footerLocation: "Dakar, Senegal",
  footerContactLabel: "Commandes via WhatsApp",
  footerDeliveryNote: "Livraison 24h-72h"
};

function normalizeText(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return fallback;
  }
  return normalized.slice(0, maxLength);
}

function normalizeHref(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  if (!normalized || !normalized.startsWith("/")) {
    return fallback;
  }
  return normalized.slice(0, 120);
}

export function sanitizeSiteSettings(input: Partial<SiteSettings> | null | undefined): SiteSettings {
  const source = input || {};
  return {
    heroBadge: normalizeText(source.heroBadge, DEFAULT_SITE_SETTINGS.heroBadge, 80),
    heroTitle: normalizeText(source.heroTitle, DEFAULT_SITE_SETTINGS.heroTitle, 160),
    heroSubtitle: normalizeText(source.heroSubtitle, DEFAULT_SITE_SETTINGS.heroSubtitle, 240),
    heroPrimaryCtaLabel: normalizeText(
      source.heroPrimaryCtaLabel,
      DEFAULT_SITE_SETTINGS.heroPrimaryCtaLabel,
      40
    ),
    heroPrimaryCtaHref: normalizeHref(source.heroPrimaryCtaHref, DEFAULT_SITE_SETTINGS.heroPrimaryCtaHref),
    heroSecondaryCtaLabel: normalizeText(
      source.heroSecondaryCtaLabel,
      DEFAULT_SITE_SETTINGS.heroSecondaryCtaLabel,
      40
    ),
    heroSecondaryCtaHref: normalizeHref(
      source.heroSecondaryCtaHref,
      DEFAULT_SITE_SETTINGS.heroSecondaryCtaHref
    ),
    footerLocation: normalizeText(source.footerLocation, DEFAULT_SITE_SETTINGS.footerLocation, 80),
    footerContactLabel: normalizeText(source.footerContactLabel, DEFAULT_SITE_SETTINGS.footerContactLabel, 80),
    footerDeliveryNote: normalizeText(source.footerDeliveryNote, DEFAULT_SITE_SETTINGS.footerDeliveryNote, 80)
  };
}
