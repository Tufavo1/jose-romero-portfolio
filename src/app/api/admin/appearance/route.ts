import { NextResponse } from "next/server";
import { readAppearance, writeAppearance } from "@/lib/admin-data";
import { profile } from "@/data/profile";

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
  const data = (await readAppearance()) ?? DEFAULT_APPEARANCE;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeAppearance(body);
  return NextResponse.json({ ok: true });
}
