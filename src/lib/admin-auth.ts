import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware pour protéger les routes /admin
 * Vérifie la présence d'un cookie de session admin
 * Sinon redirige vers /admin/login
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "GatoPouch2026Admin!";

export function adminAuth(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes publiques (login + API login)
  if (pathname === "/admin" || pathname === "/admin/" || pathname === "/admin/login") {
    return null; // Pas de protection
  }

  // Vérifie le cookie de session
  const session = req.cookies.get("admin-session");
  if (session?.value === "authenticated") {
    return null; // Authentifié
  }

  // Non authentifié → redirect vers login
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export { ADMIN_PASSWORD };
