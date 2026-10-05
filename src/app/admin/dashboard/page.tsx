import { db } from "@/lib/db";
import { getAllArticles } from "@/lib/blog";
import { FileText, Mail, Users, PawPrint } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Stats from DB
  let contactCount = 0;
  let newsletterCount = 0;

  try {
    contactCount = await db.contactSubmission.count();
  } catch {}
  try {
    newsletterCount = await db.newsletterSubscription.count({
      where: { status: "active" },
    });
  } catch {}

  // Stats from blog
  const articles = getAllArticles("fr");
  const articleCount = articles.length;

  const stats = [
    {
      label: "Articles (FR)",
      value: articleCount,
      icon: FileText,
      color: "bg-peach-gradient",
      href: "/admin/articles",
    },
    {
      label: "Messages reçus",
      value: contactCount,
      icon: Mail,
      color: "bg-cinnamon-900",
      href: "/admin/contact",
    },
    {
      label: "Abonnés newsletter",
      value: newsletterCount,
      icon: Users,
      color: "bg-peach-300",
      href: "/admin/newsletter",
    },
    {
      label: "Total articles × 5 langues",
      value: articleCount * 5,
      icon: PawPrint,
      color: "bg-cinnamon-800",
      href: "/admin/articles",
    },
  ];

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl md:text-3xl text-cinnamon-900 mb-2">
        Dashboard
      </h1>
      <p className="text-cinnamon-700 text-sm mb-8">
        Vue d'ensemble du site GatoPouch
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5 hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-cream-50" />
            </div>
            <div className="font-display font-extrabold text-3xl text-cinnamon-900">
              {stat.value}
            </div>
            <div className="text-sm text-cinnamon-700 mt-1">{stat.label}</div>
          </a>
        ))}
      </div>

      {/* Recent articles */}
      <div className="bg-white rounded-2xl shadow-sm border border-cinnamon-900/5 p-6">
        <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-4">
          Derniers articles publiés
        </h2>
        <div className="space-y-3">
          {articles.slice(0, 5).map((article) => (
            <div key={article.slug} className="flex items-center justify-between py-2 border-b border-cinnamon-900/5 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-cinnamon-900 text-sm truncate">
                  {article.frontmatter.title}
                </div>
                <div className="text-xs text-cinnamon-700/60 mt-0.5">
                  {article.category} • {article.readingTime} min
                </div>
              </div>
              <div className="text-xs text-cinnamon-700/60 ml-4 shrink-0">
                {new Date(article.frontmatter.date).toLocaleDateString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
