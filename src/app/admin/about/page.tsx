"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import type { Skill, SkillCategory } from "@/data/skills";

const CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Data & Analytics",
  "Microsoft Ecosystem",
  "Cloud & DevOps",
  "Databases",
  "Testing & QA",
];

const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export default function AdminAboutPage() {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setBio(d.bio || "");
        setSkills(d.skills || []);
      })
      .catch((e: unknown) => {
        setFetchError(e instanceof Error ? e.message : "Error al cargar datos");
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const res = await adminFetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, skills }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSaveError((body as { error?: string }).error ?? "Error al guardar");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addSkill() {
    setSkills((prev) => [
      ...prev,
      { name: "", category: "Frontend", level: "intermediate" },
    ]);
  }

  function removeSkill(i: number) {
    setSkills((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateSkill(i: number, key: keyof Skill, value: string) {
    setSkills((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );
  }

  if (fetchError) {
    return (
      <div className="p-8 text-red-400">
        Error al cargar datos: {fetchError}
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Sobre mí</h1>
          <p className="text-sm text-zinc-400">Bio y habilidades</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-zinc-950 hover:bg-zinc-200"
        >
          {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
        </Button>
      </div>

      {saveError && (
        <p className="mb-4 rounded-md border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-400">
          {saveError}
        </p>
      )}

      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm text-zinc-300">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
          />
        </div>

        <Separator className="border-zinc-800" />

        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Habilidades ({skills.length})
          </p>
          <Button
            onClick={addSkill}
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Plus className="mr-1 size-3.5" />
            Añadir
          </Button>
        </div>

        <div className="space-y-2">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
            >
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(i, "name", e.target.value)}
                placeholder="Nombre"
                className="h-7 flex-1 border-zinc-700 bg-zinc-800 text-sm text-white focus-visible:ring-zinc-600"
              />
              <select
                value={skill.category}
                onChange={(e) => updateSkill(i, "category", e.target.value)}
                className="h-7 rounded-md border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-300"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={skill.level}
                onChange={(e) => updateSkill(i, "level", e.target.value)}
                className="h-7 rounded-md border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-300"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeSkill(i)}
                className="shrink-0 text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="text-sm text-zinc-500">
            No hay habilidades. Añade una.
          </p>
        )}
      </div>
    </div>
  );
}
