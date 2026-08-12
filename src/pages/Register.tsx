import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'
import { PasswordInput } from '../components/PasswordInput'

export function Register() {
  const { signUp } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, nombre)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h1 className="text-xl font-bold text-emerald-800">¡Revisa tu correo!</h1>
        <p className="mt-2 text-sm text-emerald-700">
          Te hemos enviado un enlace de confirmación a <strong>{email}</strong>. Cónfirmalo para poder iniciar sesión.
        </p>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-emerald-800 underline">
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <ErrorMessage message={error} />}
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nombre
          <input
            type="text"
            required
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
      <p className="mt-6 text-center text-xs text-slate-400">
        (También puedes habilitar el inicio de sesión con Google en el panel de Supabase → Authentication → Providers)
      </p>
    </div>
  )
}
