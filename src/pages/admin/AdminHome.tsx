import { Link } from 'react-router-dom'
import { useCourses } from '../../hooks/useCourses'
import { useAdminStudents } from '../../hooks/useAdminStudents'

export function AdminHome() {
  const { data: courses } = useCourses()
  const { data: students } = useAdminStudents()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/cursos" className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-sm">
          <div className="text-3xl font-bold text-indigo-700">{courses?.length ?? 0}</div>
          <div className="text-slate-500">Cursos publicados</div>
        </Link>
        <Link to="/admin/alumnos" className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-sm">
          <div className="text-3xl font-bold text-indigo-700">{students?.length ?? 0}</div>
          <div className="text-slate-500">Alumnos registrados</div>
        </Link>
      </div>
    </div>
  )
}