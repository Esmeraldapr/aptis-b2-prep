import { supabase } from './supabase'

export interface GradeResult {
  is_correct: boolean | null
  score: number
  completed: boolean
  // Solo presente cuando is_correct es false: el servidor revela la respuesta
  // correcta después de corregir, nunca antes.
  correct_answer?: string
}

export async function gradeExercise(exerciseId: string, answer: string): Promise<GradeResult> {
  const { data, error } = await supabase.functions.invoke<GradeResult>('grade-exercise', {
    body: { exercise_id: exerciseId, answer },
  })
  if (error) throw error
  if (!data) throw new Error('Respuesta vacía del corrector.')
  return data
}
