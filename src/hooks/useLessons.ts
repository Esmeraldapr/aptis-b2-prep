import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Lesson, Exercise } from '../types/database'

export function useLessons(courseId: string | undefined) {
  return useQuery({
    queryKey: ['lessons', courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId!)
        .order('order_index', { ascending: true })
      if (error) throw error
      return data as Lesson[]
    },
  })
}

export function useLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').eq('id', lessonId!).single()
      if (error) throw error
      return data as Lesson
    },
  })
}

// Nunca seleccionamos correct_answer aquí: la API lo bloquea a nivel de columna
// (ver migración protect_exercise_correct_answer) y solo el edge function
// grade-exercise puede revelarla, tras corregir en el servidor.
const PUBLIC_EXERCISE_FIELDS = 'id, lesson_id, type, question, options, points'

export function useExercises(lessonId: string | undefined) {
  return useQuery({
    queryKey: ['exercises', lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase.from('exercises').select(PUBLIC_EXERCISE_FIELDS).eq('lesson_id', lessonId!)
      if (error) throw error
      return data as unknown as Exercise[]
    },
  })
}
