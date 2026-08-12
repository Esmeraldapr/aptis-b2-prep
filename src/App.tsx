import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Courses } from './pages/Courses'
import { CourseDetail } from './pages/CourseDetail'
import { Lesson } from './pages/Lesson'
import { Dashboard } from './pages/Dashboard'
import { Progress } from './pages/Progress'
import { Profile } from './pages/Profile'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminHome } from './pages/admin/AdminHome'
import { AdminCourses } from './pages/admin/AdminCourses'
import { AdminCourseLessons } from './pages/admin/AdminCourseLessons'
import { AdminLessonExercises } from './pages/admin/AdminLessonExercises'
import { AdminStudents } from './pages/admin/AdminStudents'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="recuperar" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="cursos" element={<Courses />} />
        <Route path="cursos/:courseId" element={<CourseDetail />} />
        <Route
          path="lecciones/:lessonId"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="progreso"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute staffOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="cursos" element={<AdminCourses />} />
          <Route path="cursos/:courseId/lecciones" element={<AdminCourseLessons />} />
          <Route path="lecciones/:lessonId/ejercicios" element={<AdminLessonExercises />} />
          <Route path="alumnos" element={<AdminStudents />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="text-slate-500">Página no encontrada.</p>
    </div>
  )
}
