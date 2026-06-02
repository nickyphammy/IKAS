import { Link } from 'react-router-dom'
import { asset } from '../../lib/asset'
import Button from '../ui/Button'
import TextField from '../ui/TextField'

export default function SignUpForm() {
  return (
    <form
      className="flex w-full max-w-[520px] flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <TextField
        type="email"
        label="Email"
        icon={asset('assets/signup/email-icon.png')}
        autoComplete="email"
      />
      <div>
        <TextField
          type="password"
          label="Password"
          icon={asset('assets/signup/lock-icon.png')}
          autoComplete="new-password"
        />
        <div className="mt-2 text-right">
          <button
            type="button"
            className="text-[16px] text-[#0004ff] hover:underline"
          >
            forgot password?
          </button>
        </div>
      </div>

      <Button
        to="/home"
        variant="cta"
        className="mx-auto h-12 w-full max-w-[320px] text-[16px]"
      >
        get started
      </Button>

      <div className="flex flex-col items-center gap-3 pt-2">
        <p className="text-[16px] text-black">or sign in with</p>
        <button type="button" className="motion-press overflow-hidden rounded-lg">
          <img
            src={asset('assets/signup/google-signin.png')}
            alt="Sign in with Google"
            className="h-14 w-[244px] object-cover transition duration-300 hover:saturate-110"
          />
        </button>
      </div>
    </form>
  )
}

export function SignUpLogo() {
  return (
    <Link to="/" className="absolute left-[34px] top-5 flex items-center gap-3">
      <img
        src={asset('assets/signup/logo.svg')}
        alt=""
        className="h-8 w-9 shrink-0"
      />
      <span className="text-[16px] text-black">ikas</span>
    </Link>
  )
}
