"use client";

import { useState } from "react";
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-cream-50 border-peach-400/30">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl md:text-3xl text-cinnamon-900">
            Contactez GatoPouch
          </DialogTitle>
          <DialogDescription className="text-cinnamon-700">
            Une question sur le GatoPouch, votre commande, ou une demande
            partenariat ? Écrivez-nous, nous répondons sous 24 à 48h ouvrées.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-5 gap-6 mt-4">
          {/* Contact form (3/5) */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-3">
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

          {/* Contact info (2/5) */}
          <div className="md:col-span-2 space-y-4 bg-cream-100 rounded-2xl p-5">
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
   LegalModal — generic reusable modal for legal pages
   ========================================================================= */
function LegalModal({
  title,
  children,
  trigger,
}: {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none text-cinnamon-800 space-y-3 mt-4 text-[15px] leading-relaxed">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Privacy Policy modal
   ========================================================================= */
export function PrivacyPolicyModal() {
  return (
    <LegalModal title="Politique de Confidentialité" trigger="Confidentialité">
      <p>
        GatoPouch (&quot;nous&quot;, &quot;notre&quot;) exploite le site
        gatopouch.com et s&apos;engage à protéger la vie privée de ses
        utilisateurs (&quot;vous&quot;). Cette politique décrit quelles
        données nous collectons, comment nous les utilisons et vos droits
        conformément au Règlement Général sur la Protection des Données (RGPD
        UE 2016/679) et la Loi Organique espagnole 3/2018 (LOPDGDD).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        1. Responsable du traitement
      </h3>
      <p>
        <strong>Responsable :</strong> GatoPouch<br />
        <strong>Adresse :</strong> Calle Almería 83, 29018 Málaga, España<br />
        <strong>E-mail :</strong> contact@gatopouch.com<br />
        <strong>Téléphone :</strong> +34 670 04 04 47
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        2. Données collectées
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Formulaire de contact :</strong> nom, e-mail,
          téléphone (optionnel), sujet et message.
        </li>
        <li>
          <strong>Inscription newsletter :</strong> adresse e-mail
          uniquement.
        </li>
        <li>
          <strong>Données de commande :</strong> nom, adresse de
          livraison, e-mail, téléphone, données de paiement (traitées par
          notre prestataire de paiement sécurisé, nous ne stockons pas les
          données bancaires).
        </li>
        <li>
          <strong>Données techniques :</strong> adresse IP, type de
          navigateur, pages visitées (cookies analytiques anonymisés).
        </li>
      </ul>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        3. Finalités du traitement
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Répondre à vos demandes de contact et support client.</li>
        <li>
          Traiter et expédier vos commandes, gérer le service après-vente.
        </li>
        <li>
          Vous envoyer la newsletter et les offres promotionnelles (si vous
          y êtes abonné).
        </li>
        <li>
          Améliorer notre site et nos produits grâce à des statistiques
          anonymisées.
        </li>
      </ul>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        4. Base légale
      </h3>
      <p>
        Le traitement de vos données repose sur : votre consentement
        (newsletter, contact), l&apos;exécution du contrat (commande),
        l&apos;intérêt légitime (sécurité, amélioration du service), et
        l&apos;obligation légale (factures, comptabilité).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        5. Conservation
      </h3>
      <p>
        Les données de contact sont conservées 3 ans. Les données de
        commande 10 ans (obligation comptabilité espagnole). Les abonnés
        newsletter jusqu&apos;à désinscription.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        6. Vos droits
      </h3>
      <p>
        Vous pouvez exercer à tout moment vos droits d&apos;accès,
        rectification, suppression, opposition, portabilité et limitation
        en écrivant à{" "}
        <a
          href="mailto:contact@gatopouch.com"
          className="text-peach-500 underline"
        >
          contact@gatopouch.com
        </a>
        . Vous pouvez aussi déposer une réclamation auprès de
        l&apos;Agence Espagnole de Protection des Données (AEPD,
        www.aepd.es).
      </p>
    </LegalModal>
  );
}

/* =========================================================================
   Terms & Conditions modal
   ========================================================================= */
export function TermsModal() {
  return (
    <LegalModal title="Términos y Condiciones" trigger="Términos y Condiciones">
      <p>
        Estos términos y condiciones (&quot;Términos&quot;) regulan el uso
        del sitio web gatopouch.com y la compra de productos GatoPouch. Al
        realizar un pedido, aceptas estos Términos. Esta versión bilingue
        prevalece en caso de conflicto.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        1. Identidad del vendedor
      </h3>
      <p>
        <strong>Vendedor:</strong> GatoPouch<br />
        <strong>Dirección:</strong> Calle Almería 83, 29018 Málaga, España<br />
        <strong>Email:</strong> contact@gatopouch.com<br />
        <strong>Teléfono:</strong> +34 670 04 04 47
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        2. Productos y precios
      </h3>
      <p>
        Los productos GatoPouch son sudaderas de polar con bolsillo ventral
        para gatos. Los precios se muestran en euros (€), IVA incluido. Los
        packs propuestos son: 1 unidad (54,99€), Pack de 2 (94,98€, ahorro
        15€), Pack de 3 (129,99€, ahorro 34,98€). Los precios pueden
        modificarse en cualquier momento, pero el precio facturado es el
        vigente en el momento de la confirmación del pedido.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        3. Pedido y confirmación
      </h3>
      <p>
        Al validar tu pedido, recibes un email de confirmación con el
        resumen, el precio total y la fecha estimada de entrega. El pedido
        se considera aceptado tras la confirmación del pago. Nos reservamos
        el derecho de rechazar un pedido (stock insuficiente, sospecha de
        fraude), en cuyo caso reembolsamos íntegramente.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        4. Pago
      </h3>
      <p>
        Aceptamos tarjeta bancaria (CB, Visa, Mastercard), PayPal, Apple
        Pay y Google Pay. El pago 3x sin gastos está disponible desde 60€
        de compra. Tus datos bancarios son tratados por nuestro proveedor
        de pago certificado (no los almacenamos).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        5. Disponibilidad y talla
      </h3>
      <p>
        Disponibles 7 colores y 6 tallas (S, M, L, XL, 2XL, 3XL). Te
        recomendamos consultar la guía de tallas antes del pedido. Si una
        talla/color no está disponible tras tu pedido, te propondremos una
        alternativa o un reembolso completo.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        6. Propiedad intelectual
      </h3>
      <p>
        Todos los elementos del sitio (logos, textos, imágenes, diseños)
        son propiedad de GatoPouch o sus partners. Queda prohibida
        cualquier reproducción, copia o explotación sin autorización
        expresa.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        7. Legislación aplicable
      </h3>
      <p>
        Estos Términos se rigen por la legislación española. Cualquier
        conflicto se resolverá ante los tribunales de Málaga, sin perjuicio
        de tus derechos como consumidor según la legislación de la UE.
      </p>
    </LegalModal>
  );
}

/* =========================================================================
   Returns Policy modal
   ========================================================================= */
export function ReturnsModal() {
  return (
    <LegalModal title="Política de Devoluciones" trigger="Política de Devoluciones">
      <p>
        En GatoPouch queremos que estés 100% satisfecho. Si tu gato no se
        adapta al GatoPouch o si el producto no corresponde a tus
        expectativas, tienes 30 días desde la recepción para solicitar un
        reembolso o un cambio.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        1. Plazo de devolución
      </h3>
      <p>
        <strong>30 días</strong> desde la fecha de recepción del paquete.
        La fecha del sello del transportista hace fe. Pasado este plazo, no
        aceptamos devoluciones salvo defecto de fabricación (ver garantía).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        2. Condiciones del producto
      </h3>
      <p>El producto debe:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Estar en su estado original, sin uso prolongado.</li>
        <li>Tener todas las etiquetas y embalaje original.</li>
        <li>No presentar manchas, pelos de animal o olores.</li>
        <li>
          Una prueba breve del producto con tu gato es aceptable (5-10
          min) — sin embargo, una sesión prolongada no permite la
          devolución por higiene.
        </li>
      </ul>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        3. Procedimiento
      </h3>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Escríbenos a{" "}
          <a
            href="mailto:support@gatopouch.com"
            className="text-peach-500 underline"
          >
            support@gatopouch.com
          </a>{" "}
          con tu número de pedido y el motivo.
        </li>
        <li>
          Te enviamos una etiqueta de devolución prepagada (PDF) por email
          en 24h.
        </li>
        <li>
          Deposita el paquete en un punto de recogida (Correos, DHL,
         UPS).
        </li>
        <li>
          Recibido y verificado en nuestro almacén de Málaga, procesamos
          el reembolso en 5-7 días laborables al método de pago original.
        </li>
      </ol>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        4. Reembolso
      </h3>
      <p>
        El reembolso íntegro (precio del producto + gastos de envío
        originales) se realiza al método de pago utilizado en la compra.
        Los gastos de devolución corren a cargo de GatoPouch en caso de
        producto defectuoso o error nuestro. Si la devolución es por
        decisión personal, los gastos de devolución corren a cargo del
        cliente (6,90€).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        5. Excepciones
      </h3>
      <p>
        No se aceptan devoluciones de productos personalizados (color
        estándar, sí; bordado o grabado personalizado, no). Tampoco de
        productos adquiridos en promociones especiales liquidación (&quot;sin
        retorno&quot;).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        6. Garantía legal
      </h3>
      <p>
        Conforme a la legislación de la UE, todos nuestros productos
        están garantizados 2 años contra defectos de fabricación. Si
        detectas un defecto, escríbenos con fotos a{" "}
        <a
          href="mailto:support@gatopouch.com"
          className="text-peach-500 underline"
        >
          support@gatopouch.com
        </a>{" "}
        y te enviaremos un reemplazo gratuito o un reembolso completo.
      </p>
    </LegalModal>
  );
}

/* =========================================================================
   Shipping Policy modal
   ========================================================================= */
export function ShippingModal() {
  return (
    <LegalModal title="Política de Envíos" trigger="Política de Envíos">
      <p>
        GatoPouch envía a toda Europa (UE + Royaume-Uni + Suisse). Aquí
        están nuestras condiciones de envío.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        1. Plazos de entrega
      </h3>
      <p>
        <strong>Plazo estándar: 6 a 12 días laborables</strong> desde la
        confirmación del pedido. El plazo puede variar según el país y
        la temporada (Navidad, Black Friday pueden alargar 2-3 días).
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Preparación:</strong> 24h laborables desde el pago.</li>
        <li><strong>Transporte:</strong> 5-11 días laborables.</li>
        <li><strong>Total:</strong> 6-12 días laborables.</li>
      </ul>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        2. Tarifas
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Envío gratuito</strong> desde 69€ de compra
          (alcanzado automáticamente con el Pack de 2 a 94,98€).
        </li>
        <li>
          <strong>Por debajo de 69€:</strong> 6,90€ (pedido unitario a
          54,99€ = envío adicional).
        </li>
        <li><strong>Zonas específicas (UK, CH):</strong> 12,90€.</li>
      </ul>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        3. Zonas cubiertas
      </h3>
      <p>
        Enviamos a toda la Unión Europea (España, Francia, Portugal,
        Italia, Alemania, Bélgica, Países Bajos, Luxemburgo, Austria,
        Irlanda, etc.) así como al Reino Unido y Suiza. Para otros
        destinos, escríbenos a{" "}
        <a
          href="mailto:support@gatopouch.com"
          className="text-peach-500 underline"
        >
          support@gatopouch.com
        </a>
        .
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        4. Seguimiento
      </h3>
      <p>
        Recibes un email con tu número de seguimiento en el momento del
        envío. Puedes seguir tu paquete en el sitio del transportista
        (habitualmente DHL o Correos). Si no recibes tu paquete en el
        plazo máximo de 12 días, escríbenos y abriremos una investigación
        con el transportista (resolución en 5-7 días).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        5. Paquetes no entregados
      </h3>
      <p>
        Si el transportista no puede entregar (ausencia, dirección
        incorrecta), el paquete se devuelve a nuestro almacén de Málaga.
        Te contactamos por email para organizar un reenvío (con gastos
        adicionales) o un reembolso (sin gastos de envío).
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        6. Aduana e impuestos
      </h3>
      <p>
        Para envíos fuera de la UE (Reino Unido, Suiza), el destinatario
        es responsable de los derechos de aduana e impuestos locales.
        GatoPouch no se hace cargo de estos gastos. Para pedidos dentro
        de la UE, no hay aduana ni impuestos adicionales.
      </p>

      <h3 className="font-display font-bold text-cinnamon-900 mt-4 mb-2">
        7. Embalaje
      </h3>
      <p>
        Todos nuestros pedidos se envían en embalaje reciclable y
        discreto (sin mención del contenido en el exterior, ideal para
        regalos). El Pack de 2 y el Pack de 3 pueden enviarse a
        direcciones diferentes bajo demanda (escríbenos tras el pedido).
      </p>
    </LegalModal>
  );
}
