import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project/project-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Proyectos Destacados
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/projects">
              Ver todos
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
