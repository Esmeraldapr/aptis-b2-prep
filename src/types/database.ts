// Tipos del esquema "ingles" en Supabase (proyecto Ingeniería Informática, pfzjubddiqdfpxqoulqy).
// Escritos a mano siguiendo la forma que espera @supabase/supabase-js para que
// el cliente tipado (createClient<Database, 'ingles'>) infiera correctamente
// selects, inserts y updates.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Role = 'student' | 'teacher' | 'admin'
export type CourseLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'listening' | 'writing'
export type EnrollmentStatus = 'active' | 'completed' | 'dropped'

export type Profile = Database['ingles']['Tables']['profiles']['Row']
export type Course = Database['ingles']['Tables']['courses']['Row']
export type Lesson = Database['ingles']['Tables']['lessons']['Row']
export type Exercise = Database['ingles']['Tables']['exercises']['Row']
export type StudentProgress = Database['ingles']['Tables']['student_progress']['Row']
export type Enrollment = Database['ingles']['Tables']['enrollments']['Row']
export type Submission = Database['ingles']['Tables']['submissions']['Row']

export interface Database {
  ingles: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nombre: string | null
          email: string | null
          rol: Role
          nivel_actual: CourseLevel
          fecha_registro: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          nombre?: string | null
          email?: string | null
          rol?: Role
          nivel_actual?: CourseLevel
          fecha_registro?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          nombre?: string | null
          email?: string | null
          rol?: Role
          nivel_actual?: CourseLevel
          fecha_registro?: string
          avatar_url?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          level: CourseLevel
          image_url: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          level: CourseLevel
          image_url?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          level?: CourseLevel
          image_url?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          order_index: number
          video_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          order_index?: number
          video_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          order_index?: number
          video_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          id: string
          lesson_id: string
          type: ExerciseType
          question: string
          options: Json | null
          correct_answer: string
          points: number
        }
        Insert: {
          id?: string
          lesson_id: string
          type: ExerciseType
          question: string
          options?: Json | null
          correct_answer: string
          points?: number
        }
        Update: {
          id?: string
          lesson_id?: string
          type?: ExerciseType
          question?: string
          options?: Json | null
          correct_answer?: string
          points?: number
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          status: EnrollmentStatus
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          status?: EnrollmentStatus
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          status?: EnrollmentStatus
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          lesson_id: string
          completed: boolean
          score: number
          completed_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          lesson_id: string
          completed?: boolean
          score?: number
          completed_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          lesson_id?: string
          completed?: boolean
          score?: number
          completed_at?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          id: string
          student_id: string
          exercise_id: string
          answer: string | null
          is_correct: boolean | null
          submitted_at: string
        }
        Insert: {
          id?: string
          student_id: string
          exercise_id: string
          answer?: string | null
          is_correct?: boolean | null
          submitted_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          exercise_id?: string
          answer?: string | null
          is_correct?: boolean | null
          submitted_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      get_exercise_answer: {
        Args: { p_exercise_id: string }
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
