import { createClient } from "@supabase/supabase-js";
import { profile } from "../src/data/profile";
import { skills } from "../src/data/skills";
import { experience } from "../src/data/experience";
import { education } from "../src/data/education";
import { certifications } from "../src/data/certifications";
import fs from "fs";
import path from "path";

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const yaml = match[1] ?? "";
  const content = match[2] ?? "";
  const data: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();
    if (rawVal === "true") data[key] = true;
    else if (rawVal === "false") data[key] = false;
    else if (rawVal.startsWith("[")) {
      try {
        data[key] = JSON.parse(rawVal);
      } catch {
        data[key] = rawVal;
      }
    } else {
      data[key] = rawVal.replace(/^["']|["']$/g, "");
    }
  }
  return { data, content };
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const db = createClient(url, key);

async function seed() {
  console.log("Seeding Supabase...");

  // Profile
  await db.from("profile").upsert({ id: 1, data: profile });
  console.log("✓ profile");

  // Skills
  await db.from("skills").delete().neq("id", 0);
  await db
    .from("skills")
    .insert(skills.map((s, i) => ({ ...s, sort_order: i })));
  console.log("✓ skills");

  // Experience
  await db.from("experience").delete().neq("id", 0);
  await db
    .from("experience")
    .insert(experience.map((e, i) => ({ data: e, sort_order: i })));
  console.log("✓ experience");

  // Education
  await db.from("education").delete().neq("id", 0);
  await db
    .from("education")
    .insert(education.map((e, i) => ({ data: e, sort_order: i })));
  console.log("✓ education");

  // Certifications
  await db.from("certifications").delete().neq("id", 0);
  if (certifications.length > 0) {
    await db
      .from("certifications")
      .insert(certifications.map((c, i) => ({ data: c, sort_order: i })));
  }
  console.log("✓ certifications");

  // Projects
  const projectsDir = path.join(process.cwd(), "src/content/projects");
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { data: frontmatter, content } = parseFrontmatter(raw);
    await db.from("projects").upsert({ slug, frontmatter, content });
    console.log(`✓ project: ${slug}`);
  }

  // Appearance
  const appearance = {
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
  await db.from("appearance").upsert({ id: 1, data: appearance });
  console.log("✓ appearance");

  // Contact settings
  await db.from("contact_settings").upsert({
    id: 1,
    email: profile.email,
    form_enabled: true,
  });
  console.log("✓ contact_settings");

  console.log("\nDone. Supabase seeded successfully.");
}

seed().catch(console.error);
