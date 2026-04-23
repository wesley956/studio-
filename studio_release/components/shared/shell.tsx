import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { signOut } from '@/actions/auth';

export function SidebarLayout({
  title,
  nav,
  children,
  tone = 'client'
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
  tone?: 'client' | 'admin';
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px,1fr]">
      <aside
        className={cn(
          'border-r p-6',
          tone === 'admin' ? 'border-black/10 bg-dark text-white' : 'border-border bg-[#FBF7F3]'
        )}
      >
        <div className="mb-8">
          <p
            className={cn(
              'text-xs uppercase tracking-[0.2em]',
              tone === 'admin' ? 'text-white/60' : 'text-muted'
            )}
          >
            Studio+
          </p>
          <h1 className="mt-2 text-2xl font-serif">{title}</h1>
        </div>

        <nav className="space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-2xl px-4 py-3 text-sm transition',
                tone === 'admin' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-primary-soft'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className={cn(
              'w-full rounded-2xl px-4 py-3 text-sm transition',
              tone === 'admin'
                ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                : 'border border-border bg-white hover:bg-primary-soft'
            )}
          >
            Sair
          </button>
        </form>
      </aside>

      <main className="p-6 md:p-8">{children}</main>
    </div>
  );
}

export function TopHeading({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-serif">{title}</h2>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-border bg-white p-8 text-center shadow-sm">
      <h3 className="text-xl font-serif">{title}</h3>
      <p className="mt-2 text-muted">{description}</p>
    </div>
  );
}
