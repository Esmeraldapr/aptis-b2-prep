import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Course, CourseLevel } from '../types/database'

export function useCreateCourse() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { title: string; description: string; level: CourseLevel; image_url: string }) => {
      const { data, error } = await supabase
        .from('courses')
        .insert({ ...input, created_by: user?.id })
        .select()
        .single()
      if (error) throw error
      return data as Course
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Course> & { id: string }) => {
      const { error } = await supabase.from('courses').update(input).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] })
      qc.invalidateQueries({ queryKey: ['course'] })
    },
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}
