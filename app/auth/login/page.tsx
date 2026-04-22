'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) return setError(error.message);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    router.push(profile?.role === 'admin' ? '/admin' : '/app');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Studio+</p>
        <h1 className="mt-3 text-3xl">Entrar</h1>
        <p className="mt-2 text-muted">Acesse o painel do cliente ou o painel administrativo.</p>

        <div className="mt-8 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" className="w-full rounded-2xl border border-border px-4 py-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Senha" className="w-full rounded-2xl border border-border px-4 py-3" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-2xl bg-primary px-5 py-3 text-white">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </main>
  );
}
