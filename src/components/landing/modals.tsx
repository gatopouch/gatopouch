"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Send,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* =========================================================================
   Contact modal — form + contact info
   ========================================================================= */
export function ContactModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erreur d'envoi");
      }
      toast({
        title: "Message envoyé !",
        description: data.message,
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setOpen(false);
    } catch (err) {
      toast({
        title: "Erreur d'envoi",
        description:
          err instanceof Error
            ? err.message
            : "Veuillez réessayer ou nous écrire à contact@gatopouch.com",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="hover:text-peach-300 transition-colors">
            Contact
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto bg-cream-50 border-peach-400/30">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl md:text-3xl text-cinnamon-900">
            Contactez GatoPouch
          </DialogTitle>
          <DialogDescription className="text-cinnamon-700">
            Une question sur le GatoPouch, votre commande, ou une demande
            partenariat ? Écrivez-nous, nous répondons sous 24 à 48h ouvrées.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Contact form (1/2) */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-cinnamon-800 text-sm">
                  Nom *
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-white border-cinnamon-900/15 focus-visible:ring-peach-400"
                  placeholder="Camille Dubois"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-cinnamon-800 text-sm">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-white border-cinnamon-900/15 focus-visible:ring-peach-400"
                  placeholder="camille@email.com"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-cinnamon-800 text-sm">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-white border-cinnamon-900/15 focus-visible:ring-peach-400"
                  placeholder="+34 670 04 04 47"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-cinnamon-800 text-sm">
                  Sujet
                </Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="bg-white border-cinnamon-900/15 focus-visible:ring-peach-400"
                  placeholder="Question commande / SAV / Partenariat..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-cinnamon-800 text-sm">
                Message *
              </Label>
              <Textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-white border-cinnamon-900/15 focus-visible:ring-peach-400 resize-none"
                placeholder="Bonjour, j'aimerais savoir si le GatoPouch convient à un chat de 7 kg..."
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-peach-gradient text-cream-50 hover:opacity-90 rounded-full w-full sm:w-auto px-6 py-3 font-display font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </>
              )}
            </Button>
          </form>

          {/* Contact info (1/2) */}
          <div className="space-y-4 bg-cream-100 rounded-2xl p-5">
            <div>
              <h4 className="font-display font-bold text-cinnamon-900 text-sm uppercase tracking-wider mb-3">
                Coordonnées
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="mailto:contact@gatopouch.com"
                  className="flex items-start gap-3 text-cinnamon-800 hover:text-peach-500 transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-peach-500" />
                  <div>
                    <div className="font-medium">contact@gatopouch.com</div>
                    <div className="text-xs text-cinnamon-700/70">
                      Question produit & commande
                    </div>
                  </div>
                </a>
                <a
                  href="mailto:support@gatopouch.com"
                  className="flex items-start gap-3 text-cinnamon-800 hover:text-peach-500 transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-peach-500" />
                  <div>
                    <div className="font-medium">support@gatopouch.com</div>
                    <div className="text-xs text-cinnamon-700/70">
                      Support technique SAV
                    </div>
                  </div>
                </a>
                <a
                  href="tel:+34670040447"
                  className="flex items-start gap-3 text-cinnamon-800 hover:text-peach-500 transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-peach-500" />
                  <div>
                    <div className="font-medium">+34 670 04 04 47</div>
                    <div className="text-xs text-cinnamon-700/70">
                      Lun-Ven, 9h-18h (CET)
                    </div>
                  </div>
                </a>
                <a
                  href="https://wa.me/34670040447"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-cinnamon-800 hover:text-peach-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-peach-500" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-xs text-cinnamon-700/70">
                      +34 670 04 04 47 — réponse rapide
                    </div>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-cinnamon-800">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-peach-500" />
                  <div>
                    <div className="font-medium">Calle Almería 83</div>
                    <div className="text-xs text-cinnamon-700/70">
                      29018 Málaga, España
                    </div>
                  </div>
                </div>
                <a
                  href="https://www.gatopouch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-cinnamon-800 hover:text-peach-500 transition-colors"
                >
                  <Globe className="w-4 h-4 mt-0.5 shrink-0 text-peach-500" />
                  <div>
                    <div className="font-medium">www.gatopouch.com</div>
                    <div className="text-xs text-cinnamon-700/70">
                      Site partenaire officiel
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Block renderer — for legal content (h3, p, ul, ol)
   ========================================================================= */
type LegalBlock = {
  type: "h3" | "p" | "ul" | "ol";
  content?: string;
  items?: string[];
};

function renderLegalBlocks(blocks: LegalBlock[]) {
  return blocks.map((block, i) => {
    if (block.type === "h3") {
      return (
        <h3 key={i} className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
          {block.content}
        </h3>
      );
    }
    if (block.type === "p") {
      const lines = (block.content || "").split("\n");
      return (
        <p key={i}>
          {lines.map((line, j) => (
            <span key={j}>
              {line}
              {j < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    }
    if (block.type === "ul") {
      return (
        <ul key={i} className="list-disc pl-5 space-y-1">
          {(block.items || []).map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    }
    if (block.type === "ol") {
      return (
        <ol key={i} className="list-decimal pl-5 space-y-1">
          {(block.items || []).map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      );
    }
    return null;
  });
}

/* =========================================================================
   LegalModal — i18n-aware legal modal (uses useTranslations)
   ========================================================================= */
function LegalModal({ pageKey }: { pageKey: "privacy" | "terms" | "returns" | "shipping" }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("legalModals");
  const locale = useLocale();

  const title = t(`${pageKey}.title` as never);
  const trigger = t(`${pageKey}.trigger` as never);
  const blocks = t.raw(`${pageKey}.blocks`) as LegalBlock[];

  const localeCode = { fr: "fr-FR", en: "en-US", es: "es-ES", de: "de-DE", it: "it-IT" }[locale as string] || "fr-FR";
  const updateDate = new Date().toLocaleDateString(localeCode, {
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-peach-300 transition-colors text-left">
          {trigger}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-cream-50 border-peach-400/30">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl md:text-3xl text-cinnamon-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-cinnamon-700 text-xs">
            {t("lastUpdate" as never)} : {updateDate}
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none text-cinnamon-800 space-y-3 mt-4 text-[15px] leading-relaxed">
          {renderLegalBlocks(blocks)}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Privacy Policy modal
   ========================================================================= */
export function PrivacyPolicyModal() {
  return <LegalModal pageKey="privacy" />;
}

/* =========================================================================
   Terms & Conditions modal
   ========================================================================= */
export function TermsModal() {
  return <LegalModal pageKey="terms" />;
}

/* =========================================================================
   Returns Policy modal
   ========================================================================= */
export function ReturnsModal() {
  return <LegalModal pageKey="returns" />;
}

/* =========================================================================
   Shipping Policy modal
   ========================================================================= */
export function ShippingModal() {
  return <LegalModal pageKey="shipping" />;
}
