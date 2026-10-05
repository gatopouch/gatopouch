import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/landing/site-header";
import { PawPrint } from "lucide-react";

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  await setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <BlogFooter locale={locale} />
    </div>
  );
}

// Simple footer for blog pages (lighter version)
function BlogFooter({ locale }: { locale: string }) {
  // This is a server component, so we can't use useTranslations here
  // We'll use a simple static footer that links back to the main site
  const prefix = locale === "fr" ? "" : `/${locale}`;
  const copyright = "© 2025 GatoPouch. Tous droits réservés. Basé à Málaga, España.";

  return (
    <footer className="bg-cinnamon-900 text-cream-50/80 py-8 mt-auto">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-peach-gradient flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-cream-50" />
            </div>
            <span className="font-display font-bold text-cream-50">GatoPouch</span>
          </div>
          <div className="flex gap-4 text-sm">
            <a href={`${prefix}/`} className="hover:text-peach-300 transition-colors">Home</a>
            <a href={`${prefix}/blog`} className="hover:text-peach-300 transition-colors">Blog</a>
            <a href="https://www.facebook.com/gatopouch/" target="_blank" rel="noopener noreferrer" className="hover:text-peach-300 transition-colors">Facebook</a>
            <a href="https://www.instagram.com/gatopouch/" target="_blank" rel="noopener noreferrer" className="hover:text-peach-300 transition-colors">Instagram</a>
          </div>
        </div>
        <div className="border-t border-cream-50/10 mt-6 pt-4 text-center text-xs text-cream-50/50">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
