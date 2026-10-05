/**
 * Génère 20 nouveaux articles FR (4 par catégorie) + traduit EN/ES/DE/IT
 * Articles plus courts (400-600 mots) + délais 6s pour éviter 429
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "blog");
const DELAY_MS = 6000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const NEW_ARTICLES = [
  // Alimentation & Nutrition (4)
  { cat: "alimentation-nutrition", slug: "alimentation-du-chat-sterilise", title: "Alimentation du chat stérilisé : éviter la prise de poids", desc: "Comment nourrir un chat stérilisé sans qu'il grossisse : besoins caloriques réduits, portions adaptées et conseils pratiques.", tags: ["sterilisation", "poids", "alimentation", "obesite", "chat"] },
  { cat: "alimentation-nutrition", slug: "aliments-toxiques-pour-les-chats", title: "Les aliments toxiques pour les chats : liste complète", desc: "Découvrez tous les aliments dangereux pour les chats : chocolat, oignon, ail, raisin... La liste complète à connaître absolument.", tags: ["toxique", "alimentation", "danger", "securite", "chat"] },
  { cat: "alimentation-nutrition", slug: "complements-alimentaires-pour-chat", title: "Compléments alimentaires pour chat : sont-ils nécessaires ?", desc: "Les compléments alimentaires pour chat sont-ils vraiment utiles ? Oméga-3, probiotiques, vitamines : guide d'expert pour faire le bon choix.", tags: ["complements", "vitamines", "nutrition", "sante", "chat"] },
  { cat: "alimentation-nutrition", slug: "transition-alimentaire-changer-croquettes", title: "Transition alimentaire : changer de croquettes sans risque", desc: "Comment changer les croquettes de votre chat sans troubles digestifs ? La méthode de transition progressive sur 7-10 jours expliquée.", tags: ["transition", "croquettes", "digestion", "alimentation", "chat"] },

  // Santé & Soins (4)
  { cat: "sante-soins", slug: "vermifuger-son-chat-frequence-produits", title: "Vermifuger son chat : fréquence et produits recommandés", desc: "Tout savoir sur le vermifuge du chat : fréquence selon l'âge, produits efficaces, signes d'infestation et prévention des parasites intestinaux.", tags: ["vermifuge", "parasites", "prevention", "sante", "chat"] },
  { cat: "sante-soins", slug: "sterilisation-du-chat-quand-pourquoi", title: "Stérilisation du chat : quand, pourquoi et récupération", desc: "Stériliser son chat : âge idéal, bénéfices santé, déroulement de l'opération et soins post-opératoires. Guide complet pour propriétaires.", tags: ["sterilisation", "operation", "recuperation", "sante", "chat"] },
  { cat: "sante-soins", slug: "premiers-soins-pour-chat-urgence", title: "Premiers soins pour chat : que faire en cas d'urgence", desc: "Les gestes de premiers soins pour chat en urgence : saignement, brûlure, chute, intoxication. Ce qu'il faut faire avant d'appeler le vétérinaire.", tags: ["urgence", "premiers-soins", "securite", "sante", "chat"] },
  { cat: "sante-soins", slug: "bilan-de-sante-annuel-du-chat", title: "Le bilan de santé annuel du chat : examens recommandés", desc: "Bilan de santé annuel du chat : prise de sang, examen dentaire, vaccins, pesée. Pourquoi et comment préparer la visite vétérinaire annuelle.", tags: ["bilan", "veterinaire", "prevention", "examen", "chat"] },

  // Comportement & Psychologie (4)
  { cat: "comportement-psychologie", slug: "pourquoi-mon-chat-mord", title: "Pourquoi mon chat mord-il ? Comprendre et corriger", desc: "Votre chat vous mord ? Découvrez les causes (jeu, peur, stress, douleur) et les solutions pour corriger ce comportement sans brutalité.", tags: ["morsure", "comportement", "correction", "stress", "chat"] },
  { cat: "comportement-psychologie", slug: "chat-qui-urine-hors-litiere", title: "Chat qui urine hors litière : causes et solutions", desc: "Votre chat urine hors de sa litière ? Causes médicales, stress, litière inadaptée : identifiez le problème et trouvez la solution durable.", tags: ["litiere", "urine", "comportement", "stress", "chat"] },
  { cat: "comportement-psychologie", slug: "introduction-nouveau-chat-a-la-maison", title: "L'introduction d'un nouveau chat à la maison : guide", desc: "Comment introduire un nouveau chat à la maison sans conflit : isolation progressive, échanges d'odeurs, rencontres supervisées. Méthode complète.", tags: ["introduction", "nouveau-chat", "cohabitation", "multi-chat", "guide"] },
  { cat: "comportement-psychologie", slug: "chat-et-enfant-cohabitation-harmonieuse", title: "Chat et enfant : créer une cohabitation harmonieuse", desc: "Comment faire cohabiter chat et enfant en sécurité : éducation mutuelle, règles, supervision. Guide pour parents de jeunes enfants avec un chat.", tags: ["enfant", "cohabitation", "securite", "education", "chat"] },

  // Bien-être & Enrichissement (4)
  { cat: "bien-etre-enrichissement", slug: "langage-des-yeux-du-chat-pupilles", title: "Le langage des yeux du chat : que disent ses pupilles ?", desc: "Les yeux du chat révèlent ses émotions : pupilles dilatées, rétrécies, clignement lent. Apprenez à décoder le regard de votre félin.", tags: ["yeux", "pupilles", "communication", "emotion", "chat"] },
  { cat: "bien-etre-enrichissement", slug: "promener-son-chat-en-laisse", title: "Promener son chat en laisse : est-ce possible et recommandé ?", desc: "Promener son chat en laisse : oui c'est possible ! Découvrez comment habituer votre chat au harnais, choisir le bon équipement et les précautions.", tags: ["promenade", "laisse", "harnais", "exterieur", "chat"] },
  { cat: "bien-etre-enrichissement", slug: "musicothérapie-pour-chat-apaiser", title: "La musicothérapie pour chat : apaiser son félin", desc: "La musique peut-elle calmer votre chat ? Découvrez les fréquences apaisantes, les styles musicaux testés scientifiquement et nos playlists recommandées.", tags: ["musique", "apaisement", "stress", "bien-etre", "chat"] },
  { cat: "bien-etre-enrichissement", slug: "creer-un-espace-cozy-pour-son-chat", title: "Créer un espace cozy pour son chat : aménagement", desc: "Comment aménager un espace cozy pour votre chat : cachettes, hauteur, zones de repos, accès fenêtre. Guide d'aménagement intérieur félin.", tags: ["amenagement", "cozy", "interieur", "bien-etre", "chat"] },

  // Accessoires & Équipement (4)
  { cat: "accessoires-equipement", slug: "gamelle-pour-chat-materiau-hauteur", title: "Gamelle pour chat : matériau, hauteur et emplacement", desc: "Choisir la bonne gamelle pour son chat : céramique vs plastique vs inox, hauteur idéale, emplacement. Guide complet pour une alimentation saine.", tags: ["gamelle", "materiau", "hauteur", "accessoire", "chat"] },
  { cat: "accessoires-equipement", slug: "collier-gps-pour-chat-utile-ou-gadget", title: "Le collier GPS pour chat : utile ou gadget ?", desc: "Le collier GPS pour chat est-il vraiment utile ? Avantages, inconvénients, autonomie, précision. Notre test complet pour vous aider à décider.", tags: ["gps", "collier", "securite", "technologie", "chat"] },
  { cat: "accessoires-equipement", slug: "caisses-de-transport-choisir", title: "Caisses de transport : choisir la bonne pour son chat", desc: "Comment choisir la caisse de transport idéale pour votre chat : taille, matériau, sécurité, aération. Comparatif des meilleurs modèles du marché.", tags: ["transport", "caisse", "voyage", "accessoire", "chat"] },
  { cat: "accessoires-equipement", slug: "jouets-interactifs-electroniques-pour-chat", title: "Jouets interactifs électroniques pour chat : top 5", desc: "Top 5 des jouets interactifs électroniques pour chat : distributeurs, lasers, souris robotisées. Sélection testée et recommandée par nos experts.", tags: ["jouets", "electronique", "interactif", "top-5", "chat"] },
];

async function generateArticle(zai: any, meta: any, retries = 0): Promise<string> {
  const prompt = `Write a concise SEO blog article in Français about: "${meta.title}"

Requirements:
- 400-600 words, Markdown format
- Short intro (2 sentences)
- 3-4 H2 sections with practical content
- 1 FAQ section with 2 Q&A
- Brief conclusion with link: [GatoPouch](/#produit)
- Expert, warm tone, actionable advice
- No placeholders, write FULL content

Frontmatter:
---
title: "${meta.title}"
description: "${meta.desc}"
date: "2025-09-${String(10 + Math.floor(Math.random() * 10)).padStart(2, "0")}"
author: "GatoPouch"
tags: ${JSON.stringify(meta.tags)}
locale: "fr"
---

Return ONLY the complete article.`;

  try {
    const res = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });
    return res.choices[0]?.message?.content?.trim() || "";
  } catch (err: any) {
    if (retries < 3) {
      await sleep(DELAY_MS * (retries + 1));
      return generateArticle(zai, meta, retries + 1);
    }
    throw err;
  }
}

async function translateArticle(zai: any, fr: string, lang: string, name: string, retries = 0): Promise<string> {
  try {
    const res = await zai.chat.completions.create({
      messages: [{ role: "user", content: `Translate this Markdown article from French to ${name}. Translate title/description/tags VALUES in frontmatter (keep keys English, change locale to "${lang}"). Translate body. Keep "GatoPouch", URLs, € unchanged. Keep Markdown format. Return ONLY the translated Markdown.\n\n${fr}` }],
      thinking: { type: "disabled" },
    });
    return res.choices[0]?.message?.content?.trim() || "";
  } catch (err: any) {
    if (retries < 2) {
      await sleep(DELAY_MS * (retries + 2));
      return translateArticle(zai, fr, lang, name, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Init z-ai SDK...");
  const zai = await ZAI.create();

  // Phase 1: Generate FR
  console.log(`\n📝 Phase 1: Génération de ${NEW_ARTICLES.length} articles FR...\n`);
  for (let i = 0; i < NEW_ARTICLES.length; i++) {
    const m = NEW_ARTICLES[i];
    const frPath = path.join(CONTENT_DIR, m.cat, `${m.slug}.fr.md`);
    if (fs.existsSync(frPath)) { console.log(`[${i+1}/${NEW_ARTICLES.length}] ⏭️ ${m.slug} (existant)`); continue; }

    console.log(`[${i+1}/${NEW_ARTICLES.length}] 🇫🇷 ${m.slug}...`);
    try {
      const content = await generateArticle(zai, m);
      if (content && content.length > 200) {
        fs.writeFileSync(frPath, content, "utf-8");
        console.log(`   ✅ FR (${content.length} chars)`);
      }
    } catch (e) { console.error(`   ❌ ${e}`); }
    await sleep(DELAY_MS);
  }

  // Phase 2: Translate
  const TARGETS: Record<string, string> = { en: "English", es: "Español", de: "Deutsch", it: "Italiano" };
  console.log(`\n🌐 Phase 2: Traduction EN/ES/DE/IT...\n`);
  for (let i = 0; i < NEW_ARTICLES.length; i++) {
    const m = NEW_ARTICLES[i];
    const frPath = path.join(CONTENT_DIR, m.cat, `${m.slug}.fr.md`);
    if (!fs.existsSync(frPath)) continue;
    const fr = fs.readFileSync(frPath, "utf-8");
    console.log(`[${i+1}/${NEW_ARTICLES.length}] ${m.slug}:`);
    for (const [code, name] of Object.entries(TARGETS)) {
      const tPath = path.join(CONTENT_DIR, m.cat, `${m.slug}.${code}.md`);
      if (fs.existsSync(tPath)) { console.log(`   ✅ ${code} (existant)`); continue; }
      try {
        console.log(`   • ${name}...`);
        const t = await translateArticle(zai, fr, code, name);
        if (t && t.length > 200) {
          fs.writeFileSync(tPath, t, "utf-8");
          console.log(`   ✅ ${code} (${t.length} chars)`);
        }
      } catch (e) { console.error(`   ❌ ${code}: ${e}`); }
      await sleep(DELAY_MS);
    }
  }

  // Count
  let total = 0;
  for (const cat of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue;
    total += fs.readdirSync(path.join(CONTENT_DIR, cat.name)).filter(f => f.endsWith(".md")).length;
  }
  console.log(`\n🎉 Total: ${total} fichiers`);
}

main().catch(console.error);
