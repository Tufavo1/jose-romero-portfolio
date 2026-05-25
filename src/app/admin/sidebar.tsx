"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import {
  LayoutDashboard,
  Home,
  FolderOpen,
  User,
  Briefcase,
  Award,
  Mail,
  Paintbrush,
  FileText,
  ExternalLink,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Inicio", icon: Home },
  { href: "/admin/projects", label: "Proyectos", icon: FolderOpen },
  { href: "/admin/about", label: "Sobre mí", icon: User },
  { href: "/admin/experience", label: "Experiencia", icon: Briefcase },
  { href: "/admin/certifications", label: "Certificaciones", icon: Award },
  { href: "/admin/contact", label: "Contacto", icon: Mail },
  { href: "/admin/appearance", label: "Apariencia", icon: Paintbrush },
  { href: "/admin/cv", label: "CV", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminFetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-4 py-4">
        <span className="text-sm font-semibold tracking-wide text-zinc-100">
          Portfolio Admin
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive(href, exact)
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-zinc-800 px-2 py-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
        >
          <ExternalLink className="size-4 shrink-0" />
          Ver sitio
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-red-400"
        >
          <LogOut className="size-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
