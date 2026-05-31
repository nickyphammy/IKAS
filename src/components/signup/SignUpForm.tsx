import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import TextField from '../ui/TextField'

export default function SignUpForm() {
  return (
    <form
      className="flex w-full max-w-[600px] flex-col gap-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <TextField
        type="email"
        label="Email"
        icon="/assets/signup/email-icon.png"
        autoComplete="email"
      />
      <div>
        <TextField
          type="password"
          label="Password"
          icon="/assets/signup/lock-icon.png"
          autoComplete="new-password"
        />
        <div className="mt-3 text-right">
          <button
            type="button"
            className="text-base text-[#0004ff] hover:underline"
          >
            forgot password?
          </button>
        </div>
      </div>

      <Button
        to="/home"
        variant="cta"
        className="mx-auto h-[59px] w-full max-w-[348px] text-base"
      >
        get started
      </Button>

      <div className="flex flex-col items-center gap-4 pt-4">
        <p className="text-base text-black">or sign in with</p>
        <button type="button" className="overflow-hidden rounded-lg">
          <img
            src="/assets/signup/google-signin.png"
            alt="Sign in with Google"
            className="h-[63px] w-[274px] object-cover"
          />
        </button>
      </div>
    </form>
  )
}

export function SignUpLogo() {
  return (
    <Link to="/" className="absolute left-[34px] top-8 flex items-center gap-3">
      <img
        src="/assets/signup/logo.svg"
        alt=""
        className="h-10 w-11 shrink-0"
      />
      <span className="text-2xl text-black">ikas</span>
    </Link>
  )
}
