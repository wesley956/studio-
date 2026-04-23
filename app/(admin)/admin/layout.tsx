import { ReactNode } from 'react';
import { SidebarLayout } from '@/components/shared/shell';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/clientes', label: 'Clientes' },
  { href: '/admin/clientes/novo', label: 'Novo cliente' }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SidebarLayout title="Admin Studio+" nav={nav} tone="admin">{children}</SidebarLayout>;
}
