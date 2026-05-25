import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede superar los 1000 caracteres"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ── Shared primitives ────────────────────────────────────────────────────────

const optionalUrl = z.union([z.string().url(), z.literal("")]).optional();

// ── Admin schemas ────────────────────────────────────────────────────────────

export const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum([
    "Frontend",
    "Backend",
    "Data & Analytics",
    "Microsoft Ecosystem",
    "Cloud & DevOps",
    "Databases",
    "Testing & QA",
  ]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

export const aboutSchema = z.object({
  bio: z.string().max(1000),
  skills: z.array(skillSchema),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  fullName: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  shortBio: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
  availability: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
  urls: z
    .object({
      github: optionalUrl,
      linkedin: optionalUrl,
      site: optionalUrl,
    })
    .optional(),
  resume: z
    .object({
      en: z.string().max(500).optional(),
      es: z.string().max(500).optional(),
    })
    .optional(),
});

export const appearanceSchema = z.object({
  navLinks: z.array(
    z.object({
      href: z.string().min(1).max(200),
      label: z.string().min(1).max(100),
    }),
  ),
  footer: z.object({
    copyrightName: z.string().max(200),
    socialLinks: z.array(
      z.object({
        label: z.string().min(1).max(100),
        url: z.string().max(500),
      }),
    ),
  }),
});

export const certificationSchema = z.object({
  name: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  date: z.string().min(1).max(50),
  credentialUrl: optionalUrl,
  credentialId: z.string().max(200).optional(),
});

export const certificationsSchema = z.array(certificationSchema);

export const contactSettingsSchema = z.object({
  email: z.string().email(),
  formEnabled: z.boolean(),
});

export const educationItemSchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  specialization: z.string().max(200).optional(),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.union([
    z.number().int().min(1900).max(2100),
    z.literal("present"),
  ]),
  highlights: z.array(z.string().max(500)).optional(),
});

export const educationSchema = z.array(educationItemSchema);

export const experienceItemSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  endDate: z.union([
    z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
    z.literal("present"),
  ]),
  description: z.string().max(2000),
  achievements: z.array(z.string().max(500)),
  technologies: z.array(z.string().max(100)),
});

export const experienceSchema = z.array(experienceItemSchema);

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500),
  date: z.string().min(1).max(50),
  tags: z.array(z.string().max(50)),
  featured: z.boolean(),
  status: z.enum(["completed", "in-progress", "archived"]),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  thumbnail: z.string().max(500).optional(),
  content: z.string().optional(),
});

export const projectPostSchema = projectFrontmatterSchema.extend({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});
