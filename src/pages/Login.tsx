import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'
import { PasswordInput } from '../components/PasswordInput'

const REMEMBER_KEY = 'aptis-b2-prep:remembered-email'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) ?? '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => localStorage.getItem(REMEMBER_KEY) !== null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, email)
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }
    const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Inicia sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <ErrorMessage message={error} />}
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Correo electrónico
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Contraseña
          <PasswordInput
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-1 focus:ring-indigo-500"
          />
          Recuérdame
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/recuperar" className="text-indigo-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link to="/registro" className="text-indigo-600 hover:underline">
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}
