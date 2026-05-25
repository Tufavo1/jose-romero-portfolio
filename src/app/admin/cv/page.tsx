"use client";

import { ChangeEvent, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";

type Lang = "es" | "en";

export default function AdminCVPage() {
  const [status, setStatus] = useState<Record<Lang, string>>({
    es: "",
    en: "",
  });
  const [uploading, setUploading] = useState<Record<Lang, boolean>>({
    es: false,
    en: false,
  });

  async function handleUpload(lang: Lang, file: File) {
    setUploading((p) => ({ ...p, [lang]: true }));
    setStatus((p) => ({ ...p, [lang]: "" }));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("lang", lang);

    const res = await adminFetch("/api/admin/cv", { method: "POST", body: fd });
    const data = await res.json();

    setUploading((p) => ({ ...p, [lang]: false }));
    if (res.ok) {
      setStatus((p) => ({ ...p, [lang]: `Subido: ${data.path}` }));
    } else {
      setStatus((p) => ({ ...p, [lang]: `Error: ${data.error}` }));
    }
  }

  return (
    <div className="max-w-md p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">CV</h1>
        <p className="text-sm text-zinc-400">
          Sube las versiones PDF del currículum
        </p>
      </div>

      <div className="space-y-4">
        <CVUploader
          lang="es"
          label="Versión en Español"
          uploading={uploading.es}
          status={status.es}
          onFile={handleUpload.bind(null, "es")}
        />

        <Separator className="border-zinc-800" />

        <CVUploader
          lang="en"
          label="English Version"
          uploading={uploading.en}
          status={status.en}
          onFile={handleUpload.bind(null, "en")}
        />
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        Los archivos se guardan en{" "}
        <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono">
          /public/resume/
        </code>
        . Solo se aceptan archivos PDF.
      </p>
    </div>
  );
}

interface CVUploaderProps {
  lang: Lang;
  label: string;
  uploading: boolean;
  status: string;
  // eslint-disable-next-line no-unused-vars
  onFile: (file: File) => void;
}

function CVUploader({
  lang,
  label,
  uploading,
  status,
  onFile,
}: CVUploaderProps) {
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-300">{label}</p>
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
        <div className="flex-1">
          <p className="font-mono text-xs text-zinc-400">jose-cv-{lang}.pdf</p>
          {status && (
            <p
              className={`mt-1 text-xs ${
                status.startsWith("Error") ? "text-red-400" : "text-green-400"
              }`}
            >
              {status}
            </p>
          )}
        </div>
        <input
          ref={ref}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
        />
        <Button
          onClick={() => ref.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="shrink-0 border-zinc-700 text-zinc-300 hover:text-white"
        >
          {uploading ? (
            "Subiendo..."
          ) : (
            <>
              <Upload className="mr-1 size-3.5" />
              Subir PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
