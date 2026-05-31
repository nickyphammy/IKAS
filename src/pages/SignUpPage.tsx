import SignUpForm, { SignUpLogo } from '../components/signup/SignUpForm'

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/assets/signup/hero-bg.png"
          alt=""
          className="size-full object-cover object-center"
        />
      </div>

      <SignUpLogo />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="flex w-full max-w-[765px] flex-col items-center rounded-[40px] bg-white/70 px-8 py-16 sm:px-12 sm:py-20">
          <h1 className="mb-12 text-[40px] font-bold text-black">Sign Up</h1>
          <SignUpForm />
        </div>
      </div>
    </main>
  )
}
