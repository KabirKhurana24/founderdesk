'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setSuccess('');
    setConfirmPassword('');
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Your passwords do not match. Please check them and try again.');
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === 'signin') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        const destination = searchParams.get('next');
        router.push(destination?.startsWith('/') ? destination : '/dashboard');
        router.refresh();
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (authError) throw authError;
        if (data.session) {
          setSuccess('Your account is ready. Taking you to your workspace…');
          router.push('/dashboard');
          router.refresh();
        } else {
          setSuccess('Account created. Check your inbox for the confirmation email, confirm your address, then return here to sign in. If the email does not arrive, check your spam folder and Supabase email settings.');
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
      <section className="auth-card">
        <Link className="brand" href="/"><span className="brandmark">fd</span> founderdesk</Link>
        <div className="eyebrow">YOUR WORKSPACE</div>
        <h1>{mode === 'signin' ? <>Pick up where<br />things move.</> : <>Make room for<br />better follow-through.</>}</h1>
        <p className="muted">{mode === 'signin' ? 'Sign in to manage commitments, projects and follow-ups.' : 'Create your FounderDesk account to get started.'}</p>

        <div className="auth-mode-switch" role="tablist" aria-label="Account access">
          <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Create account</button>
        </div>

        <form onSubmit={submit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} />
          {mode === 'signup' && <>
            <label htmlFor="confirm-password">Confirm password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Enter your password again" />
          </>}
          <button className="button button-primary full" type="submit" disabled={busy || !email.trim() || password.length < 6 || (mode === 'signup' && confirmPassword.length < 6)}>
            {busy ? <LoaderCircle className="spin" size={16} /> : null}
            {busy ? (mode === 'signin' ? 'Signing in…' : 'Creating account…') : (mode === 'signin' ? 'Sign in' : 'Create account')}
          </button>
        </form>

        {error && <p className="form-message form-error" role="alert">{error}</p>}
        {success && <p className="form-message form-success" role="status"><CheckCircle2 size={16} /> <span>{success}</span></p>}
        <p className="tiny muted">Your account is managed securely by Supabase. {mode === 'signup' ? 'Use an email address you can access to confirm your account.' : 'New here? Select Create account above.'}</p>
      </section>
    </main>
  );
}
