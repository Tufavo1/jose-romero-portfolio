export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string | "present";
  description: string;
  achievements: string[];
  technologies: string[];
}

export const experience: Experience[] = [
  {
    company: "Clínica Dávila",
    role: "Desarrollador & Analista Microsoft 365",
    startDate: "2025-01",
    endDate: "present",
    description:
      "Desarrollo de aplicaciones y automatización de procesos dentro del ecosistema Microsoft 365 para operaciones clínicas.",
    achievements: [
      "Desarrollo de aplicaciones empresariales con Power Apps",
      "Automatización de procesos críticos con Power Automate",
      "Análisis de datos clínicos con Power BI y Excel avanzado",
      "Gestión de infraestructura en Azure y Azure Document Intelligence AI",
    ],
    technologies: [
      "Power Apps",
      "Power Automate",
      "Power BI",
      "Azure",
      "Microsoft 365",
      "SQL",
    ],
  },
  {
    company: "Comercializadora Abizi Spa",
    role: "Encargado de Catálogo de Productos – Mercado Libre",
    startDate: "2025-01",
    endDate: "2025-05",
    description:
      "Gestión y optimización del catálogo digital en Mercado Libre, mejorando visibilidad y conversión.",
    achievements: [
      "Gestión de más de 1.000 publicaciones activas con titulación estratégica",
      "Mejora de posicionamiento orgánico mediante SEO aplicado a marketplace",
      "Coordinación con áreas de ventas y logística para coherencia del catálogo",
    ],
    technologies: ["Mercado Libre", "SEO", "Excel"],
  },
];
