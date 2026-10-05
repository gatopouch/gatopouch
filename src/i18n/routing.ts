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
  // Pas de prefix pour la locale par défaut (URLs plus propres)
  // /fr/ sera redirigé vers / pour le français
  localePrefix: "as-needed",
  // Désactive la détection automatique de langue via Accept-Language
  // → /blog reste en FR (default), /en/blog reste en EN
  // → Le changement de langue se fait uniquement via le LocaleSwitcher
  localeDetection: false,
});
