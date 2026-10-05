import { defineRouting } from "next-intl/routing";

// 5 locales supportées sur GatoPouch
// FR = défaut (langue principale, déjà en place)
// EN, ES, DE, IT = traduits via IA + révision manuelle
export const locales = ["fr", "en", "es", "de", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, { name: string; flag: string; label: string }> = {
  fr: { name: "Français", flag: "🇫🇷", label: "FR" },
  en: { name: "English", flag: "🇬🇧", label: "EN" },
  es: { name: "Español", flag: "🇪🇸", label: "ES" },
  de: { name: "Deutsch", flag: "🇩🇪", label: "DE" },
  it: { name: "Italiano", flag: "🇮🇹", label: "IT" },
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Toutes les locales ont un prefix: /fr/, /en/, /es/, /de/, /it/
  // Pas de "as-needed" qui causait des bugs avec /blog
  localePrefix: "always",
});
