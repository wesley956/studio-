import { ReactNode } from 'react';
import { SidebarLayout } from '@/components/shared/shell';

const nav = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/agenda', label: 'Agenda' },
  { href: '/app/clientes', label: 'Clientes' },
  { href: '/app/servicos', label: 'Serviços' },
  { href: '/app/solicitacoes', label: 'Solicitações' },
  { href: '/app/configuracoes', label: 'Configurações' }
];

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <SidebarLayout title="Painel do Cliente" nav={nav}>{children}</SidebarLayout>;
}
