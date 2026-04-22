import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
      <aside className={cn('border-r p-6', tone === 'admin' ? 'bg-dark text-white border-black/10' : 'bg-[#FBF7F3] border-border')}>
        <div className="mb-8">
          <p className={cn('text-xs uppercase tracking-[0.2em]', tone === 'admin' ? 'text-white/60' : 'text-muted')}>Studio+</p>
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
      </aside>
      <main className="p-6 md:p-8">{children}</main>
    </div>
  );
}

export function TopHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
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
