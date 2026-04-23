import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted">Studio+</p>
          <h1 className="text-5xl leading-tight">Mini site, agendamento e atendimento para negócios da beleza.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Projeto SaaS com área pública, painel do cliente e painel administrativo, preparado para Vercel + Supabase.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/login" className="rounded-2xl bg-primary px-6 py-3 text-white">Entrar</Link>
            <Link href="/admin" className="rounded-2xl border border-border bg-white px-6 py-3">Painel admin</Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
          <h2 className="text-2xl">Inclui no sistema</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li>• Página pública por slug</li>
            <li>• Solicitação pública de agendamento</li>
            <li>• Painel do cliente</li>
            <li>• Painel admin</li>
            <li>• SQL inicial com RLS</li>
            <li>• Cadastro completo de cliente pelo admin</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
