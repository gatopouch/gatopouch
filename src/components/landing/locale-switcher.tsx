"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { routing, localeNames, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("Nav");

  // Ferme le menu quand on clique dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSelectChange = (nextLocale: Locale) => {
    // Calcule la nouvelle URL avec la nouvelle locale
    // next-intl gère le routing via le middleware
    const segments = pathname.split("/").filter(Boolean);
    // Si le premier segment est une locale, on la remplace
    if (routing.locales.includes(segments[0] as Locale)) {
      segments[0] = nextLocale;
    } else {
      // Pas de prefix (locale par défaut), on l'ajoute
      segments.unshift(nextLocale);
    }
    const newPath = "/" + segments.join("/");

    startTransition(() => {
      router.replace(newPath);
      setOpen(false);
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-cinnamon-800 hover:bg-peach-300/30 hover:text-cinnamon-900 transition-colors font-medium text-sm disabled:opacity-50"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeNames[locale].name}</span>
        <span className="sm:hidden font-bold text-xs">{localeNames[locale].label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-cream-50 rounded-2xl shadow-xl border border-cinnamon-900/10 py-1.5 z-50 overflow-hidden">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => onSelectChange(loc)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-peach-300/30 transition-colors ${
                loc === locale
                  ? "text-cinnamon-900 font-semibold bg-peach-300/20"
                  : "text-cinnamon-800"
              }`}
            >
              <span className="text-base">{localeNames[loc].flag}</span>
              <span className="flex-1 text-left">{localeNames[loc].name}</span>
              {loc === locale && <Check className="w-4 h-4 text-peach-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
