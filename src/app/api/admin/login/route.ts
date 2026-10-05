import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "GatoPouch2026Admin!";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Crée un cookie de session (7 jours)
    // httpOnly: false pour permettre la vérification côté client dans le layout admin
    const response = NextResponse.json({ ok: true, message: "Connecté" });
    response.cookies.set("admin-session", "authenticated", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
