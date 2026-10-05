import { getAllArticles, getAllCategories } from "@/lib/blog";

/**
 * Sitemap dynamique multilingue
 * Inclut : landing pages + blog index + category pages + articles (×5 langues)
 * Avec hreflang alternates pour chaque URL
 */

const LOCALES = ["fr", "en", "es", "de", "it"] as const;
const SITE_URL = "https://www.gatopouch.shop";

export default function sitemap() {
  const urls: any[] = [];

  // 1. Landing pages (×5 langues)
  for (const locale of LOCALES) {
    urls.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}`])
        ),
      },
    });
  }

  // 2. Blog index pages (×5 langues)
  for (const locale of LOCALES) {
    urls.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/blog`])
        ),
      },
    });
  }

  // 3. Category pages (×5 langues × 5 catégories = 25 URLs)
  const categories = getAllCategories();
  for (const cat of categories) {
    for (const locale of LOCALES) {
      urls.push({
        url: `${SITE_URL}/${locale}/blog/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE_URL}/${l}/blog/category/${cat.slug}`,
            ])
          ),
        },
      });
    }
  }

  // 4. Article pages (×5 langues × N articles)
  for (const locale of LOCALES) {
    const articles = getAllArticles(locale);
    for (const article of articles) {
      const lastMod = new Date(article.frontmatter.date);
      urls.push({
        url: `${SITE_URL}/${locale}/blog/${article.slug}`,
        lastModified: lastMod,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE_URL}/${l}/blog/${article.slug}`,
            ])
          ),
        },
      });
    }
  }

  return urls;
}
