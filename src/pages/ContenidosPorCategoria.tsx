import { Link } from 'react-router-dom'
import { useContenidos } from '../hooks/useContenidos'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import type { Categoria } from '../types/database'

export function ContenidosPorCategoria({
  categoria,
  titulo,
  descripcion,
}: {
  categoria: Categoria
  titulo: string
  descripcion: string
}) {
  const { data: contenidos, isLoading, error } = useContenidos(categoria)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
        <p className="text-slate-500">{descripcion}</p>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="No se pudo cargar el contenido." />}
      {!isLoading && !error && contenidos?.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Todavía no hay contenido publicado aquí. ¡Vuelve pronto!
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {contenidos?.map((c) => (
          <Link
            key={c.id}
            to={`/contenido/${c.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {c.imagen_url && (
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={c.imagen_url}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="font-semibold text-slate-900">{c.titulo}</h3>
              {c.descripcion && <p className="line-clamp-2 text-sm text-slate-500">{c.descripcion}</p>}
              {c.audio_url && <span className="w-fit rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">🎧 Con audio</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
