import { supabase } from './supabase'

export interface CheckAnswerResult {
  is_correct: boolean | null
  correct_answer: string | null
}

// Corrección pública vía RPC: no requiere login. La función en Postgres
// (security definer) es la única que puede leer correct_answer.
export async function checkContentAnswer(exerciseId: string, answer: string): Promise<CheckAnswerResult> {
  const { data, error } = await supabase.rpc('check_content_answer', {
    p_exercise_id: exerciseId,
    p_answer: answer,
  })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  if (!row) throw new Error('Respuesta vacía del corrector.')
  return row as CheckAnswerResult
}
