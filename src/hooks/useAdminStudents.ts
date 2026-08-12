import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Profile, StudentProgress, Enrollment } from '../types/database'

export interface StudentStats extends Profile {
  cursos_matriculados: number
  lecciones_completadas: number
  puntuacion_total: number
}

export function useAdminStudents() {
  return useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('rol', 'student')
        .order('fecha_registro', { ascending: false })
      if (profErr) throw profErr

      const { data: enrollments, error: enrErr } = await supabase.from('enrollments').select('student_id')
      if (enrErr) throw enrErr

      const { data: progress, error: progErr } = await supabase.from('student_progress').select('student_id, completed, score')
      if (progErr) throw progErr

      return (profiles as Profile[]).map((p): StudentStats => {
        const myEnrollments = (enrollments as Pick<Enrollment, 'student_id'>[]).filter((e) => e.student_id === p.id)
        const myProgress = (progress as Pick<StudentProgress, 'student_id' | 'completed' | 'score'>[]).filter(
          (pr) => pr.student_id === p.id
        )
        return {
          ...p,
          cursos_matriculados: myEnrollments.length,
          lecciones_completadas: myProgress.filter((pr) => pr.completed).length,
          puntuacion_total: myProgress.reduce((acc, pr) => acc + pr.score, 0),
        }
      })
    },
  })
}
