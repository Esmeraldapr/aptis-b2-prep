import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ErrorMessage } from '../components/ErrorMessage'
import { LevelBadge } from '../components/LevelBadge'
import { PasswordInput } from '../components/PasswordInput'

export function Profile() {
  const { profile, user, refreshProfile } = useAuth()
  const [nombre, setNombre] = useState(profile?.nombre ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaved, setPwSaved] = useState(false)

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    const { error } = await supabase.from('profiles').update({ nombre }).eq('id', user!.id)
    setSaving(false)
    if (error) {
      setError('No se pudo guardar el cambio.')
      return
    }
    await refreshProfile()
    setSaved(true)
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPwError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setPwSaving(true)
    setPwError(null)
    setPwSaved(false)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwSaving(false)
    if (error) {
      setPwError(error.message)
      return
    }
    setNewPassword('')
    setPwSaved(true)
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="text-slate-500">{user?.email}</p>
        {profile && (
          <p className="mt-2">
            Nivel actual: <LevelBadge level={profile.nivel_actual} /> · Rol: {profile.rol}
          </p>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Datos personales</h2>
        {error && <ErrorMessage message={error} />}
        {saved && <p className="text-sm text-emerald-600">Guardado ✓</p>}
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="flex flex-col gap-4 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Cambiar contraseña</h2>
        {pwError && <ErrorMessage message={pwError} />}
        {pwSaved && <p className="text-sm text-emerald-600">Contraseña actualizada ✓</p>}
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nueva contraseña
          <PasswordInput
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={pwSaving}
          className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pwSaving ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  )
}
