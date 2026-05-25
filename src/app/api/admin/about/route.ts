import { NextResponse } from "next/server";
import {
  readProfile,
  writeProfile,
  readSkills,
  writeSkills,
} from "@/lib/admin-data";
import { profile } from "@/data/profile";
import { skills as defaultSkills } from "@/data/skills";

export async function GET() {
  const profileData = (await readProfile()) ?? profile;
  const skillsData = await readSkills();
  return NextResponse.json({
    bio: profileData.shortBio,
    skills: skillsData.length > 0 ? skillsData : defaultSkills,
  });
}

export async function PUT(request: Request) {
  const { bio, skills } = await request.json();
  const profileData = (await readProfile()) ?? profile;
  await writeProfile({ ...profileData, shortBio: bio });
  await writeSkills(skills);
  return NextResponse.json({ ok: true });
}
