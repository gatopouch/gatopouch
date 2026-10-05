"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PawPrint, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Mot de passe incorrect");
      }

      toast({ title: "✅ Connecté", description: "Bienvenue dans le dashboard" });
      // Petit délai pour que le cookie soit traité par le navigateur
      setTimeout(() => {
        router.replace("/admin/dashboard");
        router.refresh();
      }, 500);
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: err instanceof Error ? err.message : "Connexion échouée",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinnamon-900 px-4">
      <div className="bg-cream-50 rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-peach-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
            <PawPrint className="w-8 h-8 text-cream-50" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-cinnamon-900">
            GatoPouch Admin
          </h1>
          <p className="text-cinnamon-700 text-sm mt-1">
            Connectez-vous pour accéder au dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinnamon-700/60" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 h-14 rounded-full border border-cinnamon-900/15 bg-white text-cinnamon-900 text-base focus:outline-none focus:border-peach-400 focus:ring-2 focus:ring-peach-400/20"
              placeholder="Mot de passe admin"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-peach-gradient text-cream-50 font-display font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-cinnamon-700/50 mt-6">
          Accès réservé à l'équipe GatoPouch
        </p>
      </div>
    </div>
  );
}
