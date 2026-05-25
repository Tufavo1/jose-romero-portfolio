"use client";

import { ReactNode, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { Certification } from "@/data/certifications";

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/certifications")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function handleSave() {
    setSaving(true);
    await adminFetch("/api/admin/certifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function add() {
    setItems((p) => [
      ...p,
      { name: "", issuer: "", date: "", credentialUrl: "" },
    ]);
  }

  function remove(i: number) {
    setItems((p) => p.filter((_, idx) => idx !== i));
  }

  function update(i: number, key: keyof Certification, value: string) {
    setItems((p) =>
      p.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)),
    );
  }

  return (
    <div className="max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Certificaciones</h1>
          <p className="text-sm text-zinc-400">{items.length} certificado(s)</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={add}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Plus className="mr-1 size-4" />
            Añadir
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-zinc-950 hover:bg-zinc-200"
          >
            {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
          </Button>
        </div>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-zinc-500">
          No hay certificaciones. Añade una.
        </p>
      )}

      <div className="space-y-3">
        {items.map((cert, i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                {cert.name || `Certificación ${i + 1}`}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre">
                <Input
                  value={cert.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  className={ic}
                />
              </Field>
              <Field label="Emisor">
                <Input
                  value={cert.issuer}
                  onChange={(e) => update(i, "issuer", e.target.value)}
                  className={ic}
                />
              </Field>
              <Field label="Fecha (YYYY-MM)">
                <Input
                  value={cert.date}
                  onChange={(e) => update(i, "date", e.target.value)}
                  className={ic}
                  placeholder="2024-01"
                />
              </Field>
              <Field label="URL de credencial">
                <Input
                  value={cert.credentialUrl || ""}
                  onChange={(e) => update(i, "credentialUrl", e.target.value)}
                  className={ic}
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ic =
  "border-zinc-700 bg-zinc-800 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      {children}
    </div>
  );
}
