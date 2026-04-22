import Link from 'next/link';
import { TopHeading } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function AdminClientesPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, profiles:owner_id(full_name,email)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <TopHeading title="Clientes" description="Gerencie os negócios criados dentro da plataforma." action={<Link href="/admin/clientes/novo" className="rounded-2xl bg-white px-5 py-3 text-dark">Novo cliente</Link>} />
      <div className="rounded-[1.5rem] border border-white/10 bg-white p-4 shadow-sm">
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
              {businesses?.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3">{item.business_name}</td>
                  <td className="px-4 py-3">{(item as any).profiles?.full_name || '-'}</td>
                  <td className="px-4 py-3">{item.city || '-'}</td>
                  <td className="px-4 py-3">{item.plan_name}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3"><Link href={`/admin/clientes/${item.id}`} className="text-primary">Ver</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
