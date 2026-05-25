import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project/project-card";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Proyectos",
  description:
    "Proyectos de Jose Romero — SaaS empresariales, automatización y desarrollo web moderno.",
  path: "/projects",
});
export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">Proyectos</h1>
        <p className="text-muted-foreground">
          {projects.length} proyecto{projects.length !== 1 ? "s" : ""} — desde
          SaaS empresariales hasta herramientas personales.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
