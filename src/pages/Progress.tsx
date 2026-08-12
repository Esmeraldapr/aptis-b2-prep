import { useMyProgress } from '../hooks/useProgress'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function Progress() {
  const { data, isLoading, error } = useMyProgress()

  const totalLessons = data?.length ?? 0
  const completed = data?.filter((p) => p.completed).length ?? 0
  const totalScore = data?.reduce((acc, p) => acc + p.score, 0) ?? 0
  const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-slate-900">Tu progreso</h1>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="No se pudo cargar tu progreso." />}

      {!isLoading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Lecciones iniciadas" value={totalLessons} />
            <StatCard label="Lecciones completadas" value={completed} />
            <StatCard label="Puntos totales" value={totalScore} />
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm text-slate-500">
              <span>Progreso general</span>
              <span>{pct}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">Historial de lecciones</h2>
            {data?.length === 0 ? (
              <p className="text-slate-500">Todavía no has empezado ninguna lección.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {data?.map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="font-medium text-slate-700">{p.lessons?.title ?? 'Lección'}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-slate-500">{p.score} pts</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {p.completed ? 'Completada' : 'En curso'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
      <div className="text-3xl font-bold text-indigo-700">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  )
}
