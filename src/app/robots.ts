import { routing } from "@/i18n/routing";

/**
 * robots.txt — généré dynamiquement
 * Autorise le crawl de toutes les pages, interdit /admin et /api
 */

const LOCALES = routing.locales;
const SITE_URL = "https://www.gatopouch.shop";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
