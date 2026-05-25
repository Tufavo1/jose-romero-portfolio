"use client";

import { ReactNode, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { Experience } from "@/data/experience";
import type { Education } from "@/data/education";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/admin/experience")
      .then((r) => r.json())
      .then(setExperience);
    fetch("/api/admin/education")
      .then((r) => r.json())
      .then(setEducation);
  }, []);

  async function handleSave() {
    setSaving(true);
    await Promise.all([
      adminFetch("/api/admin/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experience),
      }),
      adminFetch("/api/admin/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(education),
      }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addExperience() {
    const empty: Experience = {
      company: "",
      role: "",
      startDate: "",
      endDate: "present",
      description: "",
      achievements: [],
      technologies: [],
    };
    setExperience((p) => [empty, ...p]);
    setExpanded(0);
  }

  function removeExp(i: number) {
    setExperience((p) => p.filter((_, idx) => idx !== i));
  }

  function updateExp(i: number, key: keyof Experience, value: unknown) {
    setExperience((p) =>
      p.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)),
    );
  }

  function updateExpList(
    i: number,
    key: "achievements" | "technologies",
    raw: string,
  ) {
    updateExp(
      i,
      key,
      raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }

  function addEducation() {
    const empty: Education = {
      institution: "",
      degree: "",
      startYear: new Date().getFullYear(),
      endYear: "present",
      highlights: [],
    };
    setEducation((p) => [...p, empty]);
  }

  function removeEdu(i: number) {
    setEducation((p) => p.filter((_, idx) => idx !== i));
  }

  function updateEdu(i: number, key: keyof Education, value: unknown) {
    setEducation((p) =>
      p.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)),
    );
  }

  return (
    <div className="max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Experiencia</h1>
          <p className="text-sm text-zinc-400">Laboral y educación</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-zinc-950 hover:bg-zinc-200"
        >
          {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
        </Button>
      </div>

      <Tabs defaultValue="experience">
        <TabsList className="mb-6 border border-zinc-800 bg-zinc-900">
          <TabsTrigger
            value="experience"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            Experiencia
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            Educación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-3">
          <Button
            onClick={addExperience}
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Plus className="mr-1 size-3.5" /> Añadir experiencia
          </Button>

          {experience.map((exp, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-900"
            >
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div>
                  <span className="font-medium text-white">
                    {exp.company || "Nueva empresa"}
                  </span>
                  <span className="ml-2 text-sm text-zinc-400">{exp.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExp(i);
                    }}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  {expanded === i ? (
                    <ChevronUp className="size-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="size-4 text-zinc-400" />
                  )}
                </div>
              </button>

              {expanded === i && (
                <div className="space-y-3 border-t border-zinc-800 px-4 pt-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Empresa">
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExp(i, "company", e.target.value)
                        }
                        className={ic}
                      />
                    </Field>
                    <Field label="Rol">
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExp(i, "role", e.target.value)}
                        className={ic}
                      />
                    </Field>
                    <Field label="Inicio (YYYY-MM)">
                      <Input
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExp(i, "startDate", e.target.value)
                        }
                        className={ic}
                        placeholder="2024-01"
                      />
                    </Field>
                    <Field label="Fin (YYYY-MM o 'present')">
                      <Input
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExp(i, "endDate", e.target.value)
                        }
                        className={ic}
                        placeholder="present"
                      />
                    </Field>
                  </div>
                  <Field label="Descripción">
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExp(i, "description", e.target.value)
                      }
                      rows={2}
                      className={ic}
                    />
                  </Field>
                  <Field label="Logros (uno por línea)">
                    <Textarea
                      value={exp.achievements.join("\n")}
                      onChange={(e) =>
                        updateExpList(i, "achievements", e.target.value)
                      }
                      rows={3}
                      className={ic}
                    />
                  </Field>
                  <Field label="Tecnologías (una por línea)">
                    <Textarea
                      value={exp.technologies.join("\n")}
                      onChange={(e) =>
                        updateExpList(i, "technologies", e.target.value)
                      }
                      rows={3}
                      className={ic}
                    />
                  </Field>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="education" className="space-y-3">
          <Button
            onClick={addEducation}
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Plus className="mr-1 size-3.5" /> Añadir educación
          </Button>

          {education.map((edu, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">
                  {edu.institution || "Nueva institución"}
                </span>
                <button
                  onClick={() => removeEdu(i)}
                  className="text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Institución">
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEdu(i, "institution", e.target.value)
                    }
                    className={ic}
                  />
                </Field>
                <Field label="Grado">
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEdu(i, "degree", e.target.value)}
                    className={ic}
                  />
                </Field>
                <Field label="Especialización">
                  <Input
                    value={edu.specialization || ""}
                    onChange={(e) =>
                      updateEdu(i, "specialization", e.target.value)
                    }
                    className={ic}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Año inicio">
                    <Input
                      type="number"
                      value={edu.startYear}
                      onChange={(e) =>
                        updateEdu(i, "startYear", Number(e.target.value))
                      }
                      className={ic}
                    />
                  </Field>
                  <Field label="Año fin">
                    <Input
                      value={String(edu.endYear)}
                      onChange={(e) => {
                        const v = e.target.value;
                        updateEdu(
                          i,
                          "endYear",
                          v === "present" ? "present" : Number(v),
                        );
                      }}
                      className={ic}
                      placeholder="present"
                    />
                  </Field>
                </div>
              </div>
              <Field label="Destacados (uno por línea)">
                <Textarea
                  value={(edu.highlights || []).join("\n")}
                  onChange={(e) =>
                    updateEdu(
                      i,
                      "highlights",
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  rows={2}
                  className={ic}
                />
              </Field>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ic =
  "border-zinc-700 bg-zinc-800 text-white text-sm placeholder:text-zinc-500 focus-visible:ring-zinc-600";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-400">{label}</label>
      {children}
    </div>
  );
}
