import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Categoria, Contenido, ContenidoEjercicio } from '../types/database'

// Contenido público: sin login, sin matrícula. Cualquiera puede leer las
// pestañas (speaking, writing, grammar, listening, reading).
export function useContenidos(categoria: Categoria) {
  return useQuery({
    queryKey: ['contenidos', categoria],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contenidos')
        .select('*')
        .eq('categoria', categoria)
        .order('order_index', { ascending: true })
      if (error) throw error
      return data as Contenido[]
    },
  })
}

export function useContenido(id: string | undefined) {
  return useQuery({
    queryKey: ['contenido', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('contenidos').select('*').eq('id', id!).single()
      if (error) throw error
      return data as Contenido
    },
  })
}

export function useContenidoEjercicios(contenidoId: string | undefined) {
  return useQuery({
    queryKey: ['contenido-ejercicios', contenidoId],
    enabled: !!contenidoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contenido_ejercicios')
        .select('id, contenido_id, type, question, options, points, order_index, imagen_url')
        .eq('contenido_id', contenidoId!)
        .order('order_index', { ascending: true })
      if (error) throw error
      return data as ContenidoEjercicio[]
    },
  })
}
