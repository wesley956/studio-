import { Suspense } from 'react';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <Suspense fallback={<div className="text-sm text-muted">Carregando login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
