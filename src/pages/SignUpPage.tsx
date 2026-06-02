import SignUpForm, { SignUpLogo } from '../components/signup/SignUpForm'
import PageBackground from '../components/layout/PageBackground'
import PageContainer from '../components/layout/PageContainer'

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PageContainer className="pt-5">
          <SignUpLogo />
        </PageContainer>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
          <div className="motion-fade-in flex w-full max-w-[640px] flex-col items-center rounded-[24px] bg-white/70 px-6 py-8 sm:px-10 sm:py-10">
            <h1 className="mb-6 text-[24px] font-bold text-black">
              Sign Up
            </h1>
            <SignUpForm />
          </div>
        </div>
      </div>
    </main>
  )
}
