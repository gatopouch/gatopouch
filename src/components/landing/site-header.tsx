"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { PawPrint, Menu, X, Truck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactModal } from "./modals";
import { LocaleSwitcher } from "./locale-switcher";

/**
 * SiteHeader — header réutilisable pour toutes les pages (landing + blog)
 * Inclut : barre annonce + logo + nav + LocaleSwitcher + CTA + menu mobile
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const tNav = useTranslations("nav");
  const tAnnouncement = useTranslations("announcement");
  const tCta = useTranslations("cta");
  const tBrand = useTranslations("brand");

  const locale = useLocale();
  const prefix = locale === "fr" ? "" : `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOrder = () => {
    window.open(
      "https://gatopouch.com/products/sudadera-con-bolsillo-para-gato-sherpa-ultra-suave",
      "_blank"
    );
  };

  const navLinks = [
    { href: `${prefix}/#produit`, label: tNav("produit") },
    { href: `${prefix}/#benefices`, label: tNav("benefices") },
    { href: `${prefix}/#avis`, label: tNav("avis") },
    { href: `${prefix}/#faq`, label: tNav("faq") },
  ];

  const blogHref = `${prefix}/blog`;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-peach-gradient text-cream-50 text-center text-xs md:text-sm font-medium py-2.5 px-4">
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Truck className="w-3.5 h-3.5" />
          {tAnnouncement("freeShipping")}
          <span className="opacity-50 hidden sm:inline">•</span>
          <Sparkles className="w-3.5 h-3.5 hidden sm:inline" />
          <span className="hidden sm:inline">
            {tAnnouncement("promo")}
          </span>
        </span>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream-50/95 backdrop-blur-md shadow-md shadow-cinnamon-900/5"
            : "bg-cream-50/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href={`${prefix}/`} className="flex items-center gap-2 group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-peach-gradient flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <PawPrint className="w-5 h-5 md:w-6 md:h-6 text-cream-50" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg md:text-xl text-cinnamon-900">
                  {tBrand("name")}
                </span>
                <span className="text-[10px] md:text-xs text-cinnamon-700 -mt-1 hidden sm:block">
                  {tBrand("tagline")}
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-cinnamon-800 hover:bg-peach-300/30 hover:text-cinnamon-900 transition-colors font-medium text-sm"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={blogHref}
                className="px-4 py-2 rounded-full text-cinnamon-800 hover:bg-peach-300/30 hover:text-cinnamon-900 transition-colors font-medium text-sm"
              >
                {tNav("blog")}
              </a>
              <ContactModal>
                <button className="px-4 py-2 rounded-full text-cinnamon-800 hover:bg-peach-300/30 hover:text-cinnamon-900 transition-colors font-medium text-sm">
                  {tNav("contact")}
                </button>
              </ContactModal>
            </nav>

            {/* CTA + mobile menu button */}
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <Button
                onClick={handleOrder}
                className="hidden sm:inline-flex bg-peach-gradient text-cream-50 hover:opacity-90 shadow-md hover:shadow-lg transition-all rounded-full px-5 md:px-6 font-display font-semibold"
              >
                {tCta("orderNow")}
              </Button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-full hover:bg-peach-300/30 text-cinnamon-800"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-cream-50 border-t border-cinnamon-900/10"
            >
              <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-cinnamon-800 hover:bg-peach-300/30 font-medium"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={blogHref}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-cinnamon-800 hover:bg-peach-300/30 font-medium"
                >
                  {tNav("blog")}
                </a>
                <ContactModal>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-xl text-cinnamon-800 hover:bg-peach-300/30 font-medium"
                  >
                    {tNav("contact")}
                  </button>
                </ContactModal>
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    handleOrder();
                  }}
                  className="mt-2 bg-peach-gradient text-cream-50 rounded-full font-display font-semibold"
                >
                  {tCta("orderNow")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
