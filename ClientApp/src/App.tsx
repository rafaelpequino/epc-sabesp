import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import SistemaLayout from './layouts/SistemaLayout'
import LoginPage from './pages/LoginPage'
import InicioPage from './pages/sistema/InicioPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sistema" element={<ProtectedRoute />}>
        <Route element={<SistemaLayout />}>
          <Route index element={<InicioPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/sistema" replace />} />
    </Routes>
  )
}

export default App
