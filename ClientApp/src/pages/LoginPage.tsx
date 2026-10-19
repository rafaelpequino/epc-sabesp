import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import LoginCard from '../components/login/LoginCard'

function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/sistema" replace />
  }

  return (
    <main className="grid min-h-screen min-h-dvh place-items-center bg-page px-5 py-8">
      <LoginCard />
    </main>
  )
}

export default LoginPage
