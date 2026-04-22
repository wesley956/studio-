import { TopHeading, StatCard } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function ClientDashboard() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: business } = await supabase.from('businesses').select('id,business_name').eq('owner_id', user.id).single();
  const businessId = business?.id;

  const [{ count: requestsCount }, { count: servicesCount }, { count: customersCount }, { count: appointmentsCount }] = await Promise.all([
    supabase.from('booking_requests').select('*', { count: 'exact', head: true }).eq('business_id', businessId),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('business_id', businessId),
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('business_id', businessId),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('business_id', businessId)
  ]);

  const { data: pendingRequests } = await supabase
    .from('booking_requests')
    .select('*')
    .eq('business_id', businessId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <TopHeading title={business?.business_name || 'Dashboard'} description="Acompanhe agenda, clientes e solicitações." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Solicitações pendentes" value={requestsCount || 0} />
        <StatCard label="Serviços cadastrados" value={servicesCount || 0} />
        <StatCard label="Clientes" value={customersCount || 0} />
        <StatCard label="Agendamentos" value={appointmentsCount || 0} />
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <h3 className="text-2xl">Últimas solicitações</h3>
        <div className="mt-4 space-y-3">
          {pendingRequests?.length ? pendingRequests.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{item.customer_name}</p>
                  <p className="text-sm text-muted">{item.requested_date} às {item.requested_time}</p>
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs">Pendente</span>
              </div>
            </div>
          )) : <p className="text-muted">Nenhuma solicitação recente.</p>}
        </div>
      </div>
    </div>
  );
}
