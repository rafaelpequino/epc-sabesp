import FormField from '../common/FormField'

function LoginForm() {
  return (
    <div className="mt-[34px] flex flex-col gap-[22px]">
      <FormField
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        label="Email"
        placeholder="seu@email.com"
      />

      <FormField
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        label="Senha"
        placeholder="Sua senha"
      />

      <button
        className="mt-[-1px] min-h-[51px] cursor-pointer rounded-[9px] border-0 bg-[#0b80bd] text-[15px] font-bold text-white transition-colors hover:bg-[#0872aa] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-600"
        type="button"
      >
        Entrar
      </button>
    </div>
  )
}

export default LoginForm
