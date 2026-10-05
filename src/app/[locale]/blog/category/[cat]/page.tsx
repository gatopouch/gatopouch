import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getArticlesByCategory, getCategoryBySlug, getAllCategories } from "@/lib/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PawPrint } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  const categories = getAllCategories();
  const params: { locale: string; cat: string }[] = [];
  for (const locale of routing.locales) {
    for (const cat of categories) {
      params.push({ locale, cat: cat.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; cat: string }>;
}): Promise<Metadata> {
  const { locale, cat } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const category = getCategoryBySlug(cat);
  if (!category) return {};

  const name = category.name[locale as "fr" | "en" | "es" | "de" | "it"] || category.name.fr;
  const desc = category.description[locale as "fr" | "en" | "es" | "de" | "it"] || category.description.fr;

  return {
    title: `${name} — GatoPouch Blog`,
    description: desc,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; cat: string }>;
}) {
  const { locale, cat } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await setRequestLocale(locale);

  const category = getCategoryBySlug(cat);
  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const articles = getArticlesByCategory(cat, locale as "fr" | "en" | "es" | "de" | "it");
  const allCategories = getAllCategories();

  const catName = category.name[locale as "fr" | "en" | "es" | "de" | "it"] || category.name.fr;
  const catDesc = category.description[locale as "fr" | "en" | "es" | "de" | "it"] || category.description.fr;

  const prefix = locale === "fr" ? "" : `/${locale}`;

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-hero-gradient paw-pattern py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "GatoPouch", href: prefix || "/" },
              { label: t("title"), href: `${prefix}/blog` },
              { label: catName },
            ]}
          />
          <div className="mt-6 text-center">
            <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold">
              {t("category")}
            </Badge>
            <h1 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-5xl mb-3">
              {catName}
            </h1>
            <p className="text-cinnamon-700 text-lg max-w-2xl mx-auto">
              {catDesc}
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
              className="px-4 py-2 rounded-full bg-white text-cinnamon-800 hover:bg-peach-300/30 text-sm font-medium transition-colors border border-cinnamon-900/5"
            >
              {t("allArticles")}
            </a>
            {allCategories.map((c) => (
              <a
                key={c.slug}
                href={`${prefix}/blog/category/${c.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  c.slug === cat
                    ? "bg-cinnamon-900 text-cream-50 border-cinnamon-900"
                    : "bg-white text-cinnamon-800 hover:bg-peach-300/30 border-cinnamon-900/5"
                }`}
              >
                {c.name[locale as "fr" | "en" | "es" | "de" | "it"]}
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
              <h2 className="font-display font-bold text-xl text-cinnamon-900 mb-6">
                {articles.length} {t("articles")}
              </h2>
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
