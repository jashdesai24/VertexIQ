import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

// Wired with react-hook-form now so validation/error states are real, even though
// submission just navigates to /app for the MVP (Sprint 7 swaps this for a real API call).
export function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = () => navigate('/app')

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <h1 className="text-lg font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          Log in to your AURA AI workspace
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] dark:border-[var(--color-border-dark)]"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] dark:border-[var(--color-border-dark)]"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
            />
            {errors.password && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full">Log in</Button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
          MVP note: any valid input logs you into the demo workspace.
        </p>
      </Card>
    </div>
  )
}
