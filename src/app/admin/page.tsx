import Link from "next/link";

const sections = [
  {
    href: "/admin/home",
    label: "Inicio",
    desc: "Hero, título, descripción, disponibilidad",
  },
  {
    href: "/admin/projects",
    label: "Proyectos",
    desc: "Crear, editar y eliminar proyectos",
  },
  {
    href: "/admin/about",
    label: "Sobre mí",
    desc: "Bio y lista de habilidades",
  },
  {
    href: "/admin/experience",
    label: "Experiencia",
    desc: "Experiencia laboral y educación",
  },
  {
    href: "/admin/certifications",
    label: "Certificaciones",
    desc: "Certificados y credenciales",
  },
  {
    href: "/admin/contact",
    label: "Contacto",
    desc: "Email y configuración del formulario",
  },
  {
    href: "/admin/appearance",
    label: "Apariencia",
    desc: "Nav y footer del sitio",
  },
  { href: "/admin/cv", label: "CV", desc: "Subir PDF en español e inglés" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Gestiona el contenido de tu portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60"
          >
            <p className="font-medium text-white">{s.label}</p>
            <p className="mt-1 text-sm text-zinc-400">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
