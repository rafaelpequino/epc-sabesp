import LoginForm from './LoginForm'
import LoginHeader from './LoginHeader'

function LoginCard() {
  return (
    <section
      className="w-full max-w-[432px] rounded-2xl border border-[rgb(213_229_237_/_72%)] bg-white p-[38px] shadow-[0_18px_44px_rgb(38_75_96_/_13%)] max-[480px]:px-[26px] max-[480px]:py-8"
      aria-labelledby="login-title"
    >
      <LoginHeader />
      <LoginForm />
    </section>
  )
}

export default LoginCard
