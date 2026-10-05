import fs from "fs";
import path from "path";

/**
 * Blog lib — Markdown parsing + article retrieval
 *
 * Content structure:
 *   src/content/blog/{category-slug}/
 *     _category.json          ← category metadata (name, description per locale)
 *     article-slug.fr.md      ← French version
 *     article-slug.en.md      ← English version
 *     article-slug.es.md      ← Spanish version
 *     article-slug.de.md      ← German version
 *     article-slug.it.md      ← Italian version
 *
 * Frontmatter fields:
 *   title, description, date, author, image, tags[], locale
 */

export type BlogLocale = "fr" | "en" | "es" | "de" | "it";

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  image?: string;
  tags?: string[];
  locale: BlogLocale;
}

export interface BlogArticle {
  slug: string;
  category: string;
  categorySlug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
}

export interface BlogCategory {
  slug: string;
  name: Record<BlogLocale, string>;
  description: Record<BlogLocale, string>;
  icon: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

// --- Markdown parsing ---

function parseFrontmatter(fileContent: string): {
  frontmatter: Record<string, any>;
  content: string;
} {
  const fmMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return { frontmatter: {}, content: fileContent };
  }

  const fmText = fmMatch[1];
  const content = fmMatch[2];

  // Simple YAML parser (handles key: value, arrays, strings)
  const frontmatter: Record<string, any> = {};
  const lines = fmText.split("\n");
  let currentKey = "";
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Array item
    if (inArray && trimmed.startsWith("- ")) {
      const value = trimmed.slice(2).replace(/^["']|["']$/g, "");
      if (Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey].push(value);
      }
      continue;
    }

    // Key: value
    const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value === "") {
        // Start of an array (multi-line)
        frontmatter[key] = [];
        currentKey = key;
        inArray = true;
      } else if (value.startsWith("[") && value.endsWith("]")) {
        // Inline array: ["a", "b", "c"]
        const items = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
        frontmatter[key] = items;
        currentKey = key;
        inArray = false;
      } else {
        // String value (strip quotes)
        frontmatter[key] = value.replace(/^["']|["']$/g, "");
        currentKey = key;
        inArray = false;
      }
    }
  }

  return { frontmatter, content };
}

function calculateReadingTime(content: string): number {
  // ~200 words per minute
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// --- Category management ---

export function getAllCategories(): BlogCategory[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const categories: BlogCategory[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const catFile = path.join(CONTENT_DIR, entry.name, "_category.json");
    if (!fs.existsSync(catFile)) continue;

    try {
      const cat = JSON.parse(fs.readFileSync(catFile, "utf-8"));
      categories.push({
        slug: entry.name,
        name: cat.name,
        description: cat.description,
        icon: cat.icon || "PawPrint",
      });
    } catch {
      // Skip invalid JSON
    }
  }

  return categories;
}

export function getCategoryBySlug(slug: string): BlogCategory | null {
  return getAllCategories().find((c) => c.slug === slug) || null;
}

// --- Article retrieval ---

export function getAllArticles(locale: BlogLocale): BlogArticle[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const categories = getAllCategories();
  const articles: BlogArticle[] = [];

  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat.slug);
    const files = fs.readdirSync(catDir);

    for (const file of files) {
      // Match: slug.{locale}.md
      const match = file.match(/^(.+)\.([a-z]{2})\.md$/);
      if (!match) continue;

      const [, articleSlug, fileLocale] = match;
      if (fileLocale !== locale) continue;

      const filePath = path.join(catDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { frontmatter, content } = parseFrontmatter(fileContent);

      articles.push({
        slug: articleSlug,
        category: cat.name[locale] || cat.name.fr,
        categorySlug: cat.slug,
        frontmatter: {
          title: frontmatter.title || articleSlug,
          description: frontmatter.description || "",
          date: frontmatter.date || new Date().toISOString(),
          author: frontmatter.author,
          image: frontmatter.image,
          tags: frontmatter.tags || [],
          locale,
        },
        content,
        readingTime: calculateReadingTime(content),
      });
    }
  }

  // Sort by date (newest first)
  articles.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });

  return articles;
}

export function getArticleBySlug(
  slug: string,
  locale: BlogLocale
): BlogArticle | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;

  const categories = getAllCategories();

  for (const cat of categories) {
    const filePath = path.join(CONTENT_DIR, cat.slug, `${slug}.${locale}.md`);
    if (!fs.existsSync(filePath)) continue;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, content } = parseFrontmatter(fileContent);

    return {
      slug,
      category: cat.name[locale] || cat.name.fr,
      categorySlug: cat.slug,
      frontmatter: {
        title: frontmatter.title || slug,
        description: frontmatter.description || "",
        date: frontmatter.date || new Date().toISOString(),
        author: frontmatter.author,
        image: frontmatter.image,
        tags: frontmatter.tags || [],
        locale,
      },
      content,
      readingTime: calculateReadingTime(content),
    };
  }

  return null;
}

export function getArticlesByCategory(
  categorySlug: string,
  locale: BlogLocale
): BlogArticle[] {
  return getAllArticles(locale).filter((a) => a.categorySlug === categorySlug);
}

export function getRelatedArticles(
  slug: string,
  locale: BlogLocale,
  limit = 3
): BlogArticle[] {
  const all = getAllArticles(locale);
  const current = all.find((a) => a.slug === slug);
  if (!current) return [];

  // Find articles in the same category, excluding current
  const sameCategory = all.filter(
    (a) => a.slug !== slug && a.categorySlug === current.categorySlug
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Fill with articles from other categories
  const others = all.filter(
    (a) => a.slug !== slug && a.categorySlug !== current.categorySlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}

// Generate static params for all article slugs × all locales
export function generateArticleStaticParams() {
  const locales: BlogLocale[] = ["fr", "en", "es", "de", "it"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const articles = getAllArticles(locale);
    for (const article of articles) {
      params.push({ locale, slug: article.slug });
    }
  }

  return params;
}
