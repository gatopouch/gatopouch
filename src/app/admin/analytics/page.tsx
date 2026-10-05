import { db } from "@/lib/db";
import { VisitorsChart, SourcesChart, GeoChart, StatsCards, TopPages, TopCities } from "@/components/analytics/analytics-charts";

export const dynamic = "force-dynamic";

type RangeKey = "1d" | "7d" | "30d" | "90d" | "180d" | "365d";

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const rangeKey = (range as RangeKey) || "30d";

  const ranges: Record<RangeKey, number> = {
    "1d": 1,
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "180d": 180,
    "365d": 365,
  };
  const days = ranges[rangeKey] || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Query all visitors in range
  let visitors: any[] = [];
  try {
    visitors = await db.visitor.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    // DB might not be available
  }

  // Compute stats
  const totalVisits = visitors.length;
  const uniqueIPs = new Set(visitors.map((v) => v.ip)).size;
  const uniqueSessions = new Set(visitors.map((v) => v.sessionId).filter(Boolean)).size;
  const bounceRate = uniqueSessions > 0 ? Math.round((1 - visitors.length / uniqueSessions) * 100) : 0;

  // Daily breakdown
  const dailyMap: Record<string, { date: string; visits: number; unique: Set<string> }> = {};
  for (const v of visitors) {
    const d = new Date(v.createdAt);
    const dateKey = d.toISOString().slice(0, 10);
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { date: dateKey, visits: 0, unique: new Set() };
    }
    dailyMap[dateKey].visits++;
    dailyMap[dateKey].unique.add(v.ip);
  }
  const dailyData = Object.values(dailyMap)
    .map((d) => ({ date: d.date, visits: d.visits, unique: d.unique.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Sources
  const sourceMap: Record<string, number> = {};
  for (const v of visitors) {
    const src = v.source || "direct";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  }
  const sourceData = Object.entries(sourceMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Countries
  const countryMap: Record<string, number> = {};
  for (const v of visitors) {
    const c = v.country || v.countryCode || "Unknown";
    countryMap[c] = (countryMap[c] || 0) + 1;
  }
  const countryData = Object.entries(countryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Cities
  const cityMap: Record<string, number> = {};
  for (const v of visitors) {
    if (!v.city) continue;
    cityMap[v.city] = (cityMap[v.city] || 0) + 1;
  }
  const cityData = Object.entries(cityMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  // Top pages
  const pageMap: Record<string, number> = {};
  for (const v of visitors) {
    pageMap[v.path] = (pageMap[v.path] || 0) + 1;
  }
  const pageData = Object.entries(pageMap)
    .map(([path, visits]) => ({ path, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 15);

  const rangeOptions: { key: RangeKey; label: string }[] = [
    { key: "1d", label: "Aujourd'hui" },
    { key: "7d", label: "7 jours" },
    { key: "30d", label: "30 jours" },
    { key: "90d", label: "3 mois" },
    { key: "180d", label: "6 mois" },
    { key: "365d", label: "12 mois" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-cinnamon-900">
            Analytics
          </h1>
          <p className="text-cinnamon-700 text-sm">
            Statistiques de visiteurs — {totalVisits} visites sur {days} jours
          </p>
        </div>
        {/* Range selector */}
        <div className="flex flex-wrap gap-1.5">
          {rangeOptions.map((opt) => (
            <a
              key={opt.key}
              href={`/admin/analytics?range=${opt.key}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                rangeKey === opt.key
                  ? "bg-peach-gradient text-cream-50"
                  : "bg-white text-cinnamon-700 hover:bg-peach-300/30 border border-cinnamon-900/5"
              }`}
            >
              {opt.label}
            </a>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <StatsCards
        totalVisits={totalVisits}
        uniqueIPs={uniqueIPs}
        uniqueSessions={uniqueSessions}
        bounceRate={bounceRate}
      />

      {/* Daily visitors chart */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5 mb-6 mt-6">
        <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-4">
          Visites par jour
        </h2>
        <VisitorsChart data={dailyData} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Traffic sources */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5">
          <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-4">
            Sources de trafic
          </h2>
          <SourcesChart data={sourceData} />
        </div>

        {/* Top countries */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5">
          <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-4">
            Top pays
          </h2>
          <GeoChart data={countryData} />
        </div>
      </div>

      {/* Top cities */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5 mb-6">
        <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-4">
          Top villes
        </h2>
        <TopCities data={cityData} />
      </div>

      {/* Top pages */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5">
        <h2 className="font-display font-bold text-lg text-cinnamon-900 mb-4">
          Pages les plus visitées
        </h2>
        <TopPages data={pageData} />
      </div>
    </div>
  );
}
