import { NextResponse } from "next/server";
import { readOverride, writeOverride } from "@/lib/admin-data";
import { validateCsrfRequest } from "@/lib/csrf";
import { profile } from "@/data/profile";

const DEFAULT_CONTACT = {
  email: profile.email,
  formEnabled: true,
};

export async function GET() {
  const profileData = readOverride("profile", profile);
  const contactSettings = readOverride("contact-settings", DEFAULT_CONTACT);
  return NextResponse.json({
    email: profileData.email,
    formEnabled: contactSettings.formEnabled,
  });
}

export async function PUT(request: Request) {
  const csrf = await validateCsrfRequest(request);
  if (csrf) return csrf;

  const { email, formEnabled } = (await request.json()) as {
    email: string;
    formEnabled: boolean;
  };
  const profileData = readOverride("profile", profile);
  writeOverride("profile", { ...profileData, email });
  writeOverride("contact-settings", { email, formEnabled });
  return NextResponse.json({ ok: true });
}
