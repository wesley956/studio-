import { TopHeading, StatCard, EmptyState } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { getCurrentBusiness, requireClientOwner } from '@/lib/auth';

export default async function ClientDashboard() {
  await requireClientOwner();
  const business = await getCurrentBusiness();
  const supabase = await createClient();

  const [{ count: requestsCount }, { count: servicesCount }, { count: customersCount }, { count: appointmentsCount }] =
    await Promise.all([
      supabase
        .from('booking_requests')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('status', 'pending'),
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
      supabase.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', business.id),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('business_id', business.id)
    ]);

  const { data: pendingRequests } = await supabase
    .from('booking_requests')
    .select('*')
    .eq('business_id', business.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <TopHeading
        title={business.business_name || 'Dashboard'}
        description="Acompanhe agenda, clientes e solicitações do seu studio."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Solicitações pendentes" value={requestsCount || 0} />
        <StatCard label="Serviços cadastrados" value={servicesCount || 0} />
        <StatCard label="Clientes" value={customersCount || 0} />
        <StatCard label="Agendamentos" value={appointmentsCount || 0} />
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <h3 className="text-2xl">Últimas solicitações</h3>
        <div className="mt-4 space-y-3">
          {pendingRequests?.length ? (
            pendingRequests.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.customer_name}</p>
                    <p className="text-sm text-muted">{item.requested_date} às {item.requested_time}</p>
                  </div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs">Pendente</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Nenhuma solicitação recente" description="Assim que novas clientes enviarem pedidos pela página pública, elas aparecerão aqui." />
          )}
        </div>
      </div>
    </div>
  );
}
