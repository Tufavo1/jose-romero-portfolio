import { NextResponse } from "next/server";
import { readOverride, writeOverride } from "@/lib/admin-data";
import { validateCsrfRequest } from "@/lib/csrf";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

export async function GET() {
  const profileData = readOverride("profile", profile);
  const skillsData = readOverride("skills", skills);
  return NextResponse.json({ bio: profileData.shortBio, skills: skillsData });
}

export async function PUT(request: Request) {
  const csrf = await validateCsrfRequest(request);
  if (csrf) return csrf;

  const { bio, skills: updatedSkills } = (await request.json()) as {
    bio: string;
    skills: unknown;
  };
  const profileData = readOverride("profile", profile);
  writeOverride("profile", { ...profileData, shortBio: bio });
  writeOverride("skills", updatedSkills);
  return NextResponse.json({ ok: true });
}
