import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import './styles/tailwind.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raiz do frontend não encontrado.')
}

createRoot(rootElement).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
