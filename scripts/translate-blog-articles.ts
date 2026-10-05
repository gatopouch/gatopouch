/**
 * Traduit les 5 articles FR du blog vers EN, ES, DE, IT
 * via z-ai SDK.
 *
 * Lit chaque fichier .fr.md, traduit le contenu (frontmatter + body),
 * et sauvegarde comme .{locale}.md
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "blog");
const DELAY_MS = 5000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TARGETS: Record<string, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};

async function translateArticle(
  zai: any,
  fileContent: string,
  targetLang: string,
  retries = 0
): Promise<string> {
  const prompt = `You are a professional SEO content translator specializing in pet care and cat well-being articles.

Translate the following Markdown article from Français to ${targetLang}.

CRITICAL RULES:
1. Translate the content between the --- frontmatter delimiters: translate title, description, tags values (keep keys in English)
2. Change the "locale" field in frontmatter to "${targetLang.toLowerCase().slice(0, 2)}"
3. Translate the Markdown body content (headings, paragraphs, lists, tables, links)
4. Keep unchanged: "GatoPouch", "€", URLs (/#produit, /#packs), email addresses, phone numbers
5. Keep Markdown formatting (##, ###, -, |, etc.) exactly as-is
6. Keep the link text in [brackets] translated, but URLs in (parentheses) unchanged
7. Adapt the tone naturally for the target language (warm, expert, SEO-friendly)
8. For FAQ questions and answers, translate both Q and A
9. For tables, translate cell content but keep the Markdown table structure
10. Return ONLY the translated Markdown (with frontmatter), no comments

Source article (Français):
${fileContent}

Translated article (${targetLang}):`;

  try {
    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    let content = response.choices[0]?.message?.content?.trim() || "";
    // Clean up markdown fences if present
    if (content.startsWith("```markdown")) {
      content = content.replace(/^```markdown\s*/, "").replace(/\s*```$/, "");
    } else if (content.startsWith("```")) {
      content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    return content;
  } catch (err: any) {
    if (retries < 4) {
      console.log(`      ⏳ Retry ${retries + 1}/4 dans ${DELAY_MS * (retries + 1)}ms...`);
      await sleep(DELAY_MS * (retries + 1));
      return translateArticle(zai, fileContent, targetLang, retries + 1);
    }
    throw err;
  }
}

async function main() {
  console.log("🚀 Initialisation z-ai SDK...");
  const zai = await ZAI.create();

  // Find all FR articles
  const frFiles: { category: string; filename: string; slug: string }[] = [];

  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const catDir = path.join(CONTENT_DIR, cat.name);
    const files = fs.readdirSync(catDir);
    for (const file of files) {
      if (file.endsWith(".fr.md")) {
        const slug = file.replace(".fr.md", "");
        frFiles.push({ category: cat.name, filename: file, slug });
      }
    }
  }

  console.log(`📖 Trouvé ${frFiles.length} articles FR à traduire`);

  for (let i = 0; i < frFiles.length; i++) {
    const { category, filename, slug } = frFiles[i];
    console.log(`\n[${i + 1}/${frFiles.length}] "${slug}" (${category})`);

    const frPath = path.join(CONTENT_DIR, category, filename);
    const frContent = fs.readFileSync(frPath, "utf-8");

    for (const [langCode, langName] of Object.entries(TARGETS)) {
      const targetPath = path.join(CONTENT_DIR, category, `${slug}.${langCode}.md`);

      // Skip if already translated
      if (fs.existsSync(targetPath)) {
        console.log(`   ✅ ${langCode} déjà traduit (skip)`);
        continue;
      }

      try {
        console.log(`   • Traduction ${langName} (${langCode})...`);
        const translated = await translateArticle(zai, frContent, langName);

        // Ensure the locale field is correct
        const fixed = translated.replace(
          /locale:\s*"[a-z]{2}"/,
          `locale: "${langCode}"`
        );

        fs.writeFileSync(targetPath, fixed, "utf-8");
        console.log(`   ✅ ${langCode}.md sauvegardé (${fixed.length} chars)`);
      } catch (err) {
        console.error(`   ❌ Erreur ${langCode}:`, err);
      }

      await sleep(DELAY_MS);
    }
  }

  // Count total articles
  let total = 0;
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const files = fs.readdirSync(path.join(CONTENT_DIR, cat.name));
    total += files.filter((f) => f.endsWith(".md")).length;
  }

  console.log(`\n🎉 Traduction terminée ! Total: ${total} articles (5 langues × ${frFiles.length} articles)`);
}

main().catch((err) => {
  console.error("💥 Erreur fatale:", err);
  process.exit(1);
});
