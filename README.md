# Jose Romero — Portfolio

Mi portfolio personal de ingeniería de software. Construido desde cero con Next.js 16, TypeScript estricto y un stack moderno orientado a calidad, seguridad y mantenibilidad.

🔗 [jose-romero-portfolio.vercel.app](https://jose-romero-portfolio.vercel.app)

---

## Estado del proyecto

```
✅ Completado     🔧 En progreso     📋 Planificado
```

| Área                              | Estado | Notas                                                         |
| --------------------------------- | ------ | ------------------------------------------------------------- |
| Fundación y arquitectura          | ✅     | Next.js 16, TS strict, Tailwind v4                            |
| Modelo de contenido MDX           | ✅     | next-mdx-remote + gray-matter                                 |
| Páginas principales               | ✅     | Home, Proyectos, Experiencia, About, Contacto                 |
| Integraciones backend             | ✅     | Resend, Upstash Redis, GitHub API                             |
| SEO completo                      | ✅     | Metadata, OG images, sitemap, JSON-LD                         |
| Unit tests (Vitest)               | ✅     | 14 tests pasando                                              |
| E2E tests (Playwright)            | ✅     | 20 tests pasando                                              |
| Deploy en Vercel                  | ✅     | CI/CD con GitHub Actions                                      |
| Accesibilidad básica              | ✅     | axe-core, skip to content, ARIA                               |
| Rate limiting formulario          | ✅     | 3 req/hora por IP con Upstash                                 |
| Validación de inputs              | ✅     | Zod en cliente y servidor                                     |
| Proxy de API                      | 🔧     | GitHub API necesita proxy con caché adecuado                  |
| Protección CSRF                   | 🔧     | Pendiente en endpoints de formulario                          |
| Dominio custom                    | 📋     | Reemplazar `.vercel.app` por dominio propio                   |
| Panel de administración           | 📋     | Interfaz para gestionar proyectos sin tocar código            |
| Integración con Supabase          | 📋     | Backend del panel admin — proyectos, imágenes                 |
| Mejoras de diseño                 | 📋     | Animaciones, micro-interacciones, layout refinado             |
| Mejoras en formulario de contacto | 📋     | Honeypot, mejor UX de errores, confirmación visual            |
| Screenshots reales de proyectos   | 📋     | Imágenes reales para Ractoryx Capture y Maintenance Scheduler |
| CV en PDF                         | 📋     | Subir versión actualizada a `/public/resume/`                 |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                     Cliente                          │
│   Next.js 16 App Router (React 19 + Turbopack)      │
│   Tailwind CSS v4 · shadcn/ui · Framer Motion       │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                  API Routes (Server)                  │
│                                                      │
│   /api/contact ──► Zod validation                   │
│                     └► Upstash rate limit            │
│                         └► Resend email              │
│                                                      │
│   /api/github  ──► GitHub REST API (caché 1h)       │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│               Contenido y Datos                      │
│                                                      │
│   src/data/*.ts     ← fuente de verdad tipada       │
│   src/content/*.mdx ← casos de estudio              │
└─────────────────────────────────────────────────────┘
```

---

## Roadmap detallado

### Proxy de API

La integración con GitHub API actualmente hace requests directos desde el servidor. El objetivo es añadir un proxy con caché persistente para evitar rate limiting en producción y reducir latencia.

### Protección CSRF

Los endpoints de formulario necesitan tokens CSRF para prevenir ataques de cross-site request forgery. La implementación planificada usa tokens firmados por sesión validados en el servidor antes de procesar cualquier input.

### Panel de administración

Interfaz visual conectada a Supabase que permita:

- Agregar, editar y eliminar proyectos sin tocar código
- Subir imágenes directamente desde el panel
- Gestionar links de GitHub y live URL por proyecto
- Autenticación con Supabase Auth

### Dominio custom

Migrar de `jose-romero-portfolio.vercel.app` a un dominio propio. Actualización de `NEXT_PUBLIC_SITE_URL`, sitemap y Search Console.

### Mejoras de seguridad pendientes

- Tokens CSRF en formulario de contacto
- Sanitización de inputs contra XSS antes del procesamiento
- Content Security Policy (CSP) headers configurados explícitamente
- Revisión de dependencias con `pnpm audit` en CI

---

## Stack

### Frontend

- Next.js 16 (App Router + Turbopack)
- React 19 · TypeScript (Strict Mode)
- Tailwind CSS v4 · shadcn/ui + Radix UI
- Framer Motion

### Contenido

- MDX · next-mdx-remote · gray-matter

### Backend e infraestructura

- Resend — emails
- Upstash Redis — rate limiting
- GitHub API — actividad en tiempo real
- Supabase — próximamente (panel admin)

### Calidad y seguridad

- ESLint + Prettier + Husky + lint-staged
- Vitest — unit tests
- Playwright — E2E tests
- axe-core — accesibilidad
- Zod — validación de esquemas

---

## Seguridad implementada

**Variables de entorno**
Credenciales en `.env.local`, excluido del repo. `.env.example` documenta las variables sin exponer valores.

**Rate limiting**
`/api/contact` limita a 3 requests por hora por IP con Upstash Redis.

**Validación de inputs**
Zod valida todos los datos del formulario en cliente y servidor. Ningún input se procesa sin validación previa.

**Headers de seguridad**
Vercel activa automáticamente `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy` en producción.

**API routes protegidas**
Tokens de GitHub, Resend y Upstash solo existen en el servidor. Nunca se exponen al cliente.

**Pendiente**
CSRF tokens, CSP headers explícitos, sanitización XSS.

---

## Entornos

| Entorno       | Descripción                                       |
| ------------- | ------------------------------------------------- |
| `development` | `pnpm dev` — Turbopack, hot reload, sin analytics |
| `preview`     | PRs → URL de preview automática en Vercel         |
| `production`  | `main` → Vercel — analytics activos               |

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

tests/
├── unit/          # Vitest — utils, data, validaciones
└── e2e/           # Playwright — navegación, formulario, accesibilidad
```

---

## Instalación local

Requisitos: Node.js 22+ y pnpm.

```bash
git clone https://github.com/Tufavo1/jose-romero-portfolio.git
cd jose-romero-portfolio
pnpm install
cp .env.example .env.local
```

Completa `.env.local` con tus credenciales:

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GITHUB_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_USERNAME=Tufavo1
```

```bash
pnpm dev
```

Sin las variables el sitio funciona — el formulario y los stats de GitHub no van a operar.

---

## Scripts

```bash
pnpm dev            # Servidor de desarrollo
pnpm build          # Build de producción
pnpm start          # Servidor de producción
pnpm lint           # ESLint
pnpm type-check     # TypeScript sin emitir
pnpm format         # Prettier
pnpm test           # Unit tests con Vitest
pnpm test:e2e       # E2E con Playwright
pnpm test:coverage  # Coverage report
pnpm analyze        # Bundle analyzer
```

---

## Decisiones técnicas

**¿Por qué MDX para los proyectos?**
Quería casos de estudio reales con contexto, decisiones de arquitectura y trade-offs — no tarjetas estáticas. MDX da formato rico sin depender de un CMS.

**¿Por qué archivos TypeScript para los datos?**
Un CMS sería overkill. Los `.ts` son type-safe, refactorizables, y si algo se rompe el build falla antes de llegar a producción.

**¿Por qué no Contentlayer?**
Incompatibilidades conocidas con Next.js 16 y Turbopack. Migré a `next-mdx-remote` + `gray-matter`.

**¿Por qué Supabase para el panel admin?**
Ya lo uso en otros proyectos. Auth integrado, storage para imágenes, y Postgres como base de datos — todo en un solo servicio sin infraestructura adicional.

---

## Contacto

- LinkedIn: [linkedin.com/in/jose-romero](https://linkedin.com/in/jose-romero)
- GitHub: [github.com/Tufavo1](https://github.com/Tufavo1)

---

## Licencia

MIT
