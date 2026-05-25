# Jose Romero — Portfolio

Portfolio personal de ingeniería de software construido con Next.js 16, TypeScript estricto y un stack moderno enfocado en rendimiento, mantenibilidad y buenas prácticas.

🔗 [jose-romero-portfolio.vercel.app](https://jose-romero-portfolio.vercel.app)

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
- MDX
- next-mdx-remote
- gray-matter

### Backend e infraestructura
- Resend
- Upstash Redis
- GitHub API
- Supabase (próximamente)

### Calidad y testing
- ESLint
- Prettier
- Husky
- lint-staged
- Vitest
- Playwright
- axe-core
- Zod

---

## Arquitectura

```txt
src/
├── app/           # Rutas y páginas
├── components/    # Componentes reutilizables
├── content/       # Proyectos en MDX
├── data/          # Datos tipados
├── lib/           # Utilidades y lógica backend
├── hooks/         # Custom hooks
├── styles/        # Estilos globales
└── types/         # Tipos compartidos

tests/
├── unit/
└── e2e/
```

---

## Seguridad

- Rate limiting en `/api/contact` — 3 req/hora por IP con Upstash Redis
- Validación con Zod en cliente y servidor
- Credenciales en `.env.local`, nunca en el repo
- Headers de seguridad vía Vercel (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- Tokens de GitHub, Resend y Upstash solo en servidor

Pendiente: CSRF tokens, CSP headers explícitos, sanitización XSS.

---

## Instalación local

Requisitos: Node.js 22+ y pnpm.

```bash
git clone https://github.com/Tufavo1/jose-romero-portfolio.git
cd jose-romero-portfolio
pnpm install
cp .env.example .env.local
```

Variables en `.env.local`:

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

**MDX para proyectos** — casos de estudio reales con contexto, decisiones de arquitectura y trade-offs. Formato rico sin depender de un CMS.

**Datos en TypeScript** — type-safe, refactorizables, y si algo se rompe el build falla antes de llegar a producción.

**next-mdx-remote en lugar de Contentlayer** — incompatibilidades conocidas de Contentlayer con Next.js 16 y Turbopack.

**Supabase para el panel admin** — Auth integrado, storage para imágenes y Postgres en un solo servicio.

---

## Contacto

- LinkedIn: [linkedin.com/in/jose-romero](https://linkedin.com/in/jose-romero)
- GitHub: [github.com/Tufavo1](https://github.com/Tufavo1)

---

## Licencia

MIT
