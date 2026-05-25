"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderOpen,
  Briefcase,
  User,
  Mail,
  Download,
  Search,
} from "lucide-react";
import { profile } from "@/data/profile";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  function open_url(url: string) {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground hidden w-36 justify-between gap-2 text-xs md:flex"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-1.5">
          <Search className="size-3" />
          Buscar...
        </span>
        <kbd className="bg-muted pointer-events-none rounded px-1.5 py-0.5 font-mono text-xs">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas, proyectos..." />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>

          <CommandGroup heading="Navegación">
            <CommandItem onSelect={() => navigate("/")}>
              <Home className="mr-2 size-4" />
              Inicio
            </CommandItem>
            <CommandItem onSelect={() => navigate("/projects")}>
              <FolderOpen className="mr-2 size-4" />
              Proyectos
            </CommandItem>
            <CommandItem onSelect={() => navigate("/experience")}>
              <Briefcase className="mr-2 size-4" />
              Experiencia
            </CommandItem>
            <CommandItem onSelect={() => navigate("/about")}>
              <User className="mr-2 size-4" />
              Sobre mí
            </CommandItem>
            <CommandItem onSelect={() => navigate("/contact")}>
              <Mail className="mr-2 size-4" />
              Contacto
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Links">
            <CommandItem onSelect={() => open_url(profile.urls.github)}>
              GitHub
            </CommandItem>
            <CommandItem onSelect={() => open_url(profile.urls.linkedin)}>
              LinkedIn
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.location.href = profile.resume.es;
              }}
            >
              <Download className="mr-2 size-4" />
              Descargar CV
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
