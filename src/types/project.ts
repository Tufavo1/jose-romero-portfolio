export interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  url: string;
}
