import { useAdminStudents } from '../../hooks/useAdminStudents'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'
import { LevelBadge } from '../../components/LevelBadge'

export function AdminStudents() {
  const { data: students, isLoading, error } = useAdminStudents()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Alumnos</h1>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="No se pudo cargar la lista de alumnos." />}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Cursos</th>
              <th className="px-4 py-3">Lecciones completadas</th>
              <th className="px-4 py-3">Puntuación total</th>
              <th className="px-4 py-3">Última conexión</th>
              <th className="px-4 py-3">Nº conexiones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students?.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{s.nombre ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{s.email}</td>
                <td className="px-4 py-3">
                  <LevelBadge level={s.nivel_actual} />
                </td>
                <td className="px-4 py-3">{s.cursos_matriculados}</td>
                <td className="px-4 py-3">{s.lecciones_completadas}</td>
                <td className="px-4 py-3">{s.puntuacion_total}</td>
                <td className="px-4 py-3 text-slate-500">
                  {s.ultima_conexion
                    ? new Date(s.ultima_conexion).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
                    : '—'}
                </td>
                <td className="px-4 py-3">{s.numero_conexiones}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {students?.length === 0 && <p className="p-6 text-center text-slate-500">Todavía no hay alumnos registrados.</p>}
      </div>
    </div>
  )
}
