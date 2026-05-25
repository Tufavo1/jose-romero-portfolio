import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ProjectFrontmatter } from "@/types/project";

const OVERRIDES_DIR = path.join(process.cwd(), "src/data/overrides");
const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readOverride<T>(key: string, fallback: T): T {
  ensureDir(OVERRIDES_DIR);
  const fp = path.join(OVERRIDES_DIR, `${key}.json`);
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export function writeOverride(key: string, data: unknown): void {
  ensureDir(OVERRIDES_DIR);
  const fp = path.join(OVERRIDES_DIR, `${key}.json`);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

export function listAdminProjects() {
  ensureDir(PROJECTS_DIR);
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, f), "utf-8");
      const { data } = matter(raw);
      return { slug, ...(data as ProjectFrontmatter) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAdminProject(slug: string) {
  const fp = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fp)) return null;
  const raw = fs.readFileSync(fp, "utf-8");
  const { data, content } = matter(raw);
  return { slug, ...(data as ProjectFrontmatter), content };
}

export function writeAdminProject(
  slug: string,
  frontmatter: ProjectFrontmatter,
  content: string,
) {
  ensureDir(PROJECTS_DIR);
  const serialized = matter.stringify(content || "", frontmatter);
  fs.writeFileSync(path.join(PROJECTS_DIR, `${slug}.mdx`), serialized, "utf-8");
}

export function deleteAdminProject(slug: string) {
  const fp = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
}
