import { TopHeading } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function ConfiguracoesPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: business } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();

  return (
    <div>
      <TopHeading title="Configurações" description="Ajuste dados do negócio e da sua página pública." />
      <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted">Nome do negócio</p>
            <p className="mt-1 font-medium">{business?.business_name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Slug público</p>
            <p className="mt-1 font-medium">{business?.slug || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Cidade</p>
            <p className="mt-1 font-medium">{business?.city || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted">WhatsApp</p>
            <p className="mt-1 font-medium">{business?.whatsapp || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted">Descrição</p>
            <p className="mt-1 font-medium">{business?.description || 'Sem descrição cadastrada.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
