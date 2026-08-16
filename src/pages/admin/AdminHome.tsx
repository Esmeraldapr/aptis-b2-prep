import { Link } from 'react-router-dom'
import { useContenidos } from '../../hooks/useContenidos'
import { useAdminStudents } from '../../hooks/useAdminStudents'

const CATEGORIAS = [
  { categoria: 'speaking' as const, to: '/admin/contenidos/speaking', label: 'Speaking' },
  { categoria: 'writing' as const, to: '/admin/contenidos/writing', label: 'Writing' },
  { categoria: 'grammar' as const, to: '/admin/contenidos/grammar', label: 'Gramática' },
  { categoria: 'vocabulary' as const, to: '/admin/contenidos/vocabulary', label: 'Vocabulario' },
  { categoria: 'listening' as const, to: '/admin/contenidos/listening', label: 'Audios' },
  { categoria: 'reading' as const, to: '/admin/contenidos/reading', label: 'Lecturas' },
]

function CategoriaCard({ categoria, to, label }: { categoria: (typeof CATEGORIAS)[number]['categoria']; to: string; label: string }) {
  const { data } = useContenidos(categoria)
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-sm">
      <div className="text-3xl font-bold text-indigo-700">{data?.length ?? 0}</div>
      <div className="text-slate-500">{label}</div>
    </Link>
  )
}

export function AdminHome() {
  const { data: students } = useAdminStudents()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIAS.map((c) => (
          <CategoriaCard key={c.categoria} {...c} />
        ))}
        <Link to="/admin/alumnos" className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-sm">
          <div className="text-3xl font-bold text-indigo-700">{students?.length ?? 0}</div>
          <div className="text-slate-500">Cuentas registradas</div>
        </Link>
      </div>
    </div>
  )
}
