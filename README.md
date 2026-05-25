# Jose Romero — Portfolio

Mi portfolio personal. Lo construí desde cero porque quería algo que reflejara cómo pienso, cómo trabajo y qué tipo de proyectos hago - no una plantilla genérica.

---

## Stack

### Frontend

- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Framer Motion

### Contenido

- MDX para casos de estudio
- next-mdx-remote + gray-matter

### Backend e infraestructura

- Resend — emails del formulario de contacto
- Upstash Redis — rate limiting
- GitHub API — actividad en tiempo real

### Calidad

- ESLint + Prettier + Husky + lint-staged
- Vitest — unit tests
- Playwright — E2E tests

---

## Seguridad

Este proyecto aplica varias capas de seguridad:

**Variables de entorno**
Todas las credenciales y configuraciones sensibles viven en `.env.local`, que está excluido del repositorio. El archivo `.env.example` documenta las variables necesarias sin exponer valores reales.

**Rate limiting**
El endpoint del formulario de contacto (`/api/contact`) tiene rate limiting por IP con Upstash Redis — máximo 3 solicitudes por hora. Esto previene spam y abuso del servicio de email.

**Validación de inputs**
Todos los datos del formulario se validan con Zod tanto en el cliente (react-hook-form) como en el servidor (API route) antes de procesarse. No se procesa ningún input sin validación previa.

**Headers de seguridad**
Next.js aplica headers de seguridad por defecto en producción. En Vercel se activan automáticamente headers como `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy`.

**API routes protegidas**
Los endpoints de API no exponen variables de entorno al cliente. El token de GitHub y las credenciales de Resend/Upstash solo existen en el servidor.

---

## Entornos

El proyecto distingue entre tres entornos:

| Entorno       | Descripción                                          |
| ------------- | ---------------------------------------------------- |
| `development` | `pnpm dev` — Turbopack, hot reload, sin analytics    |
| `preview`     | PRs en Vercel — URL de preview automática por branch |
| `production`  | `main` → Vercel — dominio custom, analytics activos  |

Las variables de entorno se configuran por separado en cada entorno desde el dashboard de Vercel. Nunca se comparte `.env.local` entre entornos.

---

## Estructura

```txt
src/
├── app/           # Rutas y páginas (Next.js App Router)
├── components/    # UI, layout, secciones y componentes compartidos
├── content/       # Proyectos en MDX
├── data/          # Fuente de verdad — perfil, skills, experiencia
├── lib/           # GitHub API, email, rate limiting, SEO, validaciones
├── hooks/         # Custom React hooks
├── styles/        # Estilos globales
└── types/         # Tipos compartidos de TypeScript
```

---

## Instalación

Requisitos: Node.js 20+ y pnpm.

```bash
git clone https://github.com/Tufavo1/](https://github.com/Tufavo1/jose-romero-portfolio.git
cd portafolio
pnpm install
cp .env.example .env.local
```

Completa `.env.local` con tus credenciales y luego:

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

```bash
# Email (Resend)
RESEND_API_KEY=
CONTACT_TO_EMAIL=

# Rate limiting (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# GitHub API
GITHUB_TOKEN=

# Sitio
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GITHUB_USERNAME=
```

Sin estas variables el sitio funciona igual — el formulario de contacto y los stats de GitHub simplemente no van a operar en desarrollo local.

---

## Scripts

```bash
pnpm dev            # Servidor de desarrollo
pnpm build          # Build de producción
pnpm start          # Servidor de producción
pnpm lint           # ESLint
pnpm type-check     # TypeScript sin emitir
pnpm format         # Prettier en todo el proyecto
pnpm test           # Unit tests con Vitest
pnpm test:e2e       # E2E con Playwright
pnpm test:coverage  # Coverage report
pnpm analyze        # Bundle analyzer
```

---

## Decisiones técnicas

**¿Por qué MDX para los proyectos?**
Quería casos de estudio reales — con contexto, decisiones de arquitectura y trade-offs — no solo tarjetas estáticas. MDX da formato rico con control total y sin depender de un CMS externo.

**¿Por qué archivos TypeScript para los datos?**
Un CMS sería overkill para un portfolio personal. Los archivos `.ts` son type-safe, refactorizables y si algo se rompe, el build falla antes de llegar a producción.

**¿Por qué no Contentlayer?**
Contentlayer2 tiene incompatibilidades conocidas con Next.js 16 y Turbopack. Migré a `next-mdx-remote` + `gray-matter` que funciona perfectamente con el stack actual.

---

## Deploy

Plataforma: Vercel.

El flujo es:

1. Push a `main` → deploy automático a producción
2. Pull requests → preview URL automática
3. GitHub Actions corre typecheck, lint, unit tests y E2E antes de cada merge

---

## Contacto

- LinkedIn: [linkedin.com/in/jose-romero](https://linkedin.com/in/jose-romero)
- GitHub: [github.com/Tufavo1](https://github.com/Tufavo1)

---

## Licencia

MIT
