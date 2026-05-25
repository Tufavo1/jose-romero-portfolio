import { NextResponse } from "next/server";
import { readContactSettings, writeContactSettings } from "@/lib/admin-data";
import { profile } from "@/data/profile";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { contactSettingsSchema } from "@/lib/validations";

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const data = await readContactSettings();
  return NextResponse.json({
    email: data.email || profile.email,
    formEnabled: data.form_enabled,
  });
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = contactSettingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  await writeContactSettings(parsed.data.email, parsed.data.formEnabled);
  return NextResponse.json({ ok: true });
}
