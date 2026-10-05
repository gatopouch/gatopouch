import { getAllArticles, getAllCategories } from "@/lib/blog";
import { FileText, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const locales = ["fr", "en", "es", "de", "it"] as const;
  const categories = getAllCategories();

  // Get all articles across all locales
  const allArticles = locales.map((locale) => ({
    locale,
    articles: getAllArticles(locale),
  }));

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl md:text-3xl text-cinnamon-900 mb-2">
        Articles du blog
      </h1>
      <p className="text-cinnamon-700 text-sm mb-8">
        {allArticles[0].articles.length} articles × 5 langues = {allArticles[0].articles.length * 5} fichiers
      </p>

      {/* Categories overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {categories.map((cat) => {
          const count = allArticles[0].articles.filter(
            (a) => a.categorySlug === cat.slug
          ).length;
          return (
            <div
              key={cat.slug}
              className="bg-white rounded-xl p-4 border border-cinnamon-900/5 text-center"
            >
              <div className="font-display font-bold text-2xl text-cinnamon-900">
                {count}
              </div>
              <div className="text-xs text-cinnamon-700 mt-1">
                {cat.name.fr}
              </div>
            </div>
          );
        })}
      </div>

      {/* Articles table by locale */}
      {allArticles.map(({ locale, articles }) => (
        <div key={locale} className="mb-8">
          <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">
              {({ fr: "🇫🇷", en: "🇬🇧", es: "🇪🇸", de: "🇩🇪", it: "🇮🇹" } as Record<string, string>)[locale]}
            </span>
            {locale.toUpperCase()} ({articles.length} articles)
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-cinnamon-900/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-100 text-left text-xs text-cinnamon-700/70 uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Titre</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Catégorie</th>
                  <th className="px-4 py-3 font-semibold text-center">Lecture</th>
                  <th className="px-4 py-3 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, i) => (
                  <tr
                    key={`${locale}-${article.slug}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-cream-50/50"}
                  >
                    <td className="px-4 py-3 text-sm text-cinnamon-900 font-medium max-w-xs truncate">
                      {article.frontmatter.title}
                    </td>
                    <td className="px-4 py-3 text-xs text-cinnamon-700/70 hidden md:table-cell">
                      {article.category}
                    </td>
                    <td className="px-4 py-3 text-xs text-cinnamon-700 text-center">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readingTime}min
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-cinnamon-700/60 text-right">
                      {new Date(article.frontmatter.date).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
