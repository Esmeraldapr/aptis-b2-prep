import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCourse } from '../../hooks/useCourses'
import { useLessons } from '../../hooks/useLessons'
import { useCreateLesson, useDeleteLesson, useUpdateLesson } from '../../hooks/useAdminLessons'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'
import type { Lesson } from '../../types/database'

const emptyForm = { title: '', content: '', order_index: 0, video_url: '' }

export function AdminCourseLessons() {
  const { courseId } = useParams()
  const { data: course } = useCourse(courseId)
  const { data: lessons, isLoading, error } = useLessons(courseId)
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const deleteLesson = useDeleteLesson()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Lesson | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, order_index: (lessons?.length ?? 0) + 1 })
    setFormOpen(true)
  }

  function openEdit(lesson: Lesson) {
    setEditing(lesson)
    setForm({
      title: lesson.title,
      content: lesson.content ?? '',
      order_index: lesson.order_index,
      video_url: lesson.video_url ?? '',
    })
    setFormOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!courseId) return
    setFormError(null)
    try {
      if (editing) {
        await updateLesson.mutateAsync({ id: editing.id, ...form })
      } else {
        await createLesson.mutateAsync({ course_id: courseId, ...form })
      }
      setFormOpen(false)
    } catch {
      setFormError('No se pudo guardar la lección.')
    }
  }

  async function handleDelete(lesson: Lesson) {
    if (!window.confirm(`¿Eliminar la lección "${lesson.title}" y sus ejercicios?`)) return
    await deleteLesson.mutateAsync(lesson.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/admin/cursos" className="text-sm text-indigo-600 hover:underline">
          ← Volver a cursos
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Lecciones · {course?.title}</h1>
          <button
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Nueva lección
          </button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
          <h2 className="font-semibold text-slate-900">{editing ? 'Editar lección' : 'Nueva lección'}</h2>
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
            Contenido (texto de la lección)
            <textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Orden
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              URL de vídeo (embed, opcional)
              <input
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createLesson.isPending || updateLesson.isPending}
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
      {error && <ErrorMessage message="No se pudieron cargar las lecciones." />}

      <ol className="flex flex-col gap-2">
        {lessons?.map((lesson, idx) => (
          <li key={lesson.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                {idx + 1}
              </span>
              {lesson.title}
            </span>
            <div className="flex gap-3 text-sm">
              <Link to={`/admin/lecciones/${lesson.id}/ejercicios`} className="text-indigo-600 hover:underline">
                Ejercicios
              </Link>
              <button onClick={() => openEdit(lesson)} className="text-slate-600 hover:underline">
                Editar
              </button>
              <button onClick={() => handleDelete(lesson)} className="text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ol>
      {lessons?.length === 0 && <p className="text-slate-500">Este curso todavía no tiene lecciones.</p>}
    </div>
  )
}