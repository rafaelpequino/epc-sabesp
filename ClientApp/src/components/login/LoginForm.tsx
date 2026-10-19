import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import FormField from '../common/FormField'

type LocationState = { from?: { pathname: string } } | null

function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const redirectTo = (location.state as LocationState)?.from?.pathname ?? '/sistema'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    try {
      login(String(data.get('username') ?? ''), String(data.get('password') ?? ''))
      navigate(redirectTo, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar.')
    }
  }

  return (
    <form className="mt-[34px] flex flex-col gap-[22px]" onSubmit={handleSubmit}>
      <FormField
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        label="Usuário"
        placeholder="Seu usuário"
        required
      />

      <FormField
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        label="Senha"
        placeholder="Sua senha"
        required
      />

      {error && (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        className="mt-[-1px] min-h-[51px] cursor-pointer rounded-[9px] border-0 bg-brand text-[15px] font-bold text-white transition-colors hover:bg-brand-600 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand"
        type="submit"
      >
        Entrar
      </button>
    </form>
  )
}

export default LoginForm
