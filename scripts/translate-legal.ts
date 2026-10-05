/**
 * Génère le contenu structuré des 4 pages légales dans fr.json
 * puis traduit vers en/es/de/it via z-ai SDK
 *
 * Structure: legalModals.{page}.blocks = [{ type, content?, items? }]
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const MESSAGES_DIR = path.join(__dirname, "..", "src", "messages");
const DELAY_MS = 5000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Source FR — structuré en blocks
const LEGAL_FR = {
  lastUpdate: "Dernière mise à jour",
  privacy: {
    title: "Politique de Confidentialité",
    trigger: "Confidentialité",
    blocks: [
      { type: "p", content: "GatoPouch (« nous », « notre ») exploite le site gatopouch.com et s'engage à protéger la vie privée de ses utilisateurs (« vous »). Cette politique décrit quelles données nous collectons, comment nous les utilisons et vos droits conformément au Règlement Général sur la Protection des Données (RGPD UE 2016/679) et la Loi Organique espagnole 3/2018 (LOPDGDD)." },
      { type: "h3", content: "1. Responsable du traitement" },
      { type: "p", content: "Responsable : GatoPouch\nAdresse : Calle Almería 83, 29018 Málaga, España\nE-mail : contact@gatopouch.com\nTéléphone : +34 670 04 04 47" },
      { type: "h3", content: "2. Données collectées" },
      { type: "ul", items: [
        "Formulaire de contact : nom, e-mail, téléphone (optionnel), sujet et message.",
        "Inscription newsletter : adresse e-mail uniquement.",
        "Données de commande : nom, adresse de livraison, e-mail, téléphone, données de paiement (traitées par notre prestataire de paiement sécurisé, nous ne stockons pas les données bancaires).",
        "Données techniques : adresse IP, type de navigateur, pages visitées (cookies analytiques anonymisés)."
      ]},
      { type: "h3", content: "3. Finalités du traitement" },
      { type: "ul", items: [
        "Répondre à vos demandes de contact et support client.",
        "Traiter et expédier vos commandes, gérer le service après-vente.",
        "Vous envoyer la newsletter et les offres promotionnelles (si vous y êtes abonné).",
        "Améliorer notre site et nos produits grâce à des statistiques anonymisées."
      ]},
      { type: "h3", content: "4. Base légale" },
      { type: "p", content: "Le traitement de vos données repose sur : votre consentement (newsletter, contact), l'exécution du contrat (commande), l'intérêt légitime (sécurité, amélioration du service), et l'obligation légale (factures, comptabilité)." },
      { type: "h3", content: "5. Conservation" },
      { type: "p", content: "Les données de contact sont conservées 3 ans. Les données de commande 10 ans (obligation comptabilité espagnole). Les abonnés newsletter jusqu'à désinscription." },
      { type: "h3", content: "6. Vos droits" },
      { type: "p", content: "Vous pouvez exercer à tout moment vos droits d'accès, rectification, suppression, opposition, portabilité et limitation en écrivant à contact@gatopouch.com. Vous pouvez aussi déposer une réclamation auprès de l'Agence Espagnole de Protection des Données (AEPD, www.aepd.es)." }
    ]
  },
  terms: {
    title: "Términos y Condiciones",
    trigger: "Términos y Condiciones",
    blocks: [
      { type: "p", content: "Estos términos y condiciones (« Términos ») regulan el uso del sitio web gatopouch.com y la compra de productos GatoPouch. Al realizar un pedido, aceptas estos Términos. Esta versión bilingue prevalece en caso de conflicto." },
      { type: "h3", content: "1. Identidad del vendedor" },
      { type: "p", content: "Vendedor : GatoPouch\nDirección : Calle Almería 83, 29018 Málaga, España\nEmail : contact@gatopouch.com\nTeléfono : +34 670 04 04 47" },
      { type: "h3", content: "2. Productos y precios" },
      { type: "p", content: "Los productos GatoPouch son sudaderas de polar con bolsillo ventral para gatos. Los precios se muestran en euros (€), IVA incluido. Los packs propuestos son : 1 unidad (54,99€), Pack de 2 (94,98€, ahorro 15€), Pack de 3 (129,99€, ahorro 34,98€). Los precios pueden modificarse en cualquier momento, pero el precio facturado es el vigente en el momento de la confirmación del pedido." },
      { type: "h3", content: "3. Pedido y confirmación" },
      { type: "p", content: "Al validar tu pedido, recibes un email de confirmación con el resumen, el precio total y la fecha estimada de entrega. El pedido se considera aceptado tras la confirmación del pago. Nos reservamos el derecho de rechazar un pedido (stock insuficiente, sospecha de fraude), en cuyo caso reembolsamos íntegramente." },
      { type: "h3", content: "4. Pago" },
      { type: "p", content: "Aceptamos tarjeta bancaria (CB, Visa, Mastercard), PayPal, Apple Pay y Google Pay. El pago 3x sin gastos está disponible desde 60€ de compra. Tus datos bancarios son tratados por nuestro proveedor de pago certificado (no los almacenamos)." },
      { type: "h3", content: "5. Disponibilidad y talla" },
      { type: "p", content: "Disponibles 7 colores y 6 tallas (S, M, L, XL, 2XL, 3XL). Te recomendamos consultar la guía de tallas antes del pedido. Si una talla/color no está disponible tras tu pedido, te propondremos una alternativa o un reembolso completo." },
      { type: "h3", content: "6. Propiedad intelectual" },
      { type: "p", content: "Todos los elementos del sitio (logos, textos, imágenes, diseños) son propiedad de GatoPouch o sus partners. Queda prohibida cualquier reproducción, copia o explotación sin autorización expresa." },
      { type: "h3", content: "7. Legislación aplicable" },
      { type: "p", content: "Estos Términos se rigen por la legislación española. Cualquier conflicto se resolverá ante los tribunales de Málaga, sin perjuicio de tus derechos como consumidor según la legislación de la UE." }
    ]
  },
  returns: {
    title: "Política de Devoluciones",
    trigger: "Política de Devoluciones",
    blocks: [
      { type: "p", content: "En GatoPouch queremos que estés 100% satisfecho. Si tu gato no se adapta al GatoPouch o si el producto no corresponde a tus expectativas, tienes 30 días desde la recepción para solicitar un reembolso o un cambio." },
      { type: "h3", content: "1. Plazo de devolución" },
      { type: "p", content: "30 días desde la fecha de recepción del paquete. La fecha del sello del transportista hace fe. Pasado este plazo, no aceptamos devoluciones salvo defecto de fabricación (ver garantía)." },
      { type: "h3", content: "2. Condiciones del producto" },
      { type: "p", content: "El producto debe :" },
      { type: "ul", items: [
        "Estar en su estado original, sin uso prolongado.",
        "Tener todas las etiquetas y embalaje original.",
        "No presentar manchas, pelos de animal o olores.",
        "Una prueba breve del producto con tu gato es aceptable (5-10 min) — sin embargo, una sesión prolongada no permite la devolución por higiene."
      ]},
      { type: "h3", content: "3. Procedimiento" },
      { type: "ol", items: [
        "Escríbenos a support@gatopouch.com con tu número de pedido y el motivo.",
        "Te enviamos una etiqueta de devolución prepagada (PDF) por email en 24h.",
        "Deposita el paquete en un punto de recogida (Correos, DHL, UPS).",
        "Recibido y verificado en nuestro almacén de Málaga, procesamos el reembolso en 5-7 días laborables al método de pago original."
      ]},
      { type: "h3", content: "4. Reembolso" },
      { type: "p", content: "El reembolso íntegro (precio del producto + gastos de envío originales) se realiza al método de pago utilizado en la compra. Los gastos de devolución corren a cargo de GatoPouch en caso de producto defectuoso o error nuestro. Si la devolución es por decisión personal, los gastos de devolución corren a cargo del cliente (6,90€)." },
      { type: "h3", content: "5. Excepciones" },
      { type: "p", content: "No se aceptan devoluciones de productos personalizados (color estándar, sí; bordado o grabado personalizado, no). Tampoco de productos adquiridos en promociones especiales liquidación (« sin retorno »)." },
      { type: "h3", content: "6. Garantía legal" },
      { type: "p", content: "Conforme a la legislación de la UE, todos nuestros productos están garantizados 2 años contra defectos de fabricación. Si detectas un defecto, escríbenos con fotos a support@gatopouch.com y te enviaremos un reemplazo gratuito o un reembolso completo." }
    ]
  },
  shipping: {
    title: "Política de Envíos",
    trigger: "Política de Envíos",
    blocks: [
      { type: "p", content: "GatoPouch envía a toda Europa (UE + Royaume-Uni + Suisse). Aquí están nuestras condiciones de envío." },
      { type: "h3", content: "1. Plazos de entrega" },
      { type: "p", content: "Plazo estándar : 6 a 12 días laborables desde la confirmación del pedido. El plazo puede variar según el país y la temporada (Navidad, Black Friday pueden alargar 2-3 días)." },
      { type: "ul", items: [
        "Preparación : 24h laborables desde el pago.",
        "Transporte : 5-11 días laborables.",
        "Total : 6-12 días laborables."
      ]},
      { type: "h3", content: "2. Tarifas" },
      { type: "ul", items: [
        "Envío gratuito desde 69€ de compra (alcanzado automáticamente con el Pack de 2 a 94,98€).",
        "Por debajo de 69€ : 6,90€ (pedido unitario a 54,99€ = envío adicional).",
        "Zonas específicas (UK, CH) : 12,90€."
      ]},
      { type: "h3", content: "3. Zonas cubiertas" },
      { type: "p", content: "Enviamos a toda la Unión Europea (España, Francia, Portugal, Italia, Alemania, Bélgica, Países Bajos, Luxemburgo, Austria, Irlanda, etc.) así como au Reino Unido y Suiza. Para otros destinos, escríbenos a support@gatopouch.com." },
      { type: "h3", content: "4. Seguimiento" },
      { type: "p", content: "Recibes un email con tu número de seguimiento en el momento del envío. Puedes seguir tu paquete en el sitio del transportista (habitualmente DHL o Correos). Si no recibes tu paquete en el plazo máximo de 12 días, escríbenos y abriremos una investigación con el transportista (resolución en 5-7 días)." },
      { type: "h3", content: "5. Paquetes no entregados" },
      { type: "p", content: "Si el transportista no puede entregar (ausencia, dirección incorrecta), el paquete se devuelve a nuestro almacén de Málaga. Te contactamos por email para organizar un reenvío (con gastos adicionales) o un reembolso (sin gastos de envío)." },
      { type: "h3", content: "6. Aduana e impuestos" },
      { type: "p", content: "Para envíos fuera de la UE (Reino Unido, Suiza), el destinatario es responsable de los derechos de aduana e impuestos locales. GatoPouch no se hace cargo de estos gastos. Para pedidos dentro de la UE, no hay aduana ni impuestos adicionales." },
      { type: "h3", content: "7. Embalaje" },
      { type: "p", content: "Todos nuestros pedidos se envían en embalaje reciclable y discreto (sin mención del contenido en el exterior, ideal para regalos). El Pack de 2 y el Pack de 3 pueden enviarse a direcciones diferentes bajo demanda (escríbenos tras el pedido)." }
    ]
  }
};

async function translateSection(zai: any, data: any, targetLang: string, retries = 0): Promise<any> {
  const prompt = `You are a professional legal translator specializing in e-commerce and privacy policies.

Translate the following JSON object from Français to ${targetLang}.

CRITICAL RULES:
1. Preserve ALL JSON keys exactly (do not translate keys, only values)
2. Preserve the structure (arrays, nested objects, block types)
3. Translate ONLY string values
4. Keep unchanged: "GatoPouch", "€", "S", "M", "L", "XL", "2XL", "3XL", emails (contact@gatopouch.com, support@gatopouch.com), phone numbers (+34 670 04 04 47), URLs (www.aepd.es, www.gatopouch.com), addresses (Calle Almería 83, 29018 Málaga, España)
5. For legal terms, use the appropriate legal terminology in the target language
6. For the "terms" and "returns" sections that are already in Spanish, keep them in Spanish for the "es" translation but translate to the other languages
7. Return ONLY valid JSON, no markdown fences, no comments, no explanation

JSON to translate:
${JSON.stringify(data, null, 2)}

Translated JSON for ${targetLang}:`;

  try {
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    let content = response.choices[0]?.message?.content?.trim() || "";
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      content = content.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(content);
  } catch (err: any) {
    if (retries < 4) {
      console.log(`      ⏳ Retry ${retries + 1}/4 dans ${DELAY_MS * (retries + 1)}ms...`);
      await sleep(DELAY_MS * (retries + 1));
      return translateSection(zai, data, targetLang, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Initialisation z-ai SDK...");
  const zai = await ZAI.create();

  // 1. Met à jour fr.json avec le contenu légal structuré
  const frPath = path.join(MESSAGES_DIR, "fr.json");
  const fr = JSON.parse(fs.readFileSync(frPath, "utf-8"));
  fr.legalModals = LEGAL_FR;
  fs.writeFileSync(frPath, JSON.stringify(fr, null, 2) + "\n", "utf-8");
  console.log("✅ fr.json mis à jour avec legalModals structuré");

  // 2. Traduit vers en, es, de, it
  const targets: Record<string, string> = {
    en: "English",
    es: "Español",
    de: "Deutsch",
    it: "Italiano",
  };

  for (const [lang, langName] of Object.entries(targets)) {
    console.log(`\n🌐 Traduction legalModals vers ${langName} (${lang})...`);

    const targetPath = path.join(MESSAGES_DIR, `${lang}.json`);
    const target = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

    try {
      const translated = await translateSection(zai, LEGAL_FR, langName);
      target.legalModals = translated;
      fs.writeFileSync(targetPath, JSON.stringify(target, null, 2) + "\n", "utf-8");
      console.log(`✅ ${lang}.json mis à jour`);
    } catch (err) {
      console.error(`❌ Erreur ${lang}:`, err);
      // Fallback: utilise la version FR
      target.legalModals = LEGAL_FR;
      fs.writeFileSync(targetPath, JSON.stringify(target, null, 2) + "\n", "utf-8");
    }

    await sleep(DELAY_MS);
  }

  console.log("\n🎉 Traduction des pages légales terminée !");
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
