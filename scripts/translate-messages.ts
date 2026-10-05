/**
 * Auto-traduction des fichiers messages/*.json via z-ai SDK
 * Usage: bun run scripts/translate-messages.ts
 *
 * Lit src/messages/fr.json (langue source)
 * Génère src/messages/{en,es,de,it}.json (langues cibles)
 * Préserve la structure JSON (clés identiques, valeurs traduites)
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

async function main() {
  console.log("🚀 Initialisation du z-ai SDK...");
  const zai = await ZAI.create();

  // Charge le fichier source FR
  const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LANG}.json`);
  const sourceContent = fs.readFileSync(sourcePath, "utf-8");
  const sourceMessages = JSON.parse(sourceContent);

  console.log(`📖 Fichier source chargé: ${SOURCE_LANG}.json (${sourceContent.length} chars)`);

  // Pour chaque langue cible
  for (const targetLang of TARGET_LANGS) {
    console.log(`\n🌐 Traduction vers ${LANG_NAMES[targetLang]} (${targetLang})...`);

    const prompt = `You are a professional translator specializing in e-commerce and pet products.

Translate the following JSON content from ${LANG_NAMES[SOURCE_LANG]} to ${LANG_NAMES[targetLang]}.

CRITICAL RULES:
1. Preserve ALL JSON keys exactly as they are (do not translate keys, only values)
2. Preserve the JSON structure (arrays, objects, nested keys)
3. Translate ONLY string values, never keys or non-string values
4. Keep technical terms like "GatoPouch", "€", "S", "M", "L", "XL", "2XL", "3XL", email addresses, phone numbers, URLs unchanged
5. Keep emoji if present
6. Adapt the tone naturally for the target language (warm, friendly, marketing-oriented)
7. For arrays of strings, translate each item preserving the order
8. Return ONLY valid JSON, no markdown, no comments, no explanation

Source JSON:
${sourceContent}

Return the translated JSON for ${LANG_NAMES[targetLang]}:`;

    try {
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        thinking: { type: "disabled" },
      });

      const translatedContent = response.choices[0]?.message?.content?.trim() || "";

      // Nettoie la réponse (parfois l'IA ajoute des ```json)
      let cleaned = translatedContent;
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Valide que c'est du JSON valide
      let translatedMessages: any;
      try {
        translatedMessages = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error(`❌ Erreur parsing JSON pour ${targetLang}:`, parseErr);
        console.error("Réponse brute (premiers 500 chars):", cleaned.substring(0, 500));
        continue;
      }

      // Sauvegarde
      const targetPath = path.join(MESSAGES_DIR, `${targetLang}.json`);
      fs.writeFileSync(targetPath, JSON.stringify(translatedMessages, null, 2) + "\n", "utf-8");
      console.log(`✅ ${targetLang}.json sauvegardé (${cleaned.length} chars)`);
    } catch (err) {
      console.error(`❌ Erreur traduction ${targetLang}:`, err);
    }
  }

  console.log("\n🎉 Traduction terminée !");
  console.log(`📁 Fichiers générés dans: ${MESSAGES_DIR}`);
  console.log("   - fr.json (source, non modifié)");
  console.log("   - en.json (English)");
  console.log("   - es.json (Español)");
  console.log("   - de.json (Deutsch)");
  console.log("   - it.json (Italiano)");
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
