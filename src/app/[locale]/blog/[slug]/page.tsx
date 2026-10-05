import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  getArticleBySlug,
  getRelatedArticles,
  generateArticleStaticParams,
} from "@/lib/blog";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { RelatedArticles } from "@/components/blog/related-articles";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Clock, PawPrint, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://www.gatopouch.shop";

export function generateStaticParams() {
  return generateArticleStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const article = getArticleBySlug(slug, locale as "fr" | "en" | "es" | "de" | "it");
  if (!article) return {};

  const prefix = `/${locale}`;

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: "article",
      locale: { fr: "fr_FR", en: "en_US", es: "es_ES", de: "de_DE", it: "it_IT" }[locale as string],
      publishedTime: article.frontmatter.date,
      authors: [article.frontmatter.author || "GatoPouch"],
      images: article.frontmatter.image ? [article.frontmatter.image] : ["/images/trico-hero.png"],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await setRequestLocale(locale);

  const article = getArticleBySlug(slug, locale as "fr" | "en" | "es" | "de" | "it");
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const related = getRelatedArticles(slug, locale as "fr" | "en" | "es" | "de" | "it", 3);

  const localeCode = { fr: "fr-FR", en: "en-US", es: "es-ES", de: "de-DE", it: "it-IT" }[locale as string] || "fr-FR";
  const dateStr = new Date(article.frontmatter.date).toLocaleDateString(localeCode, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const prefix = `/${locale}`;
  const blogHref = `${prefix}/blog`;
  const catHref = `${prefix}/blog/category/${article.categorySlug}`;

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Schema.org Article + BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `${SITE_URL}/${locale}/blog/${slug}`,
                headline: article.frontmatter.title,
                description: article.frontmatter.description,
                datePublished: article.frontmatter.date,
                dateModified: article.frontmatter.date,
                author: {
                  "@type": "Organization",
                  name: article.frontmatter.author || "GatoPouch",
                  url: SITE_URL,
                },
                publisher: {
                  "@type": "Organization",
                  name: "GatoPouch",
                  logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/logo.svg`,
                  },
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/${locale}/blog/${slug}`,
                },
                inLanguage: locale,
                keywords: (article.frontmatter.tags || []).join(", "),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "GatoPouch",
                    item: `${SITE_URL}/${locale}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: t("title"),
                    item: `${SITE_URL}/${locale}/blog`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: article.category,
                    item: `${SITE_URL}/${locale}/blog/category/${article.categorySlug}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: article.frontmatter.title,
                    item: `${SITE_URL}/${locale}/blog/${slug}`,
                  },
                ],
              },
            ],
          }),
        }}
      />
      {/* Hero */}
      <section className="bg-hero-gradient paw-pattern py-8 md:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "GatoPouch", href: prefix || "/" },
              { label: t("title"), href: blogHref },
              { label: article.category, href: catHref },
              { label: article.frontmatter.title },
            ]}
          />
          <div className="mt-6">
            <Badge className="bg-peach-300/40 text-cinnamon-800 border-peach-400/30 px-3 py-1 mb-3 rounded-full text-xs font-semibold">
              {article.category}
            </Badge>
            <h1 className="font-display font-extrabold text-cinnamon-900 text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
              {article.frontmatter.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-cinnamon-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-peach-500" />
                {article.readingTime} {t("min")}
              </span>
              <span>•</span>
              <span>{dateStr}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5 text-peach-500" />
                {article.frontmatter.author || "GatoPouch"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <article className="py-10 md:py-14">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Featured image */}
          {article.frontmatter.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.frontmatter.image}
                alt={article.frontmatter.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Tags */}
          {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-cream-100 text-xs text-cinnamon-700 border border-cinnamon-900/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Markdown content */}
          <div className="prose prose-lg max-w-none text-cinnamon-800 prose-headings:font-display prose-headings:text-cinnamon-900 prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-2xl prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-lg prose-p:leading-relaxed prose-a:text-peach-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-cinnamon-900 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-blockquote:border-l-peach-400 prose-blockquote:bg-cream-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="sr-only">{children}</h1>,
                a: ({ href, children }) => {
                  if (!href) return <span>{children}</span>;
                  return <a href={href}>{children}</a>;
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Back to blog */}
          <div className="mt-10 pt-6 border-t border-cinnamon-900/10">
            <Link
              href={blogHref}
              className="inline-flex items-center gap-2 text-cinnamon-800 hover:text-peach-500 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToBlog")}
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <RelatedArticles articles={related} locale={locale} />
          )}
        </div>
      </article>
    </main>
  );
}
