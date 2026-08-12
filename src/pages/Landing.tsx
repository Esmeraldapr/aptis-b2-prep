import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import { CourseCard } from '../components/CourseCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../context/AuthContext'

export function Landing() {
  const { data: courses, isLoading, error } = useCourses()
  const { user } = useAuth()
  const destacados = courses?.slice(0, 3) ?? []

  return (
    <div className="flex flex-col gap-16">
      <section className="grid items-center gap-8 py-8 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Preparación de inglés B2 · Aptis
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Aprende y practica inglés a tu ritmo
          </h1>
          <p className="text-lg text-slate-600">
            Cursos por niveles (A1–C2), lecciones con vídeo, ejercicios interactivos con corrección automática y
            seguimiento de tu progreso. Empieza gratis hoy mismo.
          </p>
          <div className="flex gap-3">
            {user ? (
              <Link to="/dashboard" className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
                Ir a mi panel
              </Link>
            ) : (
              <Link to="/registro" className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
                Crear cuenta gratis
              </Link>
            )}
            <Link to="/cursos" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100">
              Ver cursos
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          {[
            ['📚', 'Cursos por nivel'],
            ['✅', 'Corrección automática'],
            ['📈', 'Seguimiento de progreso'],
            ['🎧', 'Speaking & Writing'],
          ].map(([emoji, text]) => (
            <div key={text} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-3xl">{emoji}</div>
              <div className="mt-2 text-sm font-medium text-slate-600">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Cursos destacados</h2>
          <Link to="/cursos" className="text-sm font-medium text-indigo-600 hover:underline">
            Ver todos →
          </Link>
        </div>
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message="No se pudieron cargar los cursos." />}
        {!isLoading && !error && destacados.length === 0 && (
          <p className="text-slate-500">Todavía no hay cursos publicados. ¡Vuelve pronto!</p>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
