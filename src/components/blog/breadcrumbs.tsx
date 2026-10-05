"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-cinnamon-700/70 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-cinnamon-700/40" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-peach-500 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-cinnamon-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
