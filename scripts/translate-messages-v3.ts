/**
 * Auto-traduction avec retry + délai — v3
 * Usage: bun run scripts/translate-messages-v3.ts
 *
 * - Traduit DE et IT (les 2 langues qui ont échoué en v2)
 * - Délai de 3s entre sections (évite 429)
 * - Retry 3x sur erreur 429
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const SOURCE_LANG = "fr";
const TARGET_LANGS = ["de", "it"] as const; // Seulement DE et IT (EN/ES déjà OK)

const LANG_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};

const MESSAGES_DIR = path.join(__dirname, "..", "src", "messages");
const DELAY_MS = 3000; // 3 secondes entre sections
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateSection(
  zai: any,
  sectionName: string,
  sectionData: any,
  targetLang: string,
  retries = 0
): Promise<any> {
  const sectionJson = JSON.stringify(sectionData, null, 2);

  const prompt = `You are a professional translator specializing in e-commerce and pet products.

Translate the following JSON object from ${LANG_NAMES[SOURCE_LANG]} to ${LANG_NAMES[targetLang]}.

CRITICAL RULES:
1. Preserve ALL JSON keys exactly (do not translate keys, only values)
2. Preserve the structure (arrays, nested objects)
3. Translate ONLY string values
4. Keep unchanged: "GatoPouch", "€", "S", "M", "L", "XL", "2XL", "3XL", emails, phones, URLs, emoji
5. Adapt tone naturally (warm, friendly, marketing-oriented)
6. For arrays, translate each item preserving order
7. Return ONLY valid JSON, no markdown fences, no comments, no explanation

Section "${sectionName}" to translate:
${sectionJson}

Translated JSON for ${LANG_NAMES[targetLang]}:`;

  try {
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    let content = response.choices[0]?.message?.content?.trim() || "";

    // Nettoie les markdown fences si présents
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    // Cherche le premier { et le dernier } pour extraire le JSON
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      content = content.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(content);
  } catch (err: any) {
    if (retries < MAX_RETRIES) {
      const waitTime = DELAY_MS * (retries + 2); // 6s, 9s, 12s sur retry
      console.log(`      ⏳ Retry ${retries + 1}/${MAX_RETRIES} dans ${waitTime}ms...`);
      await sleep(waitTime);
      return translateSection(zai, sectionName, sectionData, targetLang, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Initialisation du z-ai SDK...");
  const zai = await ZAI.create();

  // Charge le fichier source FR
  const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LANG}.json`);
  const sourceContent = fs.readFileSync(sourcePath, "utf-8");
  const sourceMessages = JSON.parse(sourceContent);

  console.log(`📖 Source FR: ${Object.keys(sourceMessages).length} sections`);

  // Pour chaque langue cible (DE et IT seulement)
  for (const targetLang of TARGET_LANGS) {
    console.log(`\n🌐 Traduction vers ${LANG_NAMES[targetLang]} (${targetLang})...`);

    // Charge le fichier cible existant (peut avoir des sections déjà traduites)
    const targetPath = path.join(MESSAGES_DIR, `${targetLang}.json`);
    const existing: Record<string, any> = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

    const translated: Record<string, any> = {};

    // Traduit chaque section de premier niveau
    const sections = Object.entries(sourceMessages);
    for (let i = 0; i < sections.length; i++) {
      const [sectionName, sectionData] = sections[i];

      // Vérifie si la section est déjà traduite (différente de FR)
      const existingSection = existing[sectionName];
      const frSectionJson = JSON.stringify(sectionData);
      const existingSectionJson = JSON.stringify(existingSection);

      if (existingSection && existingSectionJson !== frSectionJson) {
        console.log(`   ✅ Section "${sectionName}" déjà traduite (skip)`);
        translated[sectionName] = existingSection;
      } else {
        try {
          console.log(`   • Section "${sectionName}" (${i + 1}/${sections.length})...`);
          const translatedSection = await translateSection(
            zai,
            sectionName,
            sectionData,
            targetLang
          );
          translated[sectionName] = translatedSection;
        } catch (err) {
          console.error(`   ❌ Erreur section "${sectionName}":`, err);
          translated[sectionName] = sectionData; // Fallback FR
        }
        // Délai entre sections pour éviter 429
        if (i < sections.length - 1) {
          await sleep(DELAY_MS);
        }
      }
    }

    // Sauvegarde
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2) + "\n", "utf-8");
    console.log(`✅ ${targetLang}.json sauvegardé`);
  }

  console.log("\n🎉 Traductions terminées !");
}

// Helper function for sortKeys (top-level)
function sortKeys(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortKeys);
  const sorted: Record<string, any> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeys(obj[key]);
  }
  return sorted;
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
