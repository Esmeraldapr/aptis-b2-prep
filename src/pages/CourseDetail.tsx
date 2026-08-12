import { useParams, Link } from 'react-router-dom'
import { useCourse } from '../hooks/useCourses'
import { useLessons } from '../hooks/useLessons'
import { useIsEnrolled, useEnrollMutation } from '../hooks/useEnrollment'
import { useProgressForCourse } from '../hooks/useProgress'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { LevelBadge } from '../components/LevelBadge'
import { useAuth } from '../context/AuthContext'

export function CourseDetail() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const { data: course, isLoading, error } = useCourse(courseId)
  const { data: lessons, isLoading: loadingLessons } = useLessons(courseId)
  const { data: enrollment } = useIsEnrolled(courseId)
  const { data: progress } = useProgressForCourse(courseId, lessons?.map((l) => l.id) ?? [])
  const enroll = useEnrollMutation()

  if (isLoading) return <LoadingSpinner />
  if (error || !course) return <ErrorMessage message="No se pudo cargar este curso." />

  const completedIds = new Set(progress?.filter((p) => p.completed).map((p) => p.lesson_id))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2">
            <LevelBadge level={course.level} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          {course.description && <p className="mt-2 max-w-2xl text-slate-600">{course.description}</p>}
        </div>
        {user ? (
          enrollment ? (
            <span className="whitespace-nowrap rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              ✓ Ya estás matriculado
            </span>
          ) : (
            <button
              onClick={() => enroll.mutate(course.id)}
              disabled={enroll.isPending}
              className="whitespace-nowrap rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {enroll.isPending ? 'Matriculando...' : 'Matricularme'}
            </button>
          )
        ) : (
          <Link to="/login" state={{ from: `/cursos/${course.id}` }} className="whitespace-nowrap rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
            Inicia sesión para matricularte
          </Link>
        )}
      </div>
      {enroll.isError && <ErrorMessage message="No se pudo completar la matrícula. Inténtalo de nuevo." />}

      <div>
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Lecciones</h2>
        {loadingLessons && <LoadingSpinner />}
        {!loadingLessons && lessons?.length === 0 && <p className="text-slate-500">Este curso aún no tiene lecciones.</p>}
        <ol className="flex flex-col gap-2">
          {lessons?.map((lesson, idx) => {
            const done = completedIds.has(lesson.id)
            const locked = user && !enrollment
            return (
              <li key={lesson.id}>
                {locked ? (
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 opacity-60">
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                        {idx + 1}
                      </span>
                      {lesson.title}
                    </span>
                    <span className="text-xs text-slate-400">Matricúlate para acceder</span>
                  </div>
                ) : (
                  <Link
                    to={`/lecciones/${lesson.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                          done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {done ? '✓' : idx + 1}
                      </span>
                      {lesson.title}
                    </span>
                    <span className="text-sm text-indigo-600">Ver lección →</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
