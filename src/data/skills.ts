export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Data & Analytics"
  | "Microsoft Ecosystem"
  | "Cloud & DevOps"
  | "Databases"
  | "Testing & QA";

export interface Skill {
  name: string;
  category: SkillCategory;
  level: "beginner" | "intermediate" | "advanced";
}

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "Frontend", level: "advanced" },
  { name: "Next.js", category: "Frontend", level: "advanced" },
  { name: "TypeScript", category: "Frontend", level: "advanced" },
  { name: "Tailwind CSS", category: "Frontend", level: "advanced" },
  // Backend
  { name: ".NET Core 8", category: "Backend", level: "intermediate" },
  { name: "Django", category: "Backend", level: "intermediate" },
  { name: "Firebase", category: "Backend", level: "intermediate" },
  { name: "Supabase", category: "Backend", level: "intermediate" },
  // Data & Analytics
  { name: "Power BI", category: "Data & Analytics", level: "advanced" },
  { name: "Excel Avanzado", category: "Data & Analytics", level: "advanced" },
  { name: "SQL", category: "Databases", level: "advanced" },
  { name: "Azure SQL", category: "Databases", level: "intermediate" },
  // Microsoft Ecosystem
  {
    name: "Power Apps",
    category: "Microsoft Ecosystem",
    level: "advanced",
  },
  {
    name: "Power Automate",
    category: "Microsoft Ecosystem",
    level: "advanced",
  },
  {
    name: "Azure",
    category: "Microsoft Ecosystem",
    level: "intermediate",
  },
  {
    name: "Azure Document Intelligence",
    category: "Microsoft Ecosystem",
    level: "intermediate",
  },
  // Cloud & DevOps
  { name: "GitHub Actions", category: "Cloud & DevOps", level: "intermediate" },
  { name: "CI/CD", category: "Cloud & DevOps", level: "intermediate" },
  { name: "Vercel", category: "Cloud & DevOps", level: "intermediate" },
  // Testing & QA
  { name: "QA Testing", category: "Testing & QA", level: "intermediate" },
  { name: "Scrum", category: "Testing & QA", level: "intermediate" },
];
