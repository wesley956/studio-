import { TopHeading, StatCard } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function AdminClienteDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase.from('businesses').select('*, profiles:owner_id(full_name,email)').eq('id', id).single();
  const [{ count: servicesCount }, { count: customersCount }, { count: requestsCount }] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('business_id', id),
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', id),
    supabase.from('booking_requests').select('*', { count: 'exact', head: true }).eq('business_id', id)
  ]);

  return (
    <div>
      <TopHeading title={business?.business_name || 'Cliente'} description="Visão consolidada do negócio dentro do Studio+." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Serviços" value={servicesCount || 0} />
        <StatCard label="Clientes" value={customersCount || 0} />
        <StatCard label="Solicitações" value={requestsCount || 0} />
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div><p className="text-sm text-muted">Responsável</p><p className="mt-1 font-medium">{(business as any)?.profiles?.full_name || '-'}</p></div>
          <div><p className="text-sm text-muted">Email</p><p className="mt-1 font-medium">{(business as any)?.profiles?.email || '-'}</p></div>
          <div><p className="text-sm text-muted">Cidade</p><p className="mt-1 font-medium">{business?.city || '-'}</p></div>
          <div><p className="text-sm text-muted">Status</p><p className="mt-1 font-medium">{business?.status || '-'}</p></div>
          <div><p className="text-sm text-muted">Plano</p><p className="mt-1 font-medium">{business?.plan_name || '-'}</p></div>
          <div><p className="text-sm text-muted">Slug</p><p className="mt-1 font-medium">{business?.slug || '-'}</p></div>
          <div className="md:col-span-2"><p className="text-sm text-muted">Descrição</p><p className="mt-1 font-medium">{business?.description || '-'}</p></div>
        </div>
      </div>
    </div>
  );
}
