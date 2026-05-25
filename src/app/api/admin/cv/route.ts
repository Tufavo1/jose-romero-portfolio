import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const lang = formData.get("lang") as string | null;

  if (!file || !lang || !["en", "es"].includes(lang)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
