import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joseromero.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}${project.url}`,
    lastModified: new Date(project.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...projectRoutes,
  ];
}
