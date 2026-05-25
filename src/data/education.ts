export interface Education {
  institution: string;
  degree: string;
  specialization?: string;
  startYear: number;
  endYear: number | "present";
  highlights?: string[];
}

export const education: Education[] = [
  {
    institution: "Duoc UC",
    degree: "Ingeniería en Informática",
    specialization: "Software Quality & Data Science",
    startYear: 2021,
    endYear: 2025,
    highlights: [
      "Especialización en Software Quality",
      "Especialización en Data Science",
    ],
  },
];
