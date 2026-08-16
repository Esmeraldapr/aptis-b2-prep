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
const ContenidosPorCategoria = lazy(() =>
  import('./pages/ContenidosPorCategoria').then((m) => ({ default: m.ContenidosPorCategoria }))
)
const ContenidoDetalle = lazy(() =>
  import('./pages/ContenidoDetalle').then((m) => ({ default: m.ContenidoDetalle }))
)
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminHome = lazy(() => import('./pages/admin/AdminHome').then((m) => ({ default: m.AdminHome })))
const AdminContenidos = lazy(() =>
  import('./pages/admin/AdminContenidos').then((m) => ({ default: m.AdminContenidos }))
)
const AdminContenidoEjercicios = lazy(() =>
  import('./pages/admin/AdminContenidoEjercicios').then((m) => ({ default: m.AdminContenidoEjercicios }))
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

          {/* Pestañas públicas: acceso directo, sin login ni matrícula */}
          <Route
            path="speaking"
            element={<ContenidosPorCategoria categoria="speaking" titulo="Speaking" descripcion="Preguntas y respuestas modelo por partes del examen." />}
          />
          <Route
            path="writing"
            element={<ContenidosPorCategoria categoria="writing" titulo="Writing" descripcion="Modelos, correcciones y práctica guiada de redacción." />}
          />
          <Route
            path="gramatica"
            element={<ContenidosPorCategoria categoria="grammar" titulo="Gramática" descripcion="Explicaciones y ejercicios de gramática con corrección automática." />}
          />
          <Route
            path="audios"
            element={<ContenidosPorCategoria categoria="listening" titulo="Audios" descripcion="Listening y pronunciación." />}
          />
          <Route
            path="lecturas"
            element={<ContenidosPorCategoria categoria="reading" titulo="Lecturas" descripcion="Textos para practicar comprensión lectora." />}
          />
          <Route
            path="vocabulario"
            element={<ContenidosPorCategoria categoria="vocabulary" titulo="Vocabulario" descripcion="Vocabulario, collocations, phrasal verbs y falsos amigos, todo traducido y con ejemplos." />}
          />
          <Route path="contenido/:contenidoId" element={<ContenidoDetalle />} />

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
            <Route path="contenidos/:categoria" element={<AdminContenidos />} />
            <Route path="contenidos/:categoria/:contenidoId/ejercicios" element={<AdminContenidoEjercicios />} />
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
