"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogArticle } from "@/lib/blog";

export function ArticleCard({ article, locale }: { article: BlogArticle; locale: string }) {
  const dateStr = new Date(article.frontmatter.date).toLocaleDateString(
    { fr: "fr-FR", en: "en-US", es: "es-ES", de: "de-DE", it: "it-IT" }[locale as string] || "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const href = `/${locale === "fr" ? "" : locale}/blog/${article.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={href} className="group block h-full">
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cinnamon-900/5 border border-cinnamon-900/5 hover:border-peach-400/30 transition-all h-full flex flex-col">
          {/* Image */}
          {article.frontmatter.image && (
            <div className="relative h-48 overflow-hidden bg-cream-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.frontmatter.image}
                alt={article.frontmatter.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="p-5 flex flex-col flex-1">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-peach-500 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-cinnamon-700/40">•</span>
              <span className="text-xs text-cinnamon-700/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime} min
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-lg text-cinnamon-900 mb-2 group-hover:text-peach-500 transition-colors line-clamp-2">
              {article.frontmatter.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-cinnamon-700 leading-relaxed mb-4 line-clamp-3 flex-1">
              {article.frontmatter.description}
            </p>

            {/* Date + read more */}
            <div className="flex items-center justify-between pt-3 border-t border-cinnamon-900/5">
              <span className="text-xs text-cinnamon-700/60">{dateStr}</span>
              <span className="text-xs font-semibold text-peach-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                Lire
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
