"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

type NavLink = { href: string; label: string };
type SocialLink = { label: string; url: string };
type AppearanceData = {
  navLinks: NavLink[];
  footer: { copyrightName: string; socialLinks: SocialLink[] };
};

export default function AdminAppearancePage() {
  const [data, setData] = useState<AppearanceData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/appearance")
      .then((r) => r.json())
      .then(setData);
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await adminFetch("/api/admin/appearance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateNav(i: number, key: keyof NavLink, value: string) {
    if (!data) return;
    setData({
      ...data,
      navLinks: data.navLinks.map((l, idx) =>
        idx === i ? { ...l, [key]: value } : l,
      ),
    });
  }

  function addNav() {
    if (!data) return;
    setData({ ...data, navLinks: [...data.navLinks, { href: "", label: "" }] });
  }

  function removeNav(i: number) {
    if (!data) return;
    setData({ ...data, navLinks: data.navLinks.filter((_, idx) => idx !== i) });
  }

  function moveNav(i: number, dir: -1 | 1) {
    if (!data) return;
    const nav = [...data.navLinks];
    const j = i + dir;
    if (j < 0 || j >= nav.length) return;
    const tmp = nav[i]!;
    nav[i] = nav[j]!;
    nav[j] = tmp;
    setData({ ...data, navLinks: nav });
  }

  function updateSocial(i: number, key: keyof SocialLink, value: string) {
    if (!data) return;
    setData({
      ...data,
      footer: {
        ...data.footer,
        socialLinks: data.footer.socialLinks.map((l, idx) =>
          idx === i ? { ...l, [key]: value } : l,
        ),
      },
    });
  }

  function addSocial() {
    if (!data) return;
    setData({
      ...data,
      footer: {
        ...data.footer,
        socialLinks: [...data.footer.socialLinks, { label: "", url: "" }],
      },
    });
  }

  function removeSocial(i: number) {
    if (!data) return;
    setData({
      ...data,
      footer: {
        ...data.footer,
        socialLinks: data.footer.socialLinks.filter((_, idx) => idx !== i),
      },
    });
  }

  if (!data) return <div className="p-8 text-zinc-400">Cargando...</div>;

  return (
    <div className="max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Apariencia</h1>
          <p className="text-sm text-zinc-400">Navegación y footer</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-zinc-950 hover:bg-zinc-200"
        >
          {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
        </Button>
      </div>

      <Tabs defaultValue="nav">
        <TabsList className="mb-6 border border-zinc-800 bg-zinc-900">
          <TabsTrigger
            value="nav"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            Navegación
          </TabsTrigger>
          <TabsTrigger
            value="footer"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            Footer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nav" className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Orden y etiquetas del menú de navegación
            </p>
            <Button
              onClick={addNav}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:text-white"
            >
              <Plus className="mr-1 size-3.5" />
              Añadir
            </Button>
          </div>

          {data.navLinks.map((link, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveNav(i, -1)}
                  disabled={i === 0}
                  className="text-zinc-600 hover:text-zinc-300 disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveNav(i, 1)}
                  disabled={i === data.navLinks.length - 1}
                  className="text-zinc-600 hover:text-zinc-300 disabled:opacity-20"
                >
                  ▼
                </button>
              </div>
              <Input
                value={link.label}
                onChange={(e) => updateNav(i, "label", e.target.value)}
                placeholder="Etiqueta"
                className={`${ic} flex-1`}
              />
              <Input
                value={link.href}
                onChange={(e) => updateNav(i, "href", e.target.value)}
                placeholder="/ruta"
                className={`${ic} flex-1`}
              />
              <button
                onClick={() => removeNav(i)}
                className="shrink-0 text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="footer" className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300">Nombre en copyright</label>
            <Input
              value={data.footer.copyrightName}
              onChange={(e) =>
                setData({
                  ...data,
                  footer: { ...data.footer, copyrightName: e.target.value },
                })
              }
              className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
            />
          </div>

          <Separator className="border-zinc-800" />

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">Links sociales del footer</p>
            <Button
              onClick={addSocial}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:text-white"
            >
              <Plus className="mr-1 size-3.5" />
              Añadir
            </Button>
          </div>

          {data.footer.socialLinks.map((link, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
            >
              <Input
                value={link.label}
                onChange={(e) => updateSocial(i, "label", e.target.value)}
                placeholder="Etiqueta (GitHub)"
                className={`${ic} flex-1`}
              />
              <Input
                value={link.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                placeholder="https://..."
                className={`${ic} flex-1`}
              />
              <button
                onClick={() => removeSocial(i)}
                className="shrink-0 text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ic =
  "border-zinc-700 bg-zinc-800 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600";
