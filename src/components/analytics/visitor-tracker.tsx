"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * VisitorTracker — fires a tracking request on every page load
 * Sends: path, locale (extracted from URL), sessionId to /api/track
 * Works on ALL pages (including /admin) — no next-intl dependency
 */
export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate or get session ID
    let sessionId = "unknown";
    try {
      sessionId = sessionStorage.getItem("gp-session") || "";
      if (!sessionId) {
        sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem("gp-session", sessionId);
      }
    } catch {
      // sessionStorage might not be available
    }

    // Extract locale from path (e.g., /fr/blog → fr, /admin → null)
    const pathParts = (pathname || "").split("/").filter(Boolean);
    const locales = ["fr", "en", "es", "de", "it"];
    const locale = locales.includes(pathParts[0]) ? pathParts[0] : null;

    // Fire tracking request (fire and forget)
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname || "/",
        locale,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {
      // Silent fail
    });
  }, [pathname]);

  return null;
}
