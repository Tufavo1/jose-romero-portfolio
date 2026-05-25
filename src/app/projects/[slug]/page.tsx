import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProjectJsonLd } from "@/components/shared/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let project;
  try {
    project = getProjectBySlug(slug);
  } catch {
    return {};
  }

  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let project;
  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  if (!project) notFound();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2 gap-2">
        <Link href="/projects">
          <ArrowLeft className="size-4" />
          Volver a proyectos
        </Link>
      </Button>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <Badge
            variant={project.status === "completed" ? "default" : "secondary"}
          >
            {project.status === "completed"
              ? "Completado"
              : project.status === "in-progress"
                ? "En progreso"
                : "Archivado"}
          </Badge>

          <span className="text-muted-foreground text-sm">
            {new Date(project.date).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
            })}
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          {project.title}
        </h1>

        <p className="text-muted-foreground text-lg">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {project.githubUrl && (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver código
              </a>
            </Button>
          )}

          {project.liveUrl && (
            <Button asChild size="sm" className="gap-2">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
                Ver live
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={project.content} />
      </div>

      <ProjectJsonLd
        title={project.title}
        description={project.description}
        url={project.url}
        datePublished={project.date}
      />
    </div>
  );
}
