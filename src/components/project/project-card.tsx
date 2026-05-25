import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Project } from "@/types/project";
import { ExternalLink, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:border-foreground/20 flex h-full flex-col transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="leading-tight font-semibold">{project.title}</h3>
          <Badge
            variant={project.status === "completed" ? "default" : "secondary"}
            className="shrink-0 text-xs"
          >
            {project.status === "completed"
              ? "Completado"
              : project.status === "in-progress"
                ? "En progreso"
                : "Archivado"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 px-2">
          <Link href={project.url}>
            Ver caso
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        {project.githubUrl && (
          <Button asChild variant="ghost" size="sm" className="gap-1.5 px-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github <i data-lucide="link"></i>
              Código
            </a>
          </Button>
        )}
        {project.liveUrl && (
          <Button asChild variant="ghost" size="sm" className="gap-1.5 px-2">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              Live
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
