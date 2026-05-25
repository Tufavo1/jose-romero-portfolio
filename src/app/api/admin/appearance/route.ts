import { NextResponse } from "next/server";
import { readAppearance, writeAppearance } from "@/lib/admin-data";
import { profile } from "@/data/profile";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { appearanceSchema } from "@/lib/validations";

const DEFAULT_APPEARANCE = {
  navLinks: [
    { href: "/", label: "Inicio" },
    { href: "/projects", label: "Proyectos" },
    { href: "/experience", label: "Experiencia" },
    { href: "/about", label: "Sobre mí" },
    { href: "/contact", label: "Contacto" },
  ],
  footer: {
    copyrightName: profile.name,
    socialLinks: [
      { label: "GitHub", url: profile.urls.github },
      { label: "LinkedIn", url: profile.urls.linkedin },
    ],
  },
};

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const data = (await readAppearance()) ?? DEFAULT_APPEARANCE;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = appearanceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  await writeAppearance(parsed.data);
  return NextResponse.json({ ok: true });
}
