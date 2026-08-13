import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContenidos } from '../../hooks/useContenidos'
import { useCreateContenido, useDeleteContenido, useUpdateContenido } from '../../hooks/useAdminContenidos'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'
import type { Categoria, Contenido } from '../../types/database'

const LABELS: Record<Categoria, string> = {
  speaking: 'Speaking',
  writing: 'Writing',
  grammar: 'Gramática',
  listening: 'Audios',
  reading: 'Lecturas',
}

const emptyForm = { titulo: '', descripcion: '', cuerpo: '', imagen_url: '', audio_url: '', order_index: 0 }

export function AdminContenidos() {
  const { categoria } = useParams<{ categoria: Categoria }>()
  const cat = (categoria ?? 'speaking') as Categoria
  const { data: contenidos, isLoading, error } = useContenidos(cat)
  const createContenido = useCreateContenido()
  const updateContenido = useUpdateContenido()
  const deleteContenido = useDeleteContenido()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Contenido | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, order_index: (contenidos?.length ?? 0) + 1 })
    setFormOpen(true)
  }

  function openEdit(c: Contenido) {
    setEditing(c)
    setForm({
      titulo: c.titulo,
      descripcion: c.descripcion ?? '',
      cuerpo: c.cuerpo ?? '',
      imagen_url: c.imagen_url ?? '',
      audio_url: c.audio_url ?? '',
      order_index: c.order_index,
    })
    setFormOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editing) {
        await updateContenido.mutateAsync({ id: editing.id, ...form })
      } else {
        await createContenido.mutateAsync({ categoria: cat, ...form })
      }
      setFormOpen(false)
    } catch {
      setFormError('No se pudo guardar el contenido.')
    }
  }

  async function handleDelete(c: Contenido) {
    if (!window.confirm(`¿Eliminar "${c.titulo}" y sus ejercicios?`)) return
    await deleteContenido.mutateAsync(c.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{LABELS[cat]}</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Nuevo contenido
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
          <h2 className="font-semibold text-slate-900">{editing ? 'Editar contenido' : 'Nuevo contenido'}</h2>
          {formError && <ErrorMessage message={formError} />}
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Título
            <input
              required
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Descripción corta (se ve en la tarjeta del listado)
            <input
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Contenido / texto principal
            <textarea
              rows={8}
              value={form.cuerpo}
              onChange={(e) => setForm((f) => ({ ...f, cuerpo: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              URL de imagen (opcional)
              <input
                value={form.imagen_url}
                onChange={(e) => setForm((f) => ({ ...f, imagen_url: e.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              URL de audio (opcional)
              <input
                value={form.audio_url}
                onChange={(e) => setForm((f) => ({ ...f, audio_url: e.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Orden
            <input
              type="number"
              value={form.order_index}
              onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
              className="w-32 rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createContenido.isPending || updateContenido.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="No se pudo cargar el contenido." />}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contenidos?.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{c.titulo}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/admin/contenidos/${cat}/${c.id}/ejercicios`} className="text-indigo-600 hover:underline">
                      Ejercicios
                    </Link>
                    <button onClick={() => openEdit(c)} className="text-slate-600 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(c)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contenidos?.length === 0 && <p className="p-6 text-center text-slate-500">Todavía no hay nada aquí.</p>}
      </div>
    </div>
  )
}
