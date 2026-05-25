import { NextResponse } from "next/server";
import { readProfile, writeProfile } from "@/lib/admin-data";
import { profile } from "@/data/profile";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const data = (await readProfile()) ?? profile;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  await writeProfile(parsed.data);
  return NextResponse.json({ ok: true });
}
