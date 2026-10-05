import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllArticles, getAllCategories } from "@/lib/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Clock } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "blog.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const articles = getAllArticles(locale);
  const categories = getAllCategories();

  const localeCode = { fr: "fr-FR", en: "en-US", es: "es-ES", de: "de-DE", it: "it-IT" }[locale as string] || "fr-FR";

  const prefix = `/${locale}`;

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-hero-gradient paw-pattern py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "GatoPouch", href: prefix || "/" },
              { label: t("title") },
            ]}
          />
          <div className="mt-6 text-center">
            <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
              {t("badge")}
            </Badge>
            <h1 className="font-display font-extrabold text-cinnamon-900 text-4xl md:text-5xl mb-3">
              {t("title")}
            </h1>
            <p className="text-cinnamon-700 text-lg max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      {/* Categories filter */}
      <section className="py-8 bg-cream-100 border-y border-cinnamon-900/5">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={`${prefix}/blog`}
              className="px-4 py-2 rounded-full bg-cinnamon-900 text-cream-50 text-sm font-medium"
            >
              {t("allArticles")}
            </a>
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`${prefix}/blog/category/${cat.slug}`}
                className="px-4 py-2 rounded-full bg-white text-cinnamon-800 hover:bg-peach-300/30 text-sm font-medium transition-colors border border-cinnamon-900/5"
              >
                {cat.name[locale as "fr" | "en" | "es" | "de" | "it"]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <PawPrint className="w-16 h-16 text-peach-300 mx-auto mb-4" />
              <p className="text-cinnamon-700 text-lg">{t("noArticles")}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-cinnamon-900">
                  {t("latestArticles")} ({articles.length})
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} locale={locale} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
