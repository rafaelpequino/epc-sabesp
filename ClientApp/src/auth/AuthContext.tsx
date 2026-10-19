import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getStoredToken,
  login as loginRequest,
  logout as logoutRequest,
  readUserFromToken,
  type AuthUser,
} from '../services/authService'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken)

  const login = useCallback((username: string, password: string) => {
    setToken(loginRequest(username, password))
  }, [])

  const logout = useCallback(() => {
    logoutRequest()
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const user = readUserFromToken(token)
    return { user, isAuthenticated: user !== null, login, logout }
  }, [token, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }

  return context
}
