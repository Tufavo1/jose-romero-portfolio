import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/sections/contact-form";
import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description: `Contacta a ${profile.name} para oportunidades laborales o colaboraciones.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Contacto</h1>

      <p className="text-muted-foreground mb-10 max-w-xl">
        Estoy buscando nuevas oportunidades. Si tienes un proyecto interesante o
        una posición que crees que encaja, escríbeme.
      </p>

      <div className="grid gap-12 md:grid-cols-2">
        <ContactForm />

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            También puedes contactarme directamente por estos canales:
          </p>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 justify-start gap-3"
            >
              <a href={`mailto:${profile.email}`}>
                <Mail className="size-4" />
                {profile.email}
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 justify-start gap-3"
            >
              <a
                href={profile.urls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 justify-start gap-3"
            >
              <a
                href={profile.urls.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
