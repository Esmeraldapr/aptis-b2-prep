import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMyEnrollments } from '../hooks/useEnrollment'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { LevelBadge } from '../components/LevelBadge'

export function Dashboard() {
  const { profile } = useAuth()
  const { data: enrollments, isLoading, error } = useMyEnrollments()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hola{profile?.nombre ? `, ${profile.nombre}` : ''} 👋</h1>
        <p className="text-slate-500">
          Tu nivel actual: <LevelBadge level={profile?.nivel_actual ?? 'A1'} />
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Mis cursos</h2>
          <Link to="/cursos" className="text-sm font-medium text-indigo-600 hover:underline">
            Explorar más cursos →
          </Link>
        </div>
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message="No se pudieron cargar tus cursos." />}
        {!isLoading && enrollments?.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="mb-3 text-slate-500">Todavía no estás matriculado en ningún curso.</p>
            <Link to="/cursos" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Ver catálogo de cursos
            </Link>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments?.map((e) => (
            <Link
              key={e.id}
              to={`/cursos/${e.courses.id}`}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm"
            >
              <LevelBadge level={e.courses.level} />
              <h3 className="font-semibold text-slate-900">{e.courses.title}</h3>
              <span className="text-xs text-slate-400">
                Estado: {e.status === 'active' ? 'En curso' : e.status === 'completed' ? 'Completado' : 'Abandonado'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
