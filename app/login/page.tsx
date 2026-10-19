 'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

type Mode = 'signin' | 'signup';

function LoginForm() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setConfirmPassword('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const normalizedEmail = email.trim();

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Your passwords do not match. Please try again.');
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();

      if (mode === 'signin') {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

        if (authError) throw authError;

        const destination = searchParams.get('next');
        const safeDestination =
          destination?.startsWith('/') && !destination.startsWith('//')
            ? destination
            : '/dashboard';

        router.replace(safeDestination);
        router.refresh();
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (authError) throw authError;

        if (data.session) {
          setSuccess('Account created successfully. Opening your workspace…');
          router.replace('/dashboard');
          router.refresh();
        } else {
          setSuccess(
            'Account created. Check your email for a confirmation link, then return here to sign in. Check your spam folder if needed.'
          );

          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';

      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <section className="auth-card">
        <Link className="brand" href="/">
          <span className="brandmark">fd</span>
          founderdesk
        </Link>

        <div className="eyebrow">YOUR WORKSPACE</div>

        <h1>
          {mode === 'signin' ? (
            <>
              Pick up where
              <br />
              things move.
            </>
          ) : (
            <>
              Make room for
              <br />
              better follow-through.
            </>
          )}
        </h1>

        <p className="muted">
          {mode === 'signin'
            ? 'Sign in to manage commitments, projects and follow-ups.'
            : 'Create your FounderDesk account to get started.'}
        </p>

        <div className="auth-mode-switch" role="tablist" aria-label="Account access">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => switchMode('signin')}
          >
            Sign in
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => switchMode('signup')}
          >
            Create account
          </button>
        </div>

        <form onSubmit={submit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === 'signup' ? 'new-password' : 'current-password'
            }
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={
              mode === 'signup' ? 'At least 6 characters' : 'Your password'
            }
          />

          {mode === 'signup' && (
            <>
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
              />
            </>
          )}

          <button
            className="button button-primary full"
            type="submit"
            disabled={
              busy ||
              !email.trim() ||
              password.length < 6 ||
              (mode === 'signup' && confirmPassword.length < 6)
            }
          >
            {busy && <LoaderCircle className="spin" size={16} />}
            {busy
              ? mode === 'signin'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        {error && (
          <p className="form-message form-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="form-message form-success" role="status">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </p>
        )}

        <p className="tiny muted">
          Your account is managed securely by Supabase.{' '}
          {mode === 'signup'
            ? 'Use an email address you can access to confirm your account.'
            : 'New here? Select Create account above.'}
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-shell">
          <section className="auth-card">
            <p className="muted">Loading FounderDesk…</p>
          </section>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}