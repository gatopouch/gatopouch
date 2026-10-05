import { db } from "@/lib/db";
import { Users, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  let subscribers: any[] = [];
  let totalCount = 0;

  try {
    subscribers = await db.newsletterSubscription.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    totalCount = await db.newsletterSubscription.count({
      where: { status: "active" },
    });
  } catch {}

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl md:text-3xl text-cinnamon-900 mb-2">
        Abonnés Newsletter
      </h1>
      <p className="text-cinnamon-700 text-sm mb-8">
        {totalCount} abonné(s) actif(s) • Email de réception: newsletter@gatopouch.com
      </p>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-cinnamon-900/5">
          <Users className="w-16 h-16 text-peach-300 mx-auto mb-4" />
          <p className="text-cinnamon-700">Aucun abonné pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-cinnamon-900/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-cream-100 text-left text-xs text-cinnamon-700/70 uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Source</th>
                <th className="px-4 py-3 font-semibold text-right">Inscription</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: any, i: number) => (
                <tr
                  key={sub.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-cream-50/50"}
                >
                  <td className="px-4 py-3 text-xs text-cinnamon-700/60">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-cinnamon-900 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-peach-500 shrink-0" />
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 text-xs text-cinnamon-700/60 hidden md:table-cell">
                    {sub.source}
                  </td>
                  <td className="px-4 py-3 text-xs text-cinnamon-700/60 text-right">
                    {new Date(sub.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
