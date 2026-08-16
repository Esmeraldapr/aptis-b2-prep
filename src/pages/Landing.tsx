import { Link } from 'react-router-dom'

const TABS = [
  { to: '/speaking', emoji: '🗣️', label: 'Speaking', desc: 'Preguntas y respuestas modelo por partes' },
  { to: '/writing', emoji: '✍️', label: 'Writing', desc: 'Modelos, correcciones y práctica guiada' },
  { to: '/gramatica', emoji: '📚', label: 'Gramática', desc: 'Explicaciones y ejercicios autocorregidos' },
  { to: '/vocabulario', emoji: '🧠', label: 'Vocabulario', desc: 'Palabras, collocations y phrasal verbs traducidos' },
  { to: '/audios', emoji: '🎧', label: 'Audios', desc: 'Listening y pronunciación' },
  { to: '/lecturas', emoji: '📖', label: 'Lecturas', desc: 'Textos para practicar comprensión lectora' },
]

export function Landing() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-5 py-8 text-center">
        <span className="w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Preparación de inglés · Aptis
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Practica inglés directamente, sin registrarte
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Entra en cualquier pestaña y practica al momento: Speaking, Writing, Gramática, Vocabulario, Audios y
          Lecturas, con ejercicios que se corrigen solos.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-3xl">{t.emoji}</div>
            <h2 className="text-lg font-semibold text-slate-900">{t.label}</h2>
            <p className="text-sm text-slate-500">{t.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
