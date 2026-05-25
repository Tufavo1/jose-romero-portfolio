"use client";

import { useEffect, useState, use, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type ProjectData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  content: string;
};

const EMPTY: Omit<ProjectData, "slug"> = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  tags: [],
  featured: false,
  status: "in-progress",
  githubUrl: "",
  liveUrl: "",
  thumbnail: "",
  content: "",
};

export default function AdminProjectEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const isNew = slug === "new";
  const router = useRouter();

  const [data, setData] = useState<ProjectData | null>(
    isNew ? { slug: "", ...EMPTY } : null,
  );
  const [newSlug, setNewSlug] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/projects/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json() as Promise<ProjectData & { error?: string }>;
      })
      .then((d) => {
        if (d.error) router.push("/admin/projects");
        else setData(d);
      })
      .catch(() => {
        router.push("/admin/projects");
      });
  }, [slug, isNew, router]);

  function update(key: string, value: unknown) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t || !data) return;
    update("tags", [...(data.tags || []), t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    if (!data) return;
    update(
      "tags",
      data.tags.filter((t) => t !== tag),
    );
  }

  async function handleSave() {
    if (!data) return;
    setError("");
    setSaving(true);

    const targetSlug = isNew ? newSlug : slug;
    const body = { ...data, slug: targetSlug };

    const res = isNew
      ? await adminFetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await adminFetch(`/api/admin/projects/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/projects");
    } else {
      const e = await res.json();
      setError(e.error || "Error al guardar");
    }
  }

  if (!data) return <div className="p-8 text-zinc-400">Cargando...</div>;

  return (
    <div className="max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            {isNew ? "Nuevo proyecto" : `Editar: ${data.title || slug}`}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => router.push("/admin/projects")}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-zinc-950 hover:bg-zinc-200"
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="space-y-5">
        {isNew && (
          <Field label="Slug (URL)">
            <Input
              value={newSlug}
              onChange={(e) =>
                setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              placeholder="mi-proyecto"
              className={inputCn}
            />
            <p className="text-xs text-zinc-500">
              Solo letras, números y guiones
            </p>
          </Field>
        )}

        <Field label="Título">
          <Input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputCn}
          />
        </Field>

        <Field label="Descripción">
          <Textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            rows={2}
            className={inputCn}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Fecha">
            <Input
              type="date"
              value={data.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputCn}
            />
          </Field>
          <Field label="Estado">
            <select
              value={data.status}
              onChange={(e) => update("status", e.target.value)}
              className={`${inputCn} flex h-9 w-full rounded-md border px-3 py-1 text-sm`}
            >
              <option value="completed">Completado</option>
              <option value="in-progress">En progreso</option>
              <option value="archived">Archivado</option>
            </select>
          </Field>
        </div>

        <Field label="Tags">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Añadir tag..."
              className={inputCn}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              className="shrink-0 border-zinc-700 text-zinc-300 hover:text-white"
            >
              Añadir
            </Button>
          </div>
          {data.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer gap-1 bg-zinc-800 text-zinc-300"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="size-3" />
                </Badge>
              ))}
            </div>
          )}
        </Field>

        <Field label="">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-zinc-600"
            />
            <span className="text-sm text-zinc-300">Proyecto destacado</span>
          </label>
        </Field>

        <Separator className="border-zinc-800" />
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Links
        </p>

        <Field label="GitHub URL">
          <Input
            value={data.githubUrl || ""}
            onChange={(e) => update("githubUrl", e.target.value)}
            className={inputCn}
            placeholder="https://github.com/..."
          />
        </Field>
        <Field label="Live URL">
          <Input
            value={data.liveUrl || ""}
            onChange={(e) => update("liveUrl", e.target.value)}
            className={inputCn}
            placeholder="https://..."
          />
        </Field>
        <Field label="Thumbnail URL">
          <Input
            value={data.thumbnail || ""}
            onChange={(e) => update("thumbnail", e.target.value)}
            className={inputCn}
            placeholder="/images/proyecto.png"
          />
        </Field>

        <Separator className="border-zinc-800" />
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Contenido MDX
        </p>

        <Textarea
          value={data.content}
          onChange={(e) => update("content", e.target.value)}
          rows={18}
          placeholder="# Descripción del proyecto..."
          className={`${inputCn} font-mono text-sm`}
        />
      </div>
    </div>
  );
}

const inputCn =
  "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-zinc-300">{label}</label>}
      {children}
    </div>
  );
}
