import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Exercise, ExerciseType } from '../types/database'

export interface ExerciseInput {
  lesson_id: string
  type: ExerciseType
  question: string
  options: string[] | null
  correct_answer: string
  points: number
}

export function useCreateExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ExerciseInput) => {
      const { data, error } = await supabase.from('exercises').insert(input).select('id, lesson_id, type, question, options, points').single()
      if (error) throw error
      return data as unknown as Exercise
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['exercises', vars.lesson_id] }),
  })
}

export function useUpdateExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ExerciseInput> & { id: string }) => {
      const { error } = await supabase.from('exercises').update(input).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] }),
  })
}

export function useDeleteExercise() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('exercises').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] }),
  })
}

// La respuesta correcta está bloqueada por columna para el rol authenticated
// (ver migración protect_exercise_correct_answer). Solo se puede recuperar
// mediante esta función RPC, que comprueba que quien pregunta es profesor/admin.
export function useExerciseAnswer(exerciseId: string | null) {
  return useQuery({
    queryKey: ['exercise-answer', exerciseId],
    enabled: !!exerciseId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_exercise_answer', { p_exercise_id: exerciseId! })
      if (error) throw error
      return data as string
    },
  })
}
