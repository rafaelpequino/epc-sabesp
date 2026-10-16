import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'

function App() {
  const isLoginRoute = window.location.pathname === '/login'

  useEffect(() => {
    if (!isLoginRoute) {
      window.location.replace('/login')
    }
  }, [isLoginRoute])

  return isLoginRoute ? <LoginPage /> : null
}

export default App
