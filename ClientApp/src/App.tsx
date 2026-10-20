import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import SistemaLayout from './layouts/SistemaLayout'
import LoginPage from './pages/LoginPage'
import InicioPage from './pages/sistema/InicioPage'
import CotacoesPage from './pages/sistema/CotacoesPage'
import FornecedoresPage from './pages/sistema/FornecedoresPage'
import PlanilhasPage from './pages/sistema/PlanilhasPage'
import KitsDrcPage from './pages/sistema/KitsDrcPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sistema" element={<ProtectedRoute />}>
        <Route element={<SistemaLayout />}>
          <Route index element={<InicioPage />} />
          <Route path="kits-drc" element={<KitsDrcPage />} />
          <Route path="cotacoes" element={<CotacoesPage />} />
          <Route path="fornecedores" element={<FornecedoresPage />} />
          <Route path="planilhas" element={<PlanilhasPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/sistema" replace />} />
    </Routes>
  )
}

export default App
