/**
 * Auto-traduction par section des messages/*.json via z-ai SDK
 * Usage: bun run scripts/translate-messages-v2.ts
 *
 * Stratégie : traduire chaque section de premier niveau séparément
 * pour éviter la limite de tokens et garantir la complétude.
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const SOURCE_LANG = "fr";
const TARGET_LANGS = ["en", "es", "de", "it"] as const;

const LANG_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};

const MESSAGES_DIR = path.join(__dirname, "..", "src", "messages");

async function translateSection(
  zai: any,
  sectionName: string,
  sectionData: any,
  targetLang: string
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
}

async function main() {
  console.log("🚀 Initialisation du z-ai SDK...");
  const zai = await ZAI.create();

  // Charge le fichier source FR
  const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LANG}.json`);
  const sourceContent = fs.readFileSync(sourcePath, "utf-8");
  const sourceMessages = JSON.parse(sourceContent);

  console.log(`📖 Source FR: ${Object.keys(sourceMessages).length} sections de premier niveau`);

  // Pour chaque langue cible
  for (const targetLang of TARGET_LANGS) {
    console.log(`\n🌐 Traduction vers ${LANG_NAMES[targetLang]} (${targetLang})...`);

    const translated: Record<string, any> = {};

    // Traduit chaque section de premier niveau séparément
    for (const [sectionName, sectionData] of Object.entries(sourceMessages)) {
      try {
        console.log(`   • Section "${sectionName}"...`);
        const translatedSection = await translateSection(
          zai,
          sectionName,
          sectionData,
          targetLang
        );
        translated[sectionName] = translatedSection;
      } catch (err) {
        console.error(`   ❌ Erreur section "${sectionName}":`, err);
        // Fallback: garde la version française si la traduction échoue
        translated[sectionName] = sectionData;
      }
    }

    // Sauvegarde le fichier complet
    const targetPath = path.join(MESSAGES_DIR, `${targetLang}.json`);
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2) + "\n", "utf-8");

    // Compte les clés traduites
    function countKeys(obj: any): number {
      let count = 0;
      for (const v of Object.values(obj)) {
        count += 1;
        if (typeof v === "object" && v !== null) {
          if (Array.isArray(v)) {
            for (const item of v) {
              if (typeof item === "object" && item !== null) {
                count += countKeys(item);
              } else {
                count += 1;
              }
            }
          } else {
            count += countKeys(v);
          }
        }
      }
      return count;
    }

    console.log(
      `✅ ${targetLang}.json sauvegardé — ${countKeys(translated)} clés (${fs.statSync(targetPath).size} bytes)`
    );
  }

  console.log("\n🎉 Toutes les traductions sont terminées !");
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
