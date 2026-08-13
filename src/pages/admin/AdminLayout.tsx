import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`

const CATEGORIAS = [
  { to: '/admin/contenidos/speaking', label: 'Speaking' },
  { to: '/admin/contenidos/writing', label: 'Writing' },
  { to: '/admin/contenidos/grammar', label: 'Gramática' },
  { to: '/admin/contenidos/listening', label: 'Audios' },
  { to: '/admin/contenidos/reading', label: 'Lecturas' },
]

export function AdminLayout() {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <nav className="flex shrink-0 gap-2 overflow-x-auto md:w-48 md:flex-col" aria-label="Navegación de administración">
        <NavLink to="/admin" end className={linkClass}>
          Resumen
        </NavLink>
        {CATEGORIAS.map((c) => (
          <NavLink key={c.to} to={c.to} className={linkClass}>
            {c.label}
          </NavLink>
        ))}
        <NavLink to="/admin/alumnos" className={linkClass}>
          Alumnos
        </NavLink>
      </nav>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
