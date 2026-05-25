import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const lang = formData.get("lang") as string | null;

  if (!file || !lang || !["en", "es"].includes(lang)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 5 MB limit" },
      { status: 413 },
    );
  }

  const filename = `jose-cv-${lang}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("resume")
    .upload(filename, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("resume")
    .getPublicUrl(filename);

  return NextResponse.json({ ok: true, path: urlData.publicUrl });
}
