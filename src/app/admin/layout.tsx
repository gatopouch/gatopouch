"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { PawPrint, LayoutDashboard, FileText, Mail, Users, LogOut, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/contact", label: "Messages", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = document.cookie.includes("admin-session=authenticated");
    if (!session && !pathname.includes("/admin/login")) {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // Login page renders without sidebar
  if (pathname === "/admin/login" || pathname === "/admin" || pathname === "/admin/") {
    return <>{children}</>;
  }

  // Check auth for protected pages
  const isAuthed = typeof document !== "undefined" && document.cookie.includes("admin-session=authenticated");
  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinnamon-900">
        <div className="text-cream-50 animate-pulse">Redirection...</div>
      </div>
    );
  }

  const handleLogout = () => {
    document.cookie = "admin-session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-cinnamon-900 text-cream-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-2 border-b border-cream-50/10">
          <div className="w-10 h-10 rounded-2xl bg-peach-gradient flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-cream-50" />
          </div>
          <div>
            <div className="font-display font-bold text-lg">GatoPouch</div>
            <div className="text-xs text-cream-50/60">Admin Dashboard</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden ml-auto p-1 rounded-lg hover:bg-cream-50/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-peach-gradient text-cream-50"
                    : "text-cream-50/70 hover:bg-cream-50/10 hover:text-cream-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cream-50/10">
          <Link
            href="/fr"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-cream-50/70 hover:bg-cream-50/10 transition-colors mb-1"
          >
            <PawPrint className="w-4 h-4" />
            <span className="text-sm">Voir le site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-cream-50/70 hover:bg-cream-50/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-30 bg-cinnamon-900 text-cream-50 p-4 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg hover:bg-cream-50/10">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display font-bold">GatoPouch Admin</span>
        </div>

        {/* Page content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
