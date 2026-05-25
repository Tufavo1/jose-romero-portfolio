"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AdminContactPage() {
  const [email, setEmail] = useState("");
  const [formEnabled, setFormEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setEmail(d.email || "");
        setFormEnabled(d.formEnabled ?? true);
      })
      .catch((e: unknown) => {
        setFetchError(e instanceof Error ? e.message : "Error al cargar datos");
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const res = await adminFetch("/api/admin/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, formEnabled }),
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

  if (fetchError) {
    return (
      <div className="p-8 text-red-400">
        Error al cargar datos: {fetchError}
      </div>
    );
  }

  return (
    <div className="max-w-md p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Contacto</h1>
          <p className="text-sm text-zinc-400">Configuración del formulario</p>
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
        <div className="space-y-1.5">
          <label className="text-sm text-zinc-300">Email de destino</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
          />
          <p className="text-xs text-zinc-500">
            Los mensajes del formulario se envían a este email
          </p>
        </div>

        <Separator className="border-zinc-800" />

        <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">
              Formulario de contacto
            </p>
            <p className="text-xs text-zinc-400">
              {formEnabled
                ? "Visible y activo en el sitio"
                : "Oculto y desactivado"}
            </p>
          </div>
          <button
            onClick={() => setFormEnabled((p) => !p)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
              formEnabled ? "bg-white" : "bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-900 shadow transition-transform ${
                formEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
