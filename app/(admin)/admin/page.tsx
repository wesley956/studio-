import { StatCard, TopHeading, EmptyState } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ count: businessesCount }, { count: ownersCount }, { count: requestsCount }, { count: appointmentsCount }] = await Promise.all([
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client_owner'),
    supabase.from('booking_requests').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true })
  ]);

  const { data: latestBusinesses } = await supabase.from('businesses').select('*').order('created_at', { ascending: false }).limit(5);

  return (
    <div>
      <TopHeading title="Dashboard Admin" description="Acompanhe clientes, uso da plataforma e crescimento do Studio+." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Negócios" value={businessesCount || 0} />
        <StatCard label="Donas cadastradas" value={ownersCount || 0} />
        <StatCard label="Solicitações totais" value={requestsCount || 0} />
        <StatCard label="Agendamentos" value={appointmentsCount || 0} />
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <h3 className="text-2xl">Últimos negócios</h3>
        <div className="mt-4 space-y-3">
          {latestBusinesses?.length ? latestBusinesses.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <p className="font-medium">{item.business_name}</p>
              <p className="text-sm text-muted">{item.city || 'Sem cidade'} • {item.status}</p>
            </div>
          )) : <EmptyState title="Nenhum negócio cadastrado" description="Crie o primeiro cliente da plataforma pelo menu lateral." />}
        </div>
      </div>
    </div>
  );
}
