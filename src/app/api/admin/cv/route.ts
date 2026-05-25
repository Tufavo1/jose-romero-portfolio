import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { validateCsrfRequest } from "@/lib/csrf";

export async function POST(request: Request) {
  const csrf = await validateCsrfRequest(request);
  if (csrf) return csrf;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const lang = formData.get("lang") as string | null;

  if (!file || !lang || !["en", "es"].includes(lang)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const resumeDir = path.join(process.cwd(), "public/resume");
  await mkdir(resumeDir, { recursive: true });

  const filename = `jose-cv-${lang}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(resumeDir, filename), buffer);

  return NextResponse.json({ ok: true, path: `/resume/${filename}` });
}
