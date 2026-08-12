import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoadingSpinner } from './components/LoadingSpinner'

// Cada página se carga en su propio "chunk" (dynamic import) para que el
// build final quede repartido en varios archivos JS pequeños en vez de un
// único bundle enorme.
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((m) => ({ default: m.ResetPassword })))
const Courses = lazy(() => import('./pages/Courses').then((m) => ({ default: m.Courses })))
const CourseDetail = lazy(() => import('./pages/CourseDetail').then((m) => ({ default: m.CourseDetail })))
const Lesson = lazy(() => import('./pages/Lesson').then((m) => ({ default: m.Lesson })))
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Progress = lazy(() => import('./pages/Progress').then((m) => ({ default: m.Progress })))
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminHome = lazy(() => import('./pages/admin/AdminHome').then((m) => ({ default: m.AdminHome })))
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses').then((m) => ({ default: m.AdminCourses })))
const AdminCourseLessons = lazy(() =>
  import('./pages/admin/AdminCourseLessons').then((m) => ({ default: m.AdminCourseLessons }))
)
const AdminLessonExercises = lazy(() =>
  import('./pages/admin/AdminLessonExercises').then((m) => ({ default: m.AdminLessonExercises }))
)
const AdminStudents = lazy(() => import('./pages/admin/AdminStudents').then((m) => ({ default: m.AdminStudents })))

function PageFallback() {
  return (
    <div className="flex justify-center py-20">
      <LoadingSpinner />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
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
