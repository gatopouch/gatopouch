import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Newsletter subscription endpoint
// Receives: { email, source? }
// Stores in DB + forwards to newsletter@gatopouch.com
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    const source = body.source ? String(body.source) : "landing";
    const normalizedEmail = email.trim().toLowerCase();

    // Insert or update subscription (upsert — unique email)
    const subscription = await db.newsletterSubscription.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        source,
        status: "active",
      },
      update: {
        status: "active",
        source,
      },
    });

    // Compose notification email for the newsletter team
    const emailContent = `
Nouvelle inscription newsletter — GatoPouch
==========================================

E-mail : ${normalizedEmail}
Source : ${source}
Date : ${new Date().toISOString()}
ID abonné : ${subscription.id}
Statut : ${subscription.status}

Cette adresse a été enregistrée en base de données (table NewsletterSubscription).
Pour envoyer la newsletter, utilisez votre outil d'email marketing (Mailchimp, Brevo, etc.) en important la table NewsletterSubscription.
`.trim();

    // Forward to newsletter@gatopouch.com
    // In production, integrate Resend/Nodemailer/SendGrid here:
    // await resend.emails.send({
    //   from: "no-reply@gatopouch.com",
    //   to: "newsletter@gatopouch.com",
    //   subject: "[Newsletter] Nouvelle inscription",
    //   text: emailContent,
    // });
    console.log(`[NEWSLETTER] Notification would be sent to newsletter@gatopouch.com:\n${emailContent}`);

    return NextResponse.json({
      ok: true,
      id: subscription.id,
      message:
        "Merci ! Votre code -10% arrive dans votre boîte mail. Bienvenue dans la famille GatoPouch !",
    });
  } catch (error) {
    console.error("[NEWSLETTER] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Une erreur est survenue. Réessayez ou écrivez-nous à contact@gatopouch.com.",
      },
      { status: 500 }
    );
  }
}
