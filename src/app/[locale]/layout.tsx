import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

// Pre-render toutes les locales à build time (better SEO)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Metadata dynamique selon la locale (avec hreflang alternates pour SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "metadata" });

  // Hreflang alternates for SEO — tells Google about all language versions
  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `https://www.gatopouch.shop/${loc}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    authors: [{ name: "GatoPouch" }],
    alternates: {
      canonical: `https://www.gatopouch.shop/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `https://www.gatopouch.shop/${locale}`,
      siteName: "GatoPouch",
      type: "website",
      locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : locale === "de" ? "de_DE" : locale === "it" ? "it_IT" : "fr_FR",
      images: ["/images/trico-hero.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enable static rendering for this locale
  await setRequestLocale(locale);

  return (
    <NextIntlClientProvider>{children}</NextIntlClientProvider>
  );
}
