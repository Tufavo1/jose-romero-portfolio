import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Experiencia",
  description:
    "Experiencia laboral y formación de Jose Romero — Clínica Dávila, Duoc UC.",
  path: "/experience",
});
export default function ExperiencePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-12 text-3xl font-bold tracking-tight">Experiencia</h1>

      <section className="mb-16">
        <div className="mb-8 flex items-center gap-2">
          <Briefcase className="size-5" />
          <h2 className="text-xl font-semibold">Experiencia Laboral</h2>
        </div>

        <div className="flex flex-col gap-10">
          {experience.map((exp, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">{exp.role}</h3>
                  <p className="text-muted-foreground text-sm">{exp.company}</p>
                </div>
                <span className="text-muted-foreground shrink-0 text-sm">
                  {exp.startDate.replace("-", "/")} —{" "}
                  {exp.endDate === "present"
                    ? "Presente"
                    : exp.endDate.replace("-", "/")}
                </span>
              </div>

              <p className="text-muted-foreground text-sm">{exp.description}</p>

              <ul className="flex flex-col gap-1.5">
                {exp.achievements.map((achievement, j) => (
                  <li key={j} className="flex gap-2 text-sm">
                    <span className="text-muted-foreground mt-1">·</span>
                    {achievement}
                  </li>
                ))}
              </ul>

              <div className="mt-1 flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {i < experience.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center gap-2">
          <GraduationCap className="size-5" />
          <h2 className="text-xl font-semibold">Educación</h2>
        </div>

        <div className="flex flex-col gap-6">
          {education.map((edu, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-muted-foreground text-sm">
                    {edu.institution}
                  </p>
                </div>
                <span className="text-muted-foreground shrink-0 text-sm">
                  {edu.startYear} —{" "}
                  {edu.endYear === "present" ? "Presente" : edu.endYear}
                </span>
              </div>
              {edu.highlights && (
                <ul className="flex flex-col gap-1">
                  {edu.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="text-muted-foreground flex gap-2 text-sm"
                    >
                      <span className="mt-1">·</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
