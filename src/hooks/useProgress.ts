import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { StudentProgress } from '../types/database'

export function useProgressForCourse(courseId: string | undefined, lessonIds: string[]) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['progress', courseId, user?.id, lessonIds],
    enabled: !!user && lessonIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user!.id)
        .in('lesson_id', lessonIds)
      if (error) throw error
      return data as StudentProgress[]
    },
  })
}

export function useMyProgress() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['my-progress', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*, lessons:lesson_id(id, title, course_id)')
        .eq('student_id', user!.id)
        .order('completed_at', { ascending: false })
      if (error) throw error
      return data as (StudentProgress & { lessons: { id: string; title: string; course_id: string } })[]
    },
  })
}
