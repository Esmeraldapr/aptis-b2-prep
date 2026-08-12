import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Course, CourseLevel } from '../types/database'

export function useCourses(filters?: { level?: CourseLevel | 'all'; search?: string }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      let query = supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (filters?.level && filters.level !== 'all') query = query.eq('level', filters.level)
      if (filters?.search) query = query.ilike('title', `%${filters.search}%`)
      const { data, error } = await query
      if (error) throw error
      return data as Course[]
    },
  })
}

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ['course', courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').eq('id', courseId!).single()
      if (error) throw error
      return data as Course
    },
  })
}
