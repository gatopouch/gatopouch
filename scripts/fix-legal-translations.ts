/**
 * Retraduit les pages légales Terms/Returns/Shipping depuis l'espagnol
 * vers EN, DE, IT (qui n'ont pas été traduites correctement).
 *
 * Prend le contenu ES comme source (qui est correct) et traduit vers la cible.
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const MESSAGES_DIR = path.join(__dirname, "..", "src", "messages");
const DELAY_MS = 5000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Pages à retraduire par langue (celles détectées comme encore en espagnol)
const TO_FIX: Record<string, string[]> = {
  en: ["terms", "returns"],
  de: ["terms", "returns", "shipping"],
  it: ["terms", "shipping"],
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
};

async function translatePage(
  zai: any,
  sourceData: any,
  targetLang: string,
  retries = 0
): Promise<any> {
  const prompt = `You are a professional legal translator specializing in e-commerce.

Translate the following JSON object from Español to ${LANG_NAMES[targetLang]}.

CRITICAL RULES:
1. Preserve ALL JSON keys exactly (do not translate keys, only values)
2. Preserve the structure (arrays, nested objects, block types)
3. Translate ONLY string values
4. Keep unchanged: "GatoPouch", "€", "S", "M", "L", "XL", "2XL", "3XL", emails, phones, URLs, addresses
5. For legal terms, use appropriate legal terminology in the target language
6. Return ONLY valid JSON, no markdown fences, no comments

JSON to translate:
${JSON.stringify(sourceData, null, 2)}

Translated JSON for ${LANG_NAMES[targetLang]}:`;

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
      return translatePage(zai, sourceData, targetLang, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Initialisation z-ai SDK...");
  const zai = await ZAI.create();

  // Charge le fichier ES comme source (qui est correct)
  const esData = JSON.parse(
    fs.readFileSync(path.join(MESSAGES_DIR, "es.json"), "utf-8")
  );

  for (const [targetLang, pages] of Object.entries(TO_FIX)) {
    console.log(`\n🌐 Traduction vers ${LANG_NAMES[targetLang]} (${targetLang})...`);

    const targetPath = path.join(MESSAGES_DIR, `${targetLang}.json`);
    const targetData = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

    for (const pageKey of pages) {
      console.log(`   • Page "${pageKey}"...`);
      try {
        // Prend le contenu ES comme source
        const sourcePage = esData.legalModals[pageKey];
        const translated = await translatePage(zai, sourcePage, targetLang);

        // Garde le trigger déjà corrigé
        const existingTrigger = targetData.legalModals[pageKey].trigger;
        translated.trigger = existingTrigger;

        targetData.legalModals[pageKey] = translated;
        console.log(`   ✅ "${pageKey}" traduit`);
      } catch (err) {
        console.error(`   ❌ Erreur "${pageKey}":`, err);
      }

      // Sauvegarde intermédiaire
      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + "\n", "utf-8");

      await sleep(DELAY_MS);
    }
  }

  console.log("\n🎉 Retraduction terminée !");
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
