import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCourses } from '../../hooks/useCourses'
import { useCreateCourse, useDeleteCourse, useUpdateCourse } from '../../hooks/useAdminCourses'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'
import { LevelBadge } from '../../components/LevelBadge'
import type { Course, CourseLevel } from '../../types/database'

const LEVELS: CourseLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const emptyForm = { title: '', description: '', level: 'B2' as CourseLevel, image_url: '' }

export function AdminCourses() {
  const { data: courses, isLoading, error } = useCourses()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const deleteCourse = useDeleteCourse()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(course: Course) {
    setEditing(course)
    setForm({
      title: course.title,
      description: course.description ?? '',
      level: course.level,
      image_url: course.image_url ?? '',
    })
    setFormOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editing) {
        await updateCourse.mutateAsync({ id: editing.id, ...form })
      } else {
        await createCourse.mutateAsync(form)
      }
      setFormOpen(false)
    } catch {
      setFormError('No se pudo guardar el curso.')
    }
  }

  async function handleDelete(course: Course) {
    if (!window.confirm(`¿Eliminar el curso "${course.title}"? Se borrarán también sus lecciones y ejercicios.`)) return
    await deleteCourse.mutateAsync(course.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Cursos</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Nuevo curso
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
          <h2 className="font-semibold text-slate-900">{editing ? 'Editar curso' : 'Nuevo curso'}</h2>
          {formError && <ErrorMessage message={formError} />}
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Título
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Descripción
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Nivel
              <select
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as CourseLevel }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              URL de imagen (opcional)
              <input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createCourse.isPending || updateCourse.isPending}
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
      {error && <ErrorMessage message="No se pudieron cargar los cursos." />}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses?.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                <td className="px-4 py-3">
                  <LevelBadge level={c.level} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/admin/cursos/${c.id}/lecciones`} className="text-indigo-600 hover:underline">
                      Lecciones
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
        {courses?.length === 0 && <p className="p-6 text-center text-slate-500">No hay cursos todavía.</p>}
      </div>
    </div>
  )
}