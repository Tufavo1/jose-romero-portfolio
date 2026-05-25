import { supabase } from "@/lib/supabase";
import type { Project, ProjectFrontmatter } from "@/types/project";

export async function getProjectSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .order("updated_at", { ascending: false });
  return data?.map((r) => r.slug) ?? [];
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project & { content: string }> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) throw new Error(`Project not found: ${slug}`);

  const frontmatter = data.frontmatter as ProjectFrontmatter;
  return {
    ...frontmatter,
    slug: data.slug,
    url: `/projects/${data.slug}`,
    content: data.content,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("slug, frontmatter, updated_at")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((r) => {
    const frontmatter = r.frontmatter as ProjectFrontmatter;
    return {
      ...frontmatter,
      slug: r.slug,
      url: `/projects/${r.slug}`,
    };
  });
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("slug, frontmatter, updated_at")
    .eq("frontmatter->>featured", "true")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((r) => {
    const frontmatter = r.frontmatter as ProjectFrontmatter;
    return {
      ...frontmatter,
      slug: r.slug,
      url: `/projects/${r.slug}`,
    };
  });
}
