import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Contact form endpoint
// Receives: { name, email, subject?, message, phone? }
// Stores in DB + forwards to contact@gatopouch.com
// In production, integrate with Resend / Nodemailer / SendGrid to actually send the email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { name, email, message } = body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Le nom est requis (min. 2 caractères)." },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Le message est requis (min. 10 caractères)." },
        { status: 400 }
      );
    }

    const subject = body.subject ? String(body.subject).slice(0, 200) : null;
    const phone = body.phone ? String(body.phone).slice(0, 30) : null;

    // Store submission in DB
    const submission = await db.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject,
        message: message.trim(),
        phone,
        status: "new",
      },
    });

    // Compose email content (in production, send via SMTP/API)
    const emailContent = `
Nouveau message de contact — GatoPouch
======================================

De : ${name.trim()} <${email.trim()}>
${phone ? `Téléphone : ${phone}\n` : ""}${subject ? `Sujet : ${subject}\n` : ""}
Date : ${new Date().toISOString()}
ID : ${submission.id}

Message :
---------
${message.trim()}

---

Pour répondre, utilisez directement l'adresse e-mail du client.
Ce message a été enregistré en base de données (table ContactSubmission, ID: ${submission.id}).
`.trim();

    // Forward to contact@gatopouch.com
    // In production, integrate Resend/Nodemailer/SendGrid here, e.g.:
    // await resend.emails.send({
    //   from: "no-reply@gatopouch.com",
    //   to: "contact@gatopouch.com",
    //   replyTo: email,
    //   subject: subject ? `[Contact] ${subject}` : "[Contact] Nouveau message",
    //   text: emailContent,
    // });
    console.log(`[CONTACT] Email would be sent to contact@gatopouch.com:\n${emailContent}`);

    // Mark as sent (in production, only after successful email send)
    await db.contactSubmission.update({
      where: { id: submission.id },
      data: { status: "sent" },
    });

    return NextResponse.json({
      ok: true,
      id: submission.id,
      message:
        "Merci ! Votre message a été envoyé à l'équipe GatoPouch. Nous vous répondrons sous 24 à 48h ouvrées.",
    });
  } catch (error) {
    console.error("[CONTACT] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Une erreur est survenue. Réessayez ou écrivez-nous directement à contact@gatopouch.com.",
      },
      { status: 500 }
    );
  }
}
