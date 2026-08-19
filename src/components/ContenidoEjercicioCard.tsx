import { useState } from 'react'
import type { ContenidoEjercicio } from '../types/database'
import { checkContentAnswer } from '../lib/checkContentAnswer'
import { ListenButton } from './ListenButton'

const TYPE_LABEL: Record<ContenidoEjercicio['type'], string> = {
  multiple_choice: 'Opción múltiple',
  fill_blank: 'Completar el hueco',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
}

export function ContenidoEjercicioCard({ exercise, index }: { exercise: ContenidoEjercicio; index: number }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ is_correct: boolean | null; correct_answer: string | null } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [practiced, setPracticed] = useState(false)

  async function handleSubmit() {
    if (!answer.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await checkContentAnswer(exercise.id, answer)
      setResult(res)
    } catch {
      setError('No se pudo corregir el ejercicio. Comprueba tu conexión e inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const options = Array.isArray(exercise.options) ? (exercise.options as string[]) : null

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
          {index + 1}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {TYPE_LABEL[exercise.type]}
        </span>
        <span className="ml-auto text-xs text-slate-400">{exercise.points} pts</span>
      </div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="font-medium text-slate-800">{exercise.question}</p>
        <ListenButton text={exercise.question} label="Escuchar" size="sm" />
      </div>

      {exercise.imagen_url && (
        <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <img src={exercise.imagen_url} alt="" className="w-full object-cover" />
        </div>
      )}

      {exercise.type === 'speaking' ? (
        <button
          onClick={() => setPracticed(true)}
          disabled={practiced}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            practiced ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {practiced ? '¡Practicado! 🎉' : 'Marcar como practicado'}
        </button>
      ) : exercise.type === 'multiple_choice' && options ? (
        <fieldset className="flex flex-col gap-2" disabled={!!result}>
          <legend className="sr-only">Opciones</legend>
          {options.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                answer === opt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name={`ex-${exercise.id}`}
                value={opt}
                checked={answer === opt}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <span className="flex-1">{opt}</span>
            </label>
          ))}
        </fieldset>
      ) : exercise.type === 'writing' ? (
        <textarea
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!result}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
        />
      ) : (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!result}
          placeholder="Tu respuesta..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
        />
      )}

      {exercise.type !== 'speaking' && error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {exercise.type !== 'speaking' &&
        (!result ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !answer.trim()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Corrigiendo...' : 'Comprobar respuesta'}
          </button>
        ) : (
          <div
            className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${
              result.is_correct === null
                ? 'bg-slate-100 text-slate-600'
                : result.is_correct
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {result.is_correct === null
              ? 'Respuesta guardada. Este ejercicio se corrige de forma cualitativa, no hay una única respuesta correcta.'
              : result.is_correct
                ? '¡Correcto! 🎉'
                : `Incorrecto. La respuesta correcta es: "${result.correct_answer ?? '—'}"`}
          </div>
        ))}
    </div>
  )
}
