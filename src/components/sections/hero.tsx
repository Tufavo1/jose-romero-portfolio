import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/data/profile";
import { ArrowRight, Download, MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex max-w-3xl flex-col gap-6">
          <Badge
            variant="outline"
            className="w-fit gap-1.5 text-xs font-normal"
          >
            <MapPin className="size-3" />
            {profile.location} · Disponible para nuevas oportunidades
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Hola, soy <span className="text-primary">{profile.name}</span>
          </h1>

          <p className="text-muted-foreground text-xl leading-relaxed font-light md:text-2xl">
            Full Stack Developer especializado en ecosistema{" "}
            <span className="text-foreground font-medium">Microsoft 365</span>,{" "}
            <span className="text-foreground font-medium">Azure</span> y
            desarrollo web moderno con{" "}
            <span className="text-foreground font-medium">React / .NET</span>.
          </p>

          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Construyo aplicaciones empresariales, automatizo procesos y analizo
            datos. Actualmente en Clínica Dávila, buscando mi próximo desafío.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                Ver proyectos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={profile.resume.es} download>
                <Download className="size-4" />
                Descargar CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
