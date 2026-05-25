import { NextResponse } from "next/server";
import {
  readProfile,
  writeProfile,
  readSkills,
  writeSkills,
} from "@/lib/admin-data";
import { profile } from "@/data/profile";
import { skills as defaultSkills } from "@/data/skills";
import { validateCsrfRequest } from "@/lib/csrf";
import { verifyAdminSession } from "@/lib/admin-auth";
import { aboutSchema } from "@/lib/validations";

export async function GET() {
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const profileData = (await readProfile()) ?? profile;
  const skillsData = await readSkills();
  return NextResponse.json({
    bio: profileData.shortBio,
    skills: skillsData.length > 0 ? skillsData : defaultSkills,
  });
}

export async function PUT(request: Request) {
  const csrfError = await validateCsrfRequest(request);
  if (csrfError) return csrfError;
  const authError = await verifyAdminSession();
  if (authError) return authError;

  const parsed = aboutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        issues: parsed.error.flatten((i) => i.message).fieldErrors,
      },
      { status: 400 },
    );
  }

  const profileData = (await readProfile()) ?? profile;
  await writeProfile({ ...profileData, shortBio: parsed.data.bio });
  await writeSkills(parsed.data.skills);
  return NextResponse.json({ ok: true });
}
