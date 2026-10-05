/**
 * Traduction ciblée ES — sections manquantes uniquement
 * Usage: bun run scripts/translate-es-missing.ts
 *
 * Stratégie :
 * - Cible seulement ES
 * - Délai de 8s entre sections (évite 429)
 * - 5 retries avec backoff exponentiel
 * - Skip les sections déjà traduites
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const SOURCE_LANG = "fr";
const TARGET_LANG = "es";
const MESSAGES_DIR = path.join(__dirname, "..", "src", "messages");
const DELAY_MS = 8000; // 8 secondes entre sections
const MAX_RETRIES = 5;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateSection(
  zai: any,
  sectionName: string,
  sectionData: any,
  retries = 0
): Promise<any> {
  const sectionJson = JSON.stringify(sectionData, null, 2);

  const prompt = `You are a professional translator specializing in e-commerce and pet products.

Translate the following JSON object from Français to Español.

CRITICAL RULES:
1. Preserve ALL JSON keys exactly (do not translate keys, only values)
2. Preserve the structure (arrays, nested objects)
3. Translate ONLY string values
4. Keep unchanged: "GatoPouch", "€", "S", "M", "L", "XL", "2XL", "3XL", emails, phones, URLs, emoji
5. Adapt tone naturally (warm, friendly, marketing-oriented in Spanish)
6. For arrays, translate each item preserving order
7. Return ONLY valid JSON, no markdown fences, no comments, no explanation

Section "${sectionName}" to translate:
${sectionJson}

Translated JSON for Español:`;

  try {
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    let content = response.choices[0]?.message?.content?.trim() || "";

    // Nettoie les markdown fences
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    // Extrait le JSON
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      content = content.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(content);
  } catch (err: any) {
    if (retries < MAX_RETRIES) {
      const waitTime = DELAY_MS * (retries + 1); // 8s, 16s, 24s, 32s, 40s
      console.log(`      ⏳ Retry ${retries + 1}/${MAX_RETRIES} dans ${waitTime}ms...`);
      await sleep(waitTime);
      return translateSection(zai, sectionName, sectionData, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Initialisation du z-ai SDK...");
  const zai = await ZAI.create();

  const sourceMessages = JSON.parse(
    fs.readFileSync(path.join(MESSAGES_DIR, `${SOURCE_LANG}.json`), "utf-8")
  );

  // Charge le fichier ES existant
  const esPath = path.join(MESSAGES_DIR, `${TARGET_LANG}.json`);
  const existing: Record<string, any> = JSON.parse(fs.readFileSync(esPath, "utf-8"));

  console.log(`📖 Source FR: ${Object.keys(sourceMessages).length} sections`);
  console.log(`📖 ES actuel: ${Object.keys(existing).length} sections`);

  // Identifie les sections encore en FR
  const missingSections: string[] = [];
  for (const [sectionName, sectionData] of Object.entries(sourceMessages)) {
    const frJson = JSON.stringify(sectionData);
    const esJson = JSON.stringify(existing[sectionName]);
    if (frJson === esJson) {
      missingSections.push(sectionName);
    }
  }

  console.log(`\n📊 ${missingSections.length} sections à traduire:`);
  missingSections.forEach((s) => console.log(`   • ${s}`));

  // Traduit chaque section manquante
  for (let i = 0; i < missingSections.length; i++) {
    const sectionName = missingSections[i];
    const sectionData = sourceMessages[sectionName];

    try {
      console.log(`\n   [${i + 1}/${missingSections.length}] Traduction "${sectionName}"...`);
      const translated = await translateSection(zai, sectionName, sectionData);
      existing[sectionName] = translated;
      console.log(`   ✅ "${sectionName}" traduit`);
    } catch (err) {
      console.error(`   ❌ Erreur "${sectionName}":`, err);
      // Garde le fallback FR
    }

    // Sauvegarde intermédiaire (au cas où)
    fs.writeFileSync(esPath, JSON.stringify(existing, null, 2) + "\n", "utf-8");

    // Délai entre sections
    if (i < missingSections.length - 1) {
      console.log(`   ⏳ Attente ${DELAY_MS}ms...`);
      await sleep(DELAY_MS);
    }
  }

  // Sauvegarde finale
  fs.writeFileSync(esPath, JSON.stringify(existing, null, 2) + "\n", "utf-8");
  console.log(`\n✅ es.json sauvegardé`);

  // Vérification finale
  let translated = 0;
  for (const sectionName of Object.keys(sourceMessages)) {
    const frJson = JSON.stringify(sourceMessages[sectionName]);
    const esJson = JSON.stringify(existing[sectionName]);
    if (frJson !== esJson) translated++;
  }
  console.log(`📊 Résultat: ${translated}/${Object.keys(sourceMessages).length} sections traduites`);
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
