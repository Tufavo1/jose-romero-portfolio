import { supabaseAdmin } from "@/lib/supabase";
import type { ProjectFrontmatter } from "@/types/project";

// Profile
export async function readProfile() {
  const { data } = await supabaseAdmin
    .from("profile")
    .select("data")
    .eq("id", 1)
    .single();
  return data?.data ?? null;
}

export async function writeProfile(profile: unknown) {
  await supabaseAdmin.from("profile").upsert({ id: 1, data: profile });
}

// Skills
export async function readSkills() {
  const { data } = await supabaseAdmin
    .from("skills")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function writeSkills(skills: unknown[]) {
  await supabaseAdmin.from("skills").delete().neq("id", 0);
  if (skills.length > 0) {
    await supabaseAdmin
      .from("skills")
      .insert(skills.map((s, i) => ({ ...(s as object), sort_order: i })));
  }
}

// Experience
export async function readExperience() {
  const { data } = await supabaseAdmin
    .from("experience")
    .select("data")
    .order("sort_order");
  return data?.map((r) => r.data) ?? [];
}

export async function writeExperience(experience: unknown[]) {
  await supabaseAdmin.from("experience").delete().neq("id", 0);
  if (experience.length > 0) {
    await supabaseAdmin
      .from("experience")
      .insert(experience.map((e, i) => ({ data: e, sort_order: i })));
  }
}

// Education
export async function readEducation() {
  const { data } = await supabaseAdmin
    .from("education")
    .select("data")
    .order("sort_order");
  return data?.map((r) => r.data) ?? [];
}

export async function writeEducation(education: unknown[]) {
  await supabaseAdmin.from("education").delete().neq("id", 0);
  if (education.length > 0) {
    await supabaseAdmin
      .from("education")
      .insert(education.map((e, i) => ({ data: e, sort_order: i })));
  }
}

// Certifications
export async function readCertifications() {
  const { data } = await supabaseAdmin
    .from("certifications")
    .select("data")
    .order("sort_order");
  return data?.map((r) => r.data) ?? [];
}

export async function writeCertifications(certifications: unknown[]) {
  await supabaseAdmin.from("certifications").delete().neq("id", 0);
  if (certifications.length > 0) {
    await supabaseAdmin
      .from("certifications")
      .insert(certifications.map((c, i) => ({ data: c, sort_order: i })));
  }
}

// Appearance
export async function readAppearance() {
  const { data } = await supabaseAdmin
    .from("appearance")
    .select("data")
    .eq("id", 1)
    .single();
  return data?.data ?? null;
}

export async function writeAppearance(appearance: unknown) {
  await supabaseAdmin.from("appearance").upsert({ id: 1, data: appearance });
}

// Contact settings
export async function readContactSettings() {
  const { data } = await supabaseAdmin
    .from("contact_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data ?? { email: "", form_enabled: true };
}

export async function writeContactSettings(
  email: string,
  formEnabled: boolean,
) {
  await supabaseAdmin
    .from("contact_settings")
    .upsert({ id: 1, email, form_enabled: formEnabled });
}

// Projects
export async function listAdminProjects() {
  const { data } = await supabaseAdmin
    .from("projects")
    .select("slug, frontmatter, updated_at")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((r) => ({
    slug: r.slug,
    ...(r.frontmatter as ProjectFrontmatter),
  }));
}

export async function getAdminProject(slug: string) {
  const { data } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) return null;
  return {
    slug: data.slug,
    ...(data.frontmatter as ProjectFrontmatter),
    content: data.content,
  };
}

export async function writeAdminProject(
  slug: string,
  frontmatter: ProjectFrontmatter,
  content: string,
) {
  await supabaseAdmin.from("projects").upsert({
    slug,
    frontmatter,
    content,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteAdminProject(slug: string) {
  await supabaseAdmin.from("projects").delete().eq("slug", slug);
}
