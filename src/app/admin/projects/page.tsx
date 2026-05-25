"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ProjectFrontmatter } from "@/types/project";

type ProjectItem = ProjectFrontmatter & { slug: string };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json() as Promise<ProjectItem[]>;
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((e: unknown) => {
        setFetchError(e instanceof Error ? e.message : "Error al cargar");
        setLoading(false);
      });
  }, [revision]);

  async function handleDelete(slug: string) {
    if (!confirm(`¿Eliminar el proyecto "${slug}"?`)) return;
    await adminFetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    setRevision((r) => r + 1);
  }

  if (loading) return <div className="p-8 text-zinc-400">Cargando...</div>;
  if (fetchError)
    return (
      <div className="p-8 text-red-400">
        Error al cargar proyectos: {fetchError}
      </div>
    );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Proyectos</h1>
          <p className="text-sm text-zinc-400">{projects.length} proyecto(s)</p>
        </div>
        <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200">
          <Link href="/admin/projects/new">
            <Plus className="mr-1 size-4" />
            Nuevo proyecto
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-zinc-500">No hay proyectos. Crea uno nuevo.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{p.title}</span>
                  {p.featured && (
                    <Badge
                      variant="secondary"
                      className="bg-zinc-700 text-xs text-zinc-300"
                    >
                      destacado
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-zinc-800 text-xs text-zinc-400"
                  >
                    {p.status}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-zinc-400">
                  {p.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white"
                >
                  <Link href={`/admin/projects/${p.slug}`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-red-400"
                  onClick={() => handleDelete(p.slug)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
