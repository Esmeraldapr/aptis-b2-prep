import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

export function ProtectedRoute({ children, staffOnly = false }: { children: ReactNode; staffOnly?: boolean }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingSpinner label="Comprobando sesión..." />
  if (!user) return <Navigate to="/login" replace />
  if (staffOnly && profile && profile.rol !== 'teacher' && profile.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}
