import Link from 'next/link';
import { TopHeading, EmptyState } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

type BusinessRow = {
  id: string;
  business_name: string;
  city: string | null;
  plan_name: string;
  status: string;
  profiles: { full_name: string | null; email: string | null }[] | { full_name: string | null; email: string | null } | null;
};

export default async function AdminClientesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('businesses')
    .select('id, business_name, city, plan_name, status, profiles:owner_id(full_name,email)')
    .order('created_at', { ascending: false });

  const businesses = (data || []) as unknown as BusinessRow[];

  return (
    <div>
      <TopHeading title="Clientes" description="Gerencie os negócios criados dentro da plataforma." action={<Link href="/admin/clientes/novo" className="rounded-2xl bg-white px-5 py-3 text-dark">Novo cliente</Link>} />
      <div className="rounded-[1.5rem] border border-white/10 bg-white p-4 shadow-sm">
        {businesses.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="px-4 py-3">Negócio</th>
                  <th className="px-4 py-3">Responsável</th>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((item) => {
                  const owner = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
                  return (
                    <tr key={item.id} className="border-t border-border">
                      <td className="px-4 py-3">{item.business_name}</td>
                      <td className="px-4 py-3">{owner?.full_name || owner?.email || '-'}</td>
                      <td className="px-4 py-3">{item.city || '-'}</td>
                      <td className="px-4 py-3">{item.plan_name}</td>
                      <td className="px-4 py-3">{item.status}</td>
                      <td className="px-4 py-3"><Link href={`/admin/clientes/${item.id}`} className="text-primary">Ver</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="Nenhum cliente cadastrado" description="Cadastre o primeiro negócio para começar a usar a plataforma." />}
      </div>
    </div>
  );
}
