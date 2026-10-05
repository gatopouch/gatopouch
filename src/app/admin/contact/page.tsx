import { db } from "@/lib/db";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  let submissions: any[] = [];
  try {
    submissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    // DB might not be available
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl md:text-3xl text-cinnamon-900 mb-2">
        Messages reçus
      </h1>
      <p className="text-cinnamon-700 text-sm mb-8">
        {submissions.length} message(s) via le formulaire de contact
      </p>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-cinnamon-900/5">
          <Mail className="w-16 h-16 text-peach-300 mx-auto mb-4" />
          <p className="text-cinnamon-700">Aucun message pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub: any) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-cinnamon-900/5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-display font-bold text-cinnamon-900">
                    {sub.name}
                  </div>
                  <div className="text-sm text-peach-500">{sub.email}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    sub.status === "new"
                      ? "bg-peach-300/40 text-cinnamon-800"
                      : sub.status === "sent"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {sub.status}
                  </span>
                  <div className="text-xs text-cinnamon-700/60 mt-1">
                    {new Date(sub.createdAt).toLocaleString("fr-FR")}
                  </div>
                </div>
              </div>

              {sub.subject && (
                <div className="text-sm font-medium text-cinnamon-800 mb-1">
                  {sub.subject}
                </div>
              )}
              {sub.phone && (
                <div className="text-xs text-cinnamon-700/60 mb-2 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {sub.phone}
                </div>
              )}

              <p className="text-sm text-cinnamon-700 leading-relaxed bg-cream-50 rounded-xl p-3 mt-2">
                {sub.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
