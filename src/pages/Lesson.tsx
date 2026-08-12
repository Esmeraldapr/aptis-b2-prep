import { useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useLesson, useExercises } from '../hooks/useLessons'
import { useCourse } from '../hooks/useCourses'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { ExerciseCard } from '../components/ExerciseCard'

export function Lesson() {
  const { lessonId } = useParams()
  const qc = useQueryClient()
  const { data: lesson, isLoading, error } = useLesson(lessonId)
  const { data: course } = useCourse(lesson?.course_id)
  const { data: exercises, isLoading: loadingExercises } = useExercises(lessonId)

  if (isLoading) return <LoadingSpinner />
  if (error || !lesson) return <ErrorMessage message="No se pudo cargar esta lección. Puede que necesites matricularte en el curso primero." />

  return (
    <div className="flex flex-col gap-8">
      {course && (
        <Link to={`/cursos/${course.id}`} className="w-fit text-sm text-indigo-600 hover:underline">
          ← Volver a {course.title}
        </Link>
      )}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
      </div>

      {lesson.video_url && (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black">
          <iframe
            src={lesson.video_url}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {lesson.content && (
        <article className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-6 whitespace-pre-line">
          {lesson.content}
        </article>
      )}

      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Ejercicios</h2>
        {loadingExercises && <LoadingSpinner />}
        {!loadingExercises && exercises?.length === 0 && (
          <p className="text-slate-500">Esta lección todavía no tiene ejercicios.</p>
        )}
        <div className="flex flex-col gap-4">
          {exercises?.map((ex, idx) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              index={idx}
              onGraded={() => {
                qc.invalidateQueries({ queryKey: ['progress'] })
                qc.invalidateQueries({ queryKey: ['my-progress'] })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
