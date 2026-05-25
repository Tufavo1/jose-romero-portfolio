"use client";

import { ReactNode, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type ProfileData = {
  name: string;
  fullName: string;
  role: string;
  shortBio: string;
  location: string;
  availability: string;
  email: string;
  urls: { github: string; linkedin: string; site: string };
  resume: { en: string; es: string };
};

export default function AdminHomePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/home")
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e: unknown) => {
        setFetchError(e instanceof Error ? e.message : "Error al cargar datos");
      });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaveError(null);
    const res = await adminFetch("/api/admin/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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

  function update(key: string, value: string) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateUrl(key: string, value: string) {
    setData((prev) =>
      prev ? { ...prev, urls: { ...prev.urls, [key]: value } } : prev,
    );
  }

  if (fetchError) {
    return (
      <div className="p-8 text-red-400">
        Error al cargar datos: {fetchError}
      </div>
    );
  }
  if (!data) return <div className="p-8 text-zinc-400">Cargando...</div>;

  return (
    <div className="max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Inicio</h1>
          <p className="text-sm text-zinc-400">Contenido del hero y perfil</p>
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

      <div className="space-y-5">
        <Field label="Nombre">
          <Input
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputCn}
          />
        </Field>
        <Field label="Nombre completo">
          <Input
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={inputCn}
          />
        </Field>
        <Field label="Rol / Título">
          <Input
            value={data.role}
            onChange={(e) => update("role", e.target.value)}
            className={inputCn}
          />
        </Field>
        <Field label="Descripción corta">
          <Textarea
            value={data.shortBio}
            onChange={(e) => update("shortBio", e.target.value)}
            rows={3}
            className={inputCn}
          />
        </Field>
        <Field label="Ubicación">
          <Input
            value={data.location}
            onChange={(e) => update("location", e.target.value)}
            className={inputCn}
          />
        </Field>
        <Field label="Disponibilidad (badge)">
          <Input
            value={data.availability}
            onChange={(e) => update("availability", e.target.value)}
            className={inputCn}
            placeholder="open to opportunities"
          />
        </Field>
        <Field label="Email de contacto">
          <Input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCn}
          />
        </Field>

        <Separator className="border-zinc-800" />

        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          CTA / Links
        </p>
        <Field label="GitHub URL">
          <Input
            value={data.urls.github}
            onChange={(e) => updateUrl("github", e.target.value)}
            className={inputCn}
          />
        </Field>
        <Field label="LinkedIn URL">
          <Input
            value={data.urls.linkedin}
            onChange={(e) => updateUrl("linkedin", e.target.value)}
            className={inputCn}
          />
        </Field>
        <Field label="Sitio web">
          <Input
            value={data.urls.site}
            onChange={(e) => updateUrl("site", e.target.value)}
            className={inputCn}
          />
        </Field>
      </div>
    </div>
  );
}

const inputCn =
  "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-zinc-300">{label}</label>
      {children}
    </div>
  );
}
