import { Link } from 'react-router-dom'
import type { Course } from '../types/database'
import { LevelBadge } from './LevelBadge'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/cursos/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100">
        {course.image_url ? (
          <img src={course.image_url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">📘</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <LevelBadge level={course.level} />
        </div>
        <h3 className="font-semibold text-slate-900">{course.title}</h3>
        {course.description && <p className="line-clamp-2 text-sm text-slate-500">{course.description}</p>}
      </div>
    </Link>
  )
}
