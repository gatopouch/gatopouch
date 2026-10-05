"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { BlogArticle } from "@/lib/blog";

export function RelatedArticles({
  articles,
  locale,
}: {
  articles: BlogArticle[];
  locale: string;
}) {
  const t = useTranslations("blog");

  if (!articles.length) return null;

  return (
    <section className="mt-12 pt-8 border-t border-cinnamon-900/10">
      <h3 className="font-display font-bold text-xl md:text-2xl text-cinnamon-900 mb-6">
        {t("relatedArticles")}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, i) => {
          const href = `/${locale === "fr" ? "" : locale}/blog/${article.slug}`;
          return (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={href} className="group block">
                <article className="bg-white rounded-xl p-5 border border-cinnamon-900/5 hover:border-peach-400/30 hover:shadow-md transition-all h-full">
                  <span className="text-xs font-semibold text-peach-500 uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h4 className="font-display font-bold text-sm text-cinnamon-900 mt-2 mb-2 group-hover:text-peach-500 transition-colors line-clamp-2">
                    {article.frontmatter.title}
                  </h4>
                  <p className="text-xs text-cinnamon-700/70 line-clamp-2">
                    {article.frontmatter.description}
                  </p>
                  <span className="text-xs font-semibold text-peach-500 flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                    {t("readMore")}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </article>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
