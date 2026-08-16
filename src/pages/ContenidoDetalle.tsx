import { useParams, Link } from 'react-router-dom'
import { useContenido, useContenidoEjercicios } from '../hooks/useContenidos'
import { ContenidoEjercicioCard } from '../components/ContenidoEjercicioCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { ListenButton } from '../components/ListenButton'

const CATEGORIA_PATH: Record<string, string> = {
  speaking: '/speaking',
  writing: '/writing',
  grammar: '/gramatica',
  vocabulary: '/vocabulario',
  listening: '/audios',
  reading: '/lecturas',
}

const CATEGORIA_LABEL: Record<string, string> = {
  speaking: 'Speaking',
  writing: 'Writing',
  grammar: 'Gramática',
  vocabulary: 'Vocabulario',
  listening: 'Audios',
  reading: 'Lecturas',
}

export function ContenidoDetalle() {
  const { contenidoId } = useParams()
  const { data: contenido, isLoading, error } = useContenido(contenidoId)
  const { data: ejercicios, isLoading: loadingEj } = useContenidoEjercicios(contenidoId)

  if (isLoading) return <LoadingSpinner />
  if (error || !contenido) return <ErrorMessage message="No se pudo cargar este contenido." />

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={CATEGORIA_PATH[contenido.categoria] ?? '/'}
        className="w-fit text-sm text-indigo-600 hover:underline"
      >
        ← Volver a {CATEGORIA_LABEL[contenido.categoria] ?? 'inicio'}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{contenido.titulo}</h1>
          {contenido.cuerpo && <ListenButton text={contenido.cuerpo} label="Escuchar todo" />}
        </div>
        {contenido.descripcion && <p className="mt-2 max-w-2xl text-slate-600">{contenido.descripcion}</p>}
      </div>

      {contenido.imagen_url && (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <img src={contenido.imagen_url} alt="" className="w-full object-cover" />
        </div>
      )}

      {contenido.audio_url && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <audio controls className="w-full" src={contenido.audio_url}>
            Tu navegador no soporta audio.
          </audio>
        </div>
      )}

      {contenido.cuerpo && (
        <article className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-6 whitespace-pre-line">
          {contenido.cuerpo}
        </article>
      )}

      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Ejercicios</h2>
        {loadingEj && <LoadingSpinner />}
        {!loadingEj && ejercicios?.length === 0 && <p className="text-slate-500">Todavía no hay ejercicios aquí.</p>}
        <div className="flex flex-col gap-4">
          {ejercicios?.map((e, i) => (
            <ContenidoEjercicioCard key={e.id} exercise={e} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
