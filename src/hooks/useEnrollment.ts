import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Enrollment } from '../types/database'

export function useMyEnrollments() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['enrollments', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('enrollments').select('*, courses:course_id(*)').eq('student_id', user!.id)
      if (error) throw error
      return data as (Enrollment & { courses: import('../types/database').Course })[]
    },
  })
}

export function useIsEnrolled(courseId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['enrollment', courseId, user?.id],
    enabled: !!courseId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId!)
        .eq('student_id', user!.id)
        .maybeSingle()
      if (error) throw error
      return data as Enrollment | null
    },
  })
}

export function useEnrollMutation() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('Debes iniciar sesión para matricularte.')
      const { error } = await supabase.from('enrollments').insert({ student_id: user.id, course_id: courseId, status: 'active' })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments'] })
      qc.invalidateQueries({ queryKey: ['enrollment'] })
    },
  })
}
