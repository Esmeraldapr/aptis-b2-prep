import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Categoria, Contenido, ContenidoEjercicio, ExerciseType } from '../types/database'

export interface ContenidoInput {
  categoria: Categoria
  titulo: string
  descripcion: string
  cuerpo: string
  imagen_url: string
  audio_url: string
  order_index: number
}

export function useCreateContenido() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ContenidoInput) => {
      const { data, error } = await supabase
        .from('contenidos')
        .insert({ ...input, created_by: user?.id })
        .select()
        .single()
      if (error) throw error
      return data as Contenido
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['contenidos', vars.categoria] }),
  })
}

export function useUpdateContenido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ContenidoInput> & { id: string }) => {
      const { error } = await supabase.from('contenidos').update(input).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contenidos'] })
      qc.invalidateQueries({ queryKey: ['contenido'] })
    },
  })
}

export function useDeleteContenido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contenidos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contenidos'] }),
  })
}

export interface ContenidoEjercicioInput {
  contenido_id: string
  type: ExerciseType
  question: string
  options: string[] | null
  correct_answer: string
  points: number
  order_index: number
}

export function useCreateContenidoEjercicio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ContenidoEjercicioInput) => {
      const { data, error } = await supabase
        .from('contenido_ejercicios')
        .insert(input)
        .select('id, contenido_id, type, question, options, points, order_index')
        .single()
      if (error) throw error
      return data as unknown as ContenidoEjercicio
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['contenido-ejercicios', vars.contenido_id] }),
  })
}

export function useUpdateContenidoEjercicio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ContenidoEjercicioInput> & { id: string }) => {
      const { error } = await supabase.from('contenido_ejercicios').update(input).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contenido-ejercicios'] }),
  })
}

export function useDeleteContenidoEjercicio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contenido_ejercicios').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contenido-ejercicios'] }),
  })
}

// La respuesta correcta está bloqueada por columna para el rol authenticated.
// Solo se puede recuperar mediante RPC (ver check_content_answer), que la
// revela siempre para no complicar el panel de admin con otra función.
export function useContenidoEjercicioAnswer(exerciseId: string | null) {
  return useQuery({
    queryKey: ['contenido-ejercicio-answer', exerciseId],
    enabled: !!exerciseId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('check_content_answer', {
        p_exercise_id: exerciseId!,
        p_answer: '',
      })
      if (error) throw error
      const row = Array.isArray(data) ? data[0] : data
      return row?.correct_answer as string | null
    },
  })
}
