import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLesson, useExercises } from '../../hooks/useLessons'
import {
  useCreateExercise,
  useDeleteExercise,
  useUpdateExercise,
  useExerciseAnswer,
  type ExerciseInput,
} from '../../hooks/useAdminExercises'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'
import type { Exercise, ExerciseType } from '../../types/database'

const TYPES: ExerciseType[] = ['multiple_choice', 'fill_blank', 'listening', 'writing']
const TYPE_LABEL: Record<ExerciseType, string> = {
  multiple_choice: 'Opción múltiple',
  fill_blank: 'Completar hueco',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
}

const emptyForm = { type: 'multiple_choice' as ExerciseType, question: '', optionsText: '', correct_answer: '', points: 10 }

export function AdminLessonExercises() {
  const { lessonId } = useParams()
  const { data: lesson } = useLesson(lessonId)
  const { data: exercises, isLoading, error } = useExercises(lessonId)
  const createExercise = useCreateExercise()
  const updateExercise = useUpdateExercise()
  const deleteExercise = useDeleteExercise()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [revealFor, setRevealFor] = useState<string | null>(null)
  const { data: revealedAnswer } = useExerciseAnswer(revealFor)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(ex: Exercise) {
    setEditing(ex)
    setForm({
      type: ex.type,
      question: ex.question,
      optionsText: Array.isArray(ex.options) ? ex.options.join(', ') : '',
      correct_answer: '',
      points: ex.points,
    })
    setFormOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!lessonId) return
    setFormError(null)
    const options = form.type === 'multiple_choice' && form.optionsText.trim()
      ? form.optionsText.split(',').map((o) => o.trim()).filter(Boolean)
      : null

    if (editing && !form.correct_answer.trim()) {
      setFormError('Introduce la respuesta correcta para guardar los cambios (por seguridad no se muestra la anterior).')
      return
    }

    const input: ExerciseInput = {
      lesson_id: lessonId,
      type: form.type,
      question: form.question,
      options,
      correct_answer: form.correct_answer,
      points: form.points,
    }

    try {
      if (editing) {
        await updateExercise.mutateAsync({ id: editing.id, ...input })
      } else {
        await createExercise.mutateAsync(input)
      }
      setFormOpen(false)
    } catch {
      setFormError('No se pudo guardar el ejercicio.')
    }
  }

  async function handleDelete(ex: Exercise) {
    if (!window.confirm('¿Eliminar este ejercicio?')) return
    await deleteExercise.mutateAsync(ex.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        {lesson && (
          <Link to={`/admin/cursos/${lesson.course_id}/lecciones`} className="text-sm text-indigo-600 hover:underline">
            ← Volver a lecciones
          </Link>
        )}
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Ejercicios · {lesson?.title}</h1>
          <button
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Nuevo ejercicio
          </button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
          <h2 className="font-semibold text-slate-900">{editing ? 'Editar ejercicio' : 'Nuevo ejercicio'}</h2>
          {formError && <ErrorMessage message={formError} />}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Tipo
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ExerciseType }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Puntos
              <input
                type="number"
                value={form.points}
                onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))}
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Pregunta / enunciado
            <textarea
              required
              rows={2}
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          {form.type === 'multiple_choice' && (
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Opciones (separadas por coma)
              <input
                value={form.optionsText}
                onChange={(e) => setForm((f) => ({ ...f, optionsText: e.target.value }))}
                placeholder="go, goes, going, went"
                className="rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Respuesta correcta {editing && <span className="font-normal text-slate-400">(vuelve a escribirla para guardar cambios)</span>}
            <input
              required
              value={form.correct_answer}
              onChange={(e) => setForm((f) => ({ ...f, correct_answer: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createExercise.isPending || updateExercise.isPending}
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
      {error && <ErrorMessage message="No se pudieron cargar los ejercicios." />}

      <ul className="flex flex-col gap-3">
        {exercises?.map((ex, idx) => (
          <li key={ex.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-slate-400">
                  #{idx + 1} · {TYPE_LABEL[ex.type]} · {ex.points} pts
                </span>
                <p className="mt-1 font-medium text-slate-800">{ex.question}</p>
                {revealFor === ex.id && (
                  <p className="mt-1 text-sm text-emerald-700">Respuesta correcta: {revealedAnswer ?? 'cargando...'}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1 text-sm text-right">
                <button onClick={() => setRevealFor(ex.id)} className="text-slate-600 hover:underline">
                  Ver respuesta
                </button>
                <button onClick={() => openEdit(ex)} className="text-slate-600 hover:underline">
                  Editar
                </button>
                <button onClick={() => handleDelete(ex)} className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {exercises?.length === 0 && <p className="text-slate-500">Esta lección todavía no tiene ejercicios.</p>}
    </div>
  )
}