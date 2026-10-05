import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Tracking endpoint — log visitor data with GeoIP + source detection
 * Called client-side on every page load
 */

// Detect traffic source from referer
function detectSource(referer: string | null): string {
  if (!referer) return "direct";
  const ref = referer.toLowerCase();
  if (ref.includes("google.")) return "google";
  if (ref.includes("bing.com")) return "bing";
  if (ref.includes("facebook.com") || ref.includes("fb.com")) return "facebook";
  if (ref.includes("instagram.com")) return "instagram";
  if (ref.includes("pinterest.")) return "pinterest";
  if (ref.includes("tiktok.com")) return "tiktok";
  if (ref.includes("chatgpt.com") || ref.includes("openai.com")) return "chatgpt";
  if (ref.includes("twitter.com") || ref.includes("x.com")) return "twitter";
  if (ref.includes("youtube.com")) return "youtube";
  if (ref.includes("linkedin.com")) return "linkedin";
  if (ref.includes("reddit.com")) return "reddit";
  if (ref.startsWith("http") && !ref.includes("gatopouch")) return "other";
  return "direct";
}

// Get GeoIP from headers (Cloudflare/CDN) or fall back to ip-api.com
async function getGeoIP(ip: string): Promise<{ country?: string; countryCode?: string; region?: string; city?: string }> {
  // Cloudflare headers (if behind CF)
  // These would be set by the CDN/proxy
  return {}; // GeoIP will be resolved in batch on the admin page
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, locale, sessionId } = body;

    // Get IP from various headers
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");
    const ip = cfIp || forwarded?.split(",")[0]?.trim() || realIp || "unknown";

    // Get referer
    const referer = req.headers.get("referer") || req.headers.get("referer") || null;
    const source = detectSource(referer);

    // Get user agent
    const userAgent = req.headers.get("user-agent") || null;

    // Get GeoIP (from headers or leave empty for batch resolution)
    const geo = await getGeoIP(ip);

    // Save visit
    await db.visitor.create({
      data: {
        ip: ip.slice(0, 45), // truncate for DB
        userAgent: userAgent?.slice(0, 500),
        referer: referer?.slice(0, 500),
        path: path?.slice(0, 500) || "/",
        locale: locale || null,
        country: geo.country || null,
        countryCode: geo.countryCode || null,
        region: geo.region || null,
        city: geo.city || null,
        source,
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Silent fail — tracking should never break the page
    console.error("[TRACK] Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
