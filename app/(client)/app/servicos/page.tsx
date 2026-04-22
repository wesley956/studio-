import { createService } from '@/actions/client-services';
import { Field, Input, Select, SubmitButton, Textarea } from '@/components/shared/forms';
import { TopHeading } from '@/components/shared/shell';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { currencyBRL } from '@/lib/utils';

export default async function ServicosPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: business } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();
  const { data: services } = await supabase.from('services').select('*').eq('business_id', business?.id).order('created_at', { ascending: false });

  return (
    <div>
      <TopHeading title="Serviços" description="Cadastre os serviços que aparecem na sua página pública." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {services?.length ? services.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
              <h3 className="text-xl">{service.name}</h3>
              <p className="mt-2 text-sm text-muted">{service.description || 'Sem descrição.'}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">{service.duration_minutes} min</span>
                <span className="font-medium">{currencyBRL(service.price)}</span>
              </div>
            </div>
          )) : <p className="text-muted">Nenhum serviço cadastrado.</p>}
        </div>
        <form action={createService} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
          <input type="hidden" name="businessId" value={business?.id} />
          <h3 className="mb-4 text-2xl">Novo serviço</h3>
          <div className="grid gap-4">
            <Field label="Nome"><Input name="name" /></Field>
            <Field label="Descrição"><Textarea name="description" rows={3} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Preço"><Input name="price" type="number" step="0.01" /></Field>
              <Field label="Duração (min)"><Input name="durationMinutes" type="number" /></Field>
            </div>
            <Field label="Categoria">
              <Select name="category" defaultValue="">
                <option value="">Selecione</option>
                <option value="cabelo">Cabelo</option>
                <option value="unhas">Unhas</option>
                <option value="facial">Facial</option>
                <option value="sobrancelha">Sobrancelha</option>
                <option value="cilios">Cílios</option>
              </Select>
            </Field>
            <label className="flex items-center gap-2 text-sm"><input name="isActive" type="checkbox" defaultChecked /> Ativo na página pública</label>
            <SubmitButton>Salvar serviço</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
