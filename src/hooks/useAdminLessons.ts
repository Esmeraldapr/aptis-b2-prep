import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Lesson } from '../types/database'

export function useCreateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { course_id: string; title: string; content: string; order_index: number; video_url: string }) => {
      const { data, error } = await supabase.from('lessons').insert(input).select().single()
      if (error) throw error
      return data as Lesson
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['lessons', vars.course_id] }),
  })
}

export function useUpdateLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Lesson> & { id: string }) => {
      const { error } = await supabase.from('lessons').update(input).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons'] })
      qc.invalidateQueries({ queryKey: ['lesson'] })
    },
  })
}

export function useDeleteLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons'] }),
  })
}
