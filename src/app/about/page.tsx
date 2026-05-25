import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sobre mí",
  description: `${profile.name} — Full Stack Developer en Santiago, Chile. Ecosistema Microsoft 365, Azure, React y .NET.`,
  path: "/about",
});

export default function AboutPage() {
  const msSkills = skills.filter((s) => s.category === "Microsoft Ecosystem");
  const devSkills = skills.filter(
    (s) => s.category === "Frontend" || s.category === "Backend",
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-10 text-3xl font-bold tracking-tight">Sobre mí</h1>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground leading-relaxed">
            Soy{" "}
            <span className="text-foreground font-medium">
              {profile.fullName}
            </span>
            , Full Stack Developer con base en {profile.location}. Me
            especializo en construir soluciones en el ecosistema Microsoft 365 y
            en desarrollo web moderno con React y .NET.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Actualmente trabajo en Clínica Dávila desarrollando aplicaciones con
            Power Apps, automatizando procesos con Power Automate y analizando
            datos con Power BI. Estoy buscando mi próximo desafío donde pueda
            aportar tanto en el lado técnico como en la toma de decisiones
            basada en datos.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Soy egresado de Ingeniería en Informática en Duoc UC con
            especialización en Software Quality y Data Science. Me interesa el
            desarrollo de software de calidad, la documentación técnica y el
            trabajo bajo metodologías ágiles.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold">Ecosistema Microsoft</h2>
          <div className="flex flex-wrap gap-2">
            {msSkills.map((s) => (
              <Badge
                key={s.name}
                variant="secondary"
                className="text-xs font-normal"
              >
                {s.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold">Desarrollo Web</h2>
          <div className="flex flex-wrap gap-2">
            {devSkills.map((s) => (
              <Badge
                key={s.name}
                variant="secondary"
                className="text-xs font-normal"
              >
                {s.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={profile.urls.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github <i data-lucide="link"></i>
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={profile.urls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <i data-lucide="link"></i>
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={`mailto:${profile.email}`}>
              <Mail className="size-4" />
              {profile.email}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={profile.resume.es} download>
              <Download className="size-4" />
              Descargar CV
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
