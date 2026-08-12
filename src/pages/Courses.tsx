import { useState } from 'react'
import { useCourses } from '../hooks/useCourses'
import { CourseCard } from '../components/CourseCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import type { CourseLevel } from '../types/database'

const LEVELS: (CourseLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function Courses() {
  const [level, setLevel] = useState<CourseLevel | 'all'>('all')
  const [search, setSearch] = useState('')
  const { data: courses, isLoading, error } = useCourses({ level, search })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Catálogo de cursos</h1>
        <p className="text-slate-500">Filtra por nivel o busca por título.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por nivel">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              aria-pressed={level === lvl}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                level === lvl
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lvl === 'all' ? 'Todos' : lvl}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2">
          <span className="sr-only">Buscar cursos</span>
          <input
            type="search"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64"
          />
        </label>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="No se pudieron cargar los cursos." />}
      {!isLoading && !error && courses?.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          No hay cursos que coincidan con tu búsqueda.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  )
}
