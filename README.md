# Aptis B2 Prep

Plataforma web independiente para aprender y practicar inglés, centrada en la preparación del examen **Aptis ESOL B2**: cursos por niveles (A1–C2), lecciones con vídeo, ejercicios interactivos con corrección automática, seguimiento de progreso y un panel de administración para gestionar contenido.

🔗 **Repositorio:** https://github.com/Esmeraldapr/aptis-b2-prep

## Stack técnico

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS + React Router + TanStack Query
- **Backend:** Supabase (Auth, PostgreSQL con Row Level Security, Edge Functions)
- **Despliegue:** sitio estático (Render / Vercel / Netlify) + Supabase Cloud

> Esta app es completamente independiente de cualquier otro proyecto: usa su propio repositorio y su propio despliegue. Comparte el proyecto Supabase "Ingeniería Informática" solo a nivel de infraestructura, pero todas sus tablas viven en un **esquema PostgreSQL aislado llamado `ingles`**, con sus propias políticas de seguridad, así que no interfiere con ninguna otra aplicación del mismo proyecto Supabase.

## Estructura del proyecto

```
src/
  components/   Componentes reutilizables (Navbar, Layout, tarjetas, ejercicios...)
  context/      AuthContext (sesión, perfil, login/registro/logout)
  hooks/        Hooks de datos con React Query (cursos, lecciones, progreso, admin...)
  lib/          Cliente de Supabase y llamada al edge function de corrección
  pages/        Páginas (landing, login, catálogo, lección, dashboard, admin...)
  types/        Tipos TypeScript del esquema `ingles`
```

## Configuración de Supabase

El esquema `ingles` ya existe en el proyecto Supabase del proyecto (`pfzjubddiqdfpxqoulqy`, región `eu-central-1`) con las siguientes tablas: `profiles`, `courses`, `lessons`, `exercises`, `enrollments`, `student_progress`, `submissions`. Todas tienen Row Level Security activado:

- Cualquiera puede ver el catálogo de cursos (`courses`).
- Un alumno solo ve lecciones/ejercicios de cursos en los que está matriculado.
- Un alumno solo ve y edita su propio perfil, matrículas, progreso y envíos.
- Profesores/admin (`rol = 'teacher'` o `'admin'` en `profiles`) pueden gestionar todo el contenido y ver estadísticas de alumnos.
- La columna `exercises.correct_answer` está bloqueada a nivel de columna para el rol `authenticated`: ni siquiera un alumno matriculado puede leerla directamente por la API. Solo se revela desde el Edge Function `grade-exercise` (y solo cuando la respuesta es incorrecta), y el panel de administración la recupera mediante la función `get_exercise_answer` (RPC), reservada a profesores/admin.

Hay una función Edge desplegada, **`grade-exercise`**, que corrige el ejercicio, guarda el envío (`submissions`) y recalcula el progreso de la lección (`student_progress`) usando la service role key (salta RLS de forma controlada).

### Convertir tu primera cuenta en administradora

Al registrarte, tu perfil se crea automáticamente con `rol = 'student'` (vía un trigger en `auth.users`). Para acceder al panel de administración, hay que promocionar manualmente tu cuenta una vez registrada, ejecutando en el SQL Editor de Supabase (proyecto `pfzjubddiqdfpxqoulqy`):

```sql
update ingles.profiles set rol = 'admin' where email = 'tu-correo@ejemplo.com';
```

## Variables de entorno

Copia `.env.example` a `.env` y rellena con las claves de tu proyecto Supabase (Project Settings → API):

```
VITE_SUPABASE_URL=https://pfzjubddiqdfpxqoulqy.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-o-publishable
```

## Instalación y desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build   # genera la carpeta dist/
npm run preview # sirve el build localmente para comprobarlo
```

## Despliegue

Cualquier hosting de sitios estáticos sirve (Render, Vercel, Netlify...):

- **Build command:** `npm install && npm run build`
- **Publish/output directory:** `dist`
- **Variables de entorno:** las mismas que en `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), configuradas en el panel del hosting.
- El despliegue se puede conectar directamente a este repositorio de GitHub para que cada `git push` a `main` despliegue automáticamente.

Como es una Single Page Application con rutas del lado del cliente (React Router), en Render/Netlify hay que configurar una regla de reescritura para que cualquier ruta devuelva `index.html` (rewrite `/*` → `/index.html`), y lo mismo en Vercel (`vercel.json` con un rewrite).

## Roles de usuario

- **Alumno (`student`):** se registra, ve el catálogo, se matricula en cursos, completa lecciones y ejercicios, ve su progreso y edita su perfil.
- **Profesor/Admin (`teacher` / `admin`):** además de lo anterior, gestiona cursos/lecciones/ejercicios desde `/admin` y consulta estadísticas de alumnos.

## Accesibilidad

Formularios con `<label>` asociado a cada campo, foco visible, un enlace "saltar al contenido principal", roles ARIA en estados de carga/progreso, y contraste de color pensado para cumplir WCAG AA en los componentes principales.
