/**
 * Génère une image professionnelle pour chaque article de blog
 * 40 articles FR × 1 image = 40 images
 * Style: warm, cozy, cat care, professional, landscape 1344x768
 */

import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(__dirname, "..", "src", "content", "blog");
const IMG_DIR = path.join(__dirname, "..", "public", "images", "blog");
const DELAY_MS = 3000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Map article slug → image prompt
function buildPrompt(title: string, description: string, tags: string[]): string {
  return `Professional blog header image about: "${title}". 
Context: ${description}.
Style: warm, cozy, professional, cat care theme, soft natural lighting,
cream and peach color palette, inviting and reassuring atmosphere.
The image should visually represent the article topic with a cat.
No text overlay, no words in the image. Clean, modern, editorial style.`;
}

async function main() {
  console.log("🚀 Init z-ai SDK...");
  const zai = await ZAI.create();

  // Ensure output directory
  if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  // Find all FR articles
  const frFiles: { cat: string; slug: string; title: string; desc: string; tags: string[] }[] = [];

  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    const catDir = path.join(CONTENT_DIR, cat.name);
    const files = fs.readdirSync(catDir);
    for (const file of files) {
      if (!file.endsWith(".fr.md")) continue;
      const slug = file.replace(".fr.md", "");
      const content = fs.readFileSync(path.join(catDir, file), "utf-8");

      // Parse frontmatter
      const titleMatch = content.match(/^title:\s*"(.+)"/m);
      const descMatch = content.match(/^description:\s*"(.+)"/m);
      const tagsMatch = content.match(/^tags:\s*\[(.+)\]/m);

      frFiles.push({
        cat: cat.name,
        slug,
        title: titleMatch?.[1] || slug,
        desc: descMatch?.[1] || "",
        tags: tagsMatch?.[1]?.split(",").map((t) => t.trim().replace(/"/g, "")) || [],
      });
    }
  }

  console.log(`📖 ${frFiles.length} articles à traiter\n`);

  for (let i = 0; i < frFiles.length; i++) {
    const article = frFiles[i];
    const imgPath = path.join(IMG_DIR, `${article.slug}.png`);

    if (fs.existsSync(imgPath)) {
      console.log(`[${i + 1}/${frFiles.length}] ⏭️  ${article.slug} (image existante)`);
      continue;
    }

    const prompt = buildPrompt(article.title, article.desc, article.tags);
    console.log(`[${i + 1}/${frFiles.length}] 🎨 ${article.slug}...`);

    try {
      const response = await zai.images.generations.create({
        prompt,
        size: "1344x768",
      });

      const base64 = response.data[0]?.base64;
      if (!base64) {
        console.log("   ⚠️ Pas d'image retournée");
        continue;
      }

      const buffer = Buffer.from(base64, "base64");
      fs.writeFileSync(imgPath, buffer);
      console.log(`   ✅ Image sauvegardée (${(buffer.length / 1024).toFixed(0)} KB)`);

      // Update frontmatter in all 5 language files
      for (const lang of ["fr", "en", "es", "de", "it"]) {
        const langPath = path.join(CONTENT_DIR, article.cat, `${article.slug}.${lang}.md`);
        if (!fs.existsSync(langPath)) continue;

        let langContent = fs.readFileSync(langPath, "utf-8");

        // Add image field if not present
        if (!langContent.includes("image:")) {
          // Insert after the description line
          langContent = langContent.replace(
            /(description:\s*".+"?\n)/,
            `$1image: "/images/blog/${article.slug}.png"\n`
          );
          fs.writeFileSync(langPath, langContent, "utf-8");
        }
      }
    } catch (err: any) {
      console.error(`   ❌ Erreur: ${err.message?.slice(0, 100) || err}`);
      // Wait longer on error (429)
      await sleep(DELAY_MS * 3);
    }

    await sleep(DELAY_MS);
  }

  // Count images
  const imgCount = fs.readdirSync(IMG_DIR).filter((f) => f.endsWith(".png")).length;
  console.log(`\n🎉 Terminé ! ${imgCount} images générées dans /public/images/blog/`);
}

main().catch(console.error);
