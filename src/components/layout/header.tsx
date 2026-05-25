"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandMenu } from "@/components/shared/command-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/projects", label: "Proyectos" },
  { href: "/experience", label: "Experiencia" },
  { href: "/about", label: "Sobre mí" },
  { href: "/contact", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-foreground text-sm transition-colors",
                pathname === link.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden gap-2 md:flex"
          >
            <a href={profile.resume.es} download>
              <Download className="size-3.5" />
              CV
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
