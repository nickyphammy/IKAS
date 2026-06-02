import SignUpForm, { SignUpLogo } from '../components/signup/SignUpForm'
import PageBackground from '../components/layout/PageBackground'
import PageContainer from '../components/layout/PageContainer'

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PageContainer className="pt-8">
          <SignUpLogo />
        </PageContainer>

        <div className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
          <div className="flex w-full max-w-[765px] flex-col items-center rounded-[40px] bg-white/70 px-6 py-12 sm:px-12 sm:py-20">
            <h1 className="mb-12 text-[32px] font-bold text-black sm:text-[40px]">
              Sign Up
            </h1>
            <SignUpForm />
          </div>
        </div>
      </div>
    </main>
  )
}
