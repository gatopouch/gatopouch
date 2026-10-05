"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from "recharts";
import { Users, MousePointerClick, Eye, TrendingUp } from "lucide-react";

const COLORS = ["oklch(0.7 0.135 45)", "oklch(0.6 0.118 184.704)", "oklch(0.398 0.07 227.392)", "oklch(0.828 0.189 84.429)", "oklch(0.769 0.188 70.08)", "oklch(0.42 0.06 120)", "oklch(0.5 0.1 280)", "oklch(0.6 0.15 350)"];

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  google: "Google",
  bing: "Bing",
  facebook: "Facebook",
  instagram: "Instagram",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  chatgpt: "ChatGPT",
  twitter: "Twitter / X",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  reddit: "Reddit",
  other: "Autre",
};

export function StatsCards({ totalVisits, uniqueIPs, uniqueSessions, bounceRate }: {
  totalVisits: number; uniqueIPs: number; uniqueSessions: number; bounceRate: number;
}) {
  const stats = [
    { label: "Visites totales", value: totalVisits, icon: MousePointerClick, color: "bg-peach-gradient" },
    { label: "Visiteurs uniques", value: uniqueIPs, icon: Users, color: "bg-cinnamon-900" },
    { label: "Sessions", value: uniqueSessions, icon: Eye, color: "bg-peach-300" },
    { label: "Taux de rebond", value: `${bounceRate}%`, icon: TrendingUp, color: "bg-cinnamon-800" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-cinnamon-900/5">
          <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
            <s.icon className="w-6 h-6 text-cream-50" />
          </div>
          <div className="font-display font-extrabold text-3xl text-cinnamon-900">{s.value}</div>
          <div className="text-sm text-cinnamon-700 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function VisitorsChart({ data }: { data: { date: string; visits: number; unique: number }[] }) {
  if (!data.length) return <div className="text-center py-12 text-cinnamon-700/60">Aucune donnée pour cette période</div>;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.7 0.135 45)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="oklch(0.7 0.135 45)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 60)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.5 0.04 50)" }} tickMargin={8} />
        <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.04 50)" }} allowDecimals={false} />
        <Tooltip contentStyle={{ background: "oklch(0.985 0.012 75)", border: "1px solid oklch(0.9 0.02 60)", borderRadius: 12, fontSize: 13 }} />
        <Area type="monotone" dataKey="visits" stroke="oklch(0.7 0.135 45)" strokeWidth={2} fill="url(#visitsGrad)" name="Visites" />
        <Line type="monotone" dataKey="unique" stroke="oklch(0.42 0.06 120)" strokeWidth={2} dot={false} name="Uniques" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SourcesChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <div className="text-center py-12 text-cinnamon-700/60">Aucune donnée</div>;
  const chartData = data.map((d) => ({ name: SOURCE_LABELS[d.name] || d.name, value: d.value }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "oklch(0.985 0.012 75)", border: "1px solid oklch(0.9 0.02 60)", borderRadius: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function GeoChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <div className="text-center py-12 text-cinnamon-700/60">Aucune donnée géographique</div>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 60)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.5 0.04 50)" }} allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.5 0.04 50)" }} width={80} />
        <Tooltip contentStyle={{ background: "oklch(0.985 0.012 75)", border: "1px solid oklch(0.9 0.02 60)", borderRadius: 12 }} />
        <Bar dataKey="value" fill="oklch(0.7 0.135 45)" radius={[0, 8, 8, 0]} name="Visites" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopCities({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <div className="text-center py-8 text-cinnamon-700/60">Aucune donnée de ville</div>;
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((c, i) => (
        <div key={c.name} className="flex items-center gap-3">
          <span className="text-sm font-medium text-cinnamon-900 w-32 truncate">{c.name}</span>
          <div className="flex-1 bg-cream-100 rounded-full h-7 overflow-hidden">
            <div className="bg-peach-gradient h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${(c.value / max) * 100}%` }}>
              <span className="text-xs font-bold text-cream-50">{c.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopPages({ data }: { data: { path: string; visits: number }[] }) {
  if (!data.length) return <div className="text-center py-8 text-cinnamon-700/60">Aucune donnée</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-cinnamon-700/70 uppercase tracking-wider border-b border-cinnamon-900/10">
            <th className="py-2 px-3">Page</th>
            <th className="py-2 px-3 text-right">Visites</th>
            <th className="py-2 px-3 text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => {
            const pct = data[0] ? ((p.visits / data[0].visits) * 100).toFixed(0) : "0";
            return (
              <tr key={p.path} className={i % 2 === 0 ? "bg-white" : "bg-cream-50/50"}>
                <td className="py-2 px-3 text-sm text-cinnamon-900 font-mono truncate max-w-xs">{p.path}</td>
                <td className="py-2 px-3 text-sm text-cinnamon-700 text-right font-bold">{p.visits}</td>
                <td className="py-2 px-3 text-xs text-cinnamon-700/60 text-right">{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
