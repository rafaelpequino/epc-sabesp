import sabespIcon from '../../assets/images/sabesp-icon.png'

function LoginHeader() {
  return (
    <header className="flex items-center justify-center gap-5 max-[480px]:gap-3">
      <img
        className="block h-12 object-contain"
        src={sabespIcon}
        alt="Sabesp"
      />
      <span className="h-14 w-px bg-line" aria-hidden="true" />
      <h1
        className="flex flex-col text-left text-sm font-medium uppercase leading-tight tracking-wide text-[#586a79]"
        id="login-title"
      >
        <span className="text-2xl font-bold">EPC</span>
        <span>Engenharia de Custos</span>
      </h1>
    </header>
  )
}

export default LoginHeader
