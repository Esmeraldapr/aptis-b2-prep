import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
  }`

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const isStaff = profile?.rol === 'teacher' || profile?.rol === 'admin'

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-indigo-700">
          <span className="text-xl">🎓</span> Aptis B2 Prep
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/cursos" className={linkClass}>
            Cursos
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Mi panel
            </NavLink>
          )}
          {user && (
            <NavLink to="/progreso" className={linkClass}>
              Progreso
            </NavLink>
          )}
          {isStaff && (
            <NavLink to="/admin" className={linkClass}>
              Administración
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/perfil" className={linkClass}>
                {profile?.nombre ?? 'Perfil'}
              </NavLink>
              <button
                onClick={async () => {
                  await signOut()
                  navigate('/')
                }}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Entrar
              </Link>
              <Link
                to="/registro"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
