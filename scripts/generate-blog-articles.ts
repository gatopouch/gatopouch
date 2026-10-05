/**
 * Génère 15 nouveaux articles SEO en français (3 par catégorie)
 * puis les traduit vers EN, ES, DE, IT
 *
 * Total: 15 FR + 60 traduits = 75 nouveaux articles
 * Combined avec les 5 existants: 20 articles × 5 langues = 100 total
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "blog");
const DELAY_MS = 4000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 15 nouveaux articles à générer (3 par catégorie)
const NEW_ARTICLES = [
  // Alimentation & Nutrition
  { cat: "alimentation-nutrition", slug: "les-meilleurs-aliments-pour-chat-en-2025", title: "Les meilleurs aliments pour chat en 2025 : notre guide complet", desc: "Découvrez les meilleurs aliments pour chat en 2025 : croquettes premium, pâtée naturelle, compléments. Comparatif, critères de qualité et recommandations.", tags: ["alimentation", "croquettes", "qualite", "guide", "2025"] },
  { cat: "alimentation-nutrition", slug: "chat-qui-ne-boit-pas-assez-solutions", title: "Chat qui ne boit pas assez : solutions et astuces efficaces", desc: "Votre chat ne boit pas assez d'eau ? Découvrez les causes de la déshydratation et 10 solutions pratiques pour augmenter sa consommation d'eau.", tags: ["hydratation", "eau", "sante", "fontaine", "chat"] },
  { cat: "alimentation-nutrition", slug: "patee-vs-croquettes-que-choisir", title: "Pâtée vs croquettes : que choisir pour son chat ?", desc: "Pâtée ou croquettes ? Comparatif complet : nutrition, prix, praticité, santé dentaire. Notre avis d'expert pour faire le meilleur choix.", tags: ["patee", "croquettes", "comparatif", "nutrition", "chat"] },

  // Santé & Soins
  { cat: "sante-soins", slug: "vaccins-du-chat-calendrier-et-recommandations", title: "Vaccins du chat : calendrier complet et recommandations", desc: "Tous les vaccins du chat expliqués : coryza, typhus, leucose, rage. Calendrier, fréquence des rappels et conseils vétérinaires.", tags: ["vaccins", "veterinaire", "prevention", "sante", "chat"] },
  { cat: "sante-soins", slug: "puces-et-tiques-chez-le-chat-prevention", title: "Puces et tiques chez le chat : prévention et traitement", desc: "Comment protéger votre chat des puces et tiques : traitement, prévention, produits naturels, fréquence. Guide complet contre les parasites.", tags: ["puces", "tiques", "parasites", "prevention", "chat"] },
  { cat: "sante-soins", slug: "sante-dentaire-du-chat-brossage", title: "Santé dentaire du chat : pourquoi et comment brosser", desc: "La santé dentaire du chat est cruciale. Découvrez pourquoi et comment brosser les dents de votre chat, les signes de problèmes dentaires et la prévention.", tags: ["dents", "hygiene", "sante", "brossage", "chat"] },

  // Comportement & Psychologie
  { cat: "comportement-psychologie", slug: "pourquoi-mon-chat-griffe-les-meubles", title: "Pourquoi mon chat griffe-t-il les meubles ? Solutions", desc: "Votre chat détruit vos meubles ? Comprenez pourquoi les chats griffent et découvrez 8 solutions efficaces pour protéger vos meubles tout en respectant son instinct.", tags: ["griffade", "meubles", "comportement", "griffoir", "chat"] },
  { cat: "comportement-psychologie", slug: "langage-corporel-du-chat-decoder", title: "Langage corporel du chat : décoder queue et oreilles", desc: "Apprenez à décoder le langage corporel de votre chat : queue, oreilles, yeux, posture. Comprenez ses émotions et renforcez votre lien.", tags: ["langage", "corps", "comportement", "communication", "chat"] },
  { cat: "comportement-psychologie", slug: "socialiser-un-chat-adulte-guide", title: "Comment socialiser un chat adulte : guide pratique", desc: "Socialiser un chat adulte est possible avec patience et méthode. Guide complet : étapes, techniques, erreurs à éviter pour un chat épanoui socialement.", tags: ["socialisation", "comportement", "chat-adulte", "stress", "guide"] },

  // Bien-être & Enrichissement
  { cat: "bien-etre-enrichissement", slug: "10-jouets-diy-pour-stimuler-votre-chat", title: "10 jouets DIY pour stimuler votre chat (faits maison)", desc: "10 idées de jouets DIY pour votre chat : faciles, économiques et stimulants. Puzzles alimentaires, plumes, cartons... Amusez votre chat sans dépenser !", tags: ["jouets", "diy", "enrichissement", "stimulation", "chat"] },
  { cat: "bien-etre-enrichissement", slug: "enrichissement-environnemental-chat-interieur", title: "L'enrichissement environnemental pour chat d'intérieur", desc: "Un chat d'intérieur a besoin de stimulation. Découvrez l'enrichissement environnemental : parcours en hauteur, cachettes, jeux olfactifs et visuels.", tags: ["enrichissement", "interieur", "environnement", "bien-etre", "chat"] },
  { cat: "bien-etre-enrichissement", slug: "ronronnement-du-chat-pourquoi-et-bienfaits", title: "Le ronronnement du chat : pourquoi et ses bienfaits", desc: "Pourquoi les chats ronronnent-ils ? Découvrez les raisons (plaisir, stress, guérison) et les bienfaits du ronronnement pour le chat et pour vous.", tags: ["ronronnement", "bienfaits", "sante", "stress", "chat"] },

  // Accessoires & Équipement
  { cat: "accessoires-equipement", slug: "la-litiere-parfaite-type-emplacement", title: "La litière parfaite : type, emplacement et entretien", desc: "Tout savoir sur la litière du chat : type (agglomérante, végétale, silice), emplacement idéal, fréquence de nettoyage et erreurs à éviter.", tags: ["litiere", "hygiene", "accessoire", "chat", "entretien"] },
  { cat: "accessoires-equipement", slug: "distributeur-automatique-de-croquettes-utile", title: "Le distributeur automatique de croquettes : est-ce utile ?", desc: "Le distributeur automatique de croquettes est-il vraiment utile ? Avantages, inconvénients, critères de choix et recommandations pour votre chat.", tags: ["distributeur", "automatique", "croquettes", "equipement", "chat"] },
  { cat: "accessoires-equipement", slug: "transporter-son-chat-sac-caisse-gatopouch", title: "Transporter son chat : sac, caisse ou GatoPouch ?", desc: "Comment transporter son chat en toute sécurité ? Comparatif sac de transport, caisse vétérinaire et GatoPouch. Lequel choisir selon la situation ?", tags: ["transport", "sac", "caisse", "gatopouch", "chat"] },
];

async function generateArticle(zai: any, meta: { title: string; description: string; tags: string[] }, retries = 0): Promise<string> {
  const prompt = `You are a professional SEO content writer specializing in cat care and pet well-being.

Write a comprehensive, SEO-optimized blog article in Français about: "${meta.title}"

Requirements:
- 600-900 words
- Markdown format
- Start with a short intro paragraph (2-3 sentences)
- Use H2 (##) for main sections (4-5 sections)
- Use H3 (###) for subsections where relevant
- Include bullet lists and/or numbered lists
- Include a FAQ section with 2-3 Q&A
- End with a brief conclusion (2-3 sentences) that includes a natural link to the product:
  [GatoPouch](/#produit)
- Tone: expert, warm, accessible, SEO-friendly
- Use the focus keywords naturally throughout
- Include practical, actionable advice
- Do NOT use placeholder text or "[content here]" — write the FULL article

Frontmatter (at the top, between --- delimiters):
---
title: "${meta.title}"
description: "${meta.description}"
date: "2025-09-${String(20 + Math.floor(Math.random() * 10)).padStart(2, "0")}"
author: "GatoPouch"
tags: ${JSON.stringify(meta.tags)}
locale: "fr"
---

Return ONLY the complete Markdown article (frontmatter + body), no comments.`;

  try {
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });
    return response.choices[0]?.message?.content?.trim() || "";
  } catch (err: any) {
    if (retries < 4) {
      console.log(`      ⏳ Retry ${retries + 1}/4 dans ${DELAY_MS * (retries + 1)}ms...`);
      await sleep(DELAY_MS * (retries + 1));
      return generateArticle(zai, meta, retries + 1);
    }
    throw err;
  }
}

async function translateArticle(zai: any, frContent: string, targetLang: string, langName: string, retries = 0): Promise<string> {
  const prompt = `You are a professional SEO content translator. Translate this Markdown article from Français to ${langName}.

Rules:
1. Translate title, description, tags VALUES in frontmatter (keep keys in English)
2. Change locale field to "${targetLang}"
3. Translate the Markdown body (headings, paragraphs, lists, links text)
4. Keep unchanged: "GatoPouch", "€", URLs (/#produit, /#packs), emails
5. Keep Markdown formatting exactly
6. Return ONLY the translated Markdown (with frontmatter)

Source (Français):
${frContent}`;

  try {
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });
    return response.choices[0]?.message?.content?.trim() || "";
  } catch (err: any) {
    if (retries < 3) {
      console.log(`      ⏳ Retry ${retries + 1}/3...`);
      await sleep(DELAY_MS * (retries + 2));
      return translateArticle(zai, frContent, targetLang, langName, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Initialisation z-ai SDK...");
  const zai = await ZAI.create();
  console.log(`📝 Génération de ${NEW_ARTICLES.length} nouveaux articles FR...\n`);

  // Phase 1: Generate FR articles
  for (let i = 0; i < NEW_ARTICLES.length; i++) {
    const meta = NEW_ARTICLES[i];
    const frPath = path.join(CONTENT_DIR, meta.cat, `${meta.slug}.fr.md`);

    if (fs.existsSync(frPath)) {
      console.log(`[${i + 1}/${NEW_ARTICLES.length}] ⏭️  "${meta.slug}" déjà existant (skip)`);
      continue;
    }

    console.log(`[${i + 1}/${NEW_ARTICLES.length}] 🇫🇷 Génération FR "${meta.slug}"...`);
    try {
      const content = await generateArticle(zai, meta);
      if (content && content.length > 200) {
        fs.writeFileSync(frPath, content, "utf-8");
        console.log(`   ✅ FR sauvegardé (${content.length} chars)`);
      } else {
        console.log(`   ⚠️ Contenu trop court, skip`);
      }
    } catch (err) {
      console.error(`   ❌ Erreur:`, err);
    }
    await sleep(DELAY_MS);
  }

  // Phase 2: Translate to EN, ES, DE, IT
  const TARGETS: Record<string, string> = {
    en: "English",
    es: "Español",
    de: "Deutsch",
    it: "Italiano",
  };

  console.log(`\n🌐 Traduction vers 4 langues...\n`);

  for (let i = 0; i < NEW_ARTICLES.length; i++) {
    const meta = NEW_ARTICLES[i];
    const frPath = path.join(CONTENT_DIR, meta.cat, `${meta.slug}.fr.md`);

    if (!fs.existsSync(frPath)) {
      console.log(`[${i + 1}/${NEW_ARTICLES.length}] ⏭️  "${meta.slug}" FR manquant (skip trad)`);
      continue;
    }

    const frContent = fs.readFileSync(frPath, "utf-8");
    console.log(`[${i + 1}/${NEW_ARTICLES.length}] "${meta.slug}":`);

    for (const [langCode, langName] of Object.entries(TARGETS)) {
      const targetPath = path.join(CONTENT_DIR, meta.cat, `${meta.slug}.${langCode}.md`);

      if (fs.existsSync(targetPath)) {
        console.log(`   ✅ ${langCode} déjà traduit (skip)`);
        continue;
      }

      try {
        console.log(`   • ${langName}...`);
        const translated = await translateArticle(zai, frContent, langCode, langName);
        if (translated && translated.length > 200) {
          fs.writeFileSync(targetPath, translated, "utf-8");
          console.log(`   ✅ ${langCode} sauvegardé (${translated.length} chars)`);
        }
      } catch (err) {
        console.error(`   ❌ ${langCode}:`, err);
      }
      await sleep(DELAY_MS);
    }
  }

  // Count total
  let total = 0;
  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const files = fs.readdirSync(path.join(CONTENT_DIR, cat.name));
    total += files.filter((f) => f.endsWith(".md")).length;
  }

  console.log(`\n🎉 Terminé ! Total: ${total} articles dans le blog`);
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
