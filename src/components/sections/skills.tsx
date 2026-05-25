import { Badge } from "@/components/ui/badge";
import { skills, type SkillCategory } from "@/data/skills";

const categoryOrder: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Microsoft Ecosystem",
  "Data & Analytics",
  "Databases",
  "Cloud & DevOps",
  "Testing & QA",
];

export function Skills() {
  const grouped = categoryOrder.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  }));

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="mb-10 text-2xl font-bold tracking-tight">
          Stack Técnico
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map(({ category, items }) => (
            <div key={category} className="flex flex-col gap-3">
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
