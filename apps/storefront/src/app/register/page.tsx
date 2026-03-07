'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authRegister } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useT } from '@/context/SiteConfigContext';

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authRegister(email.trim(), password, name.trim() || null);
      setToken(res.token);
      setUser(res.user);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-pad flex items-center justify-center min-h-[60vh]">
      <div className="container-narrow max-w-md">
        <div className="card p-8 md:p-10">
          <h1 className="heading-2 text-[rgb(var(--color-foreground))] mb-6">{t('auth.createAccount')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">{t('auth.email')}</label>
              <input type="email" className="input-base" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">{t('auth.password')}</label>
              <input type="password" className="input-base" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-1">{t('auth.nameOptional')}</label>
              <input type="text" className="input-base" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? t('auth.registering') : t('auth.registerSubmit')}
            </button>
          </form>
          <p className="mt-6 text-sm text-[rgb(var(--color-muted))]">
            {t('auth.hasAccount')} <Link href="/login" className="font-semibold text-[rgb(var(--color-accent))] hover:underline">{t('auth.loginSubmit')}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
