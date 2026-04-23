import { createService, deleteService, toggleServiceVisibility } from '@/actions/client-services';
import { Field, Input, Select, SubmitButton, Textarea, SecondaryButton } from '@/components/shared/forms';
import { TopHeading, EmptyState } from '@/components/shared/shell';
import { requireClientOwner, getCurrentBusiness } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { currencyBRL } from '@/lib/utils';

export default async function ServicosPage() {
  await requireClientOwner();
  const business = await getCurrentBusiness();
  const supabase = await createClient();

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  async function handleCreateService(formData: FormData): Promise<void> {
    'use server';
    await createService(formData);
  }

  async function handleDeleteService(formData: FormData): Promise<void> {
    'use server';
    await deleteService(formData);
  }

  async function handleToggleServiceVisibility(formData: FormData): Promise<void> {
    'use server';
    await toggleServiceVisibility(formData);
  }

  return (
    <div>
      <TopHeading title="Serviços" description="Cadastre os serviços que aparecem na sua página pública." />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {services?.length ? services.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl">{service.name}</h3>
                  <p className="mt-2 text-sm text-muted">{service.description || 'Sem descrição.'}</p>
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs uppercase">
                  {service.is_active ? 'ativo' : 'oculto'}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">{service.duration_minutes} min</span>
                <span className="font-medium">{currencyBRL(service.price)}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={handleToggleServiceVisibility}>
                  <input type="hidden" name="serviceId" value={service.id} />
                  <input type="hidden" name="nextValue" value={service.is_active ? 'false' : 'true'} />
                  <SecondaryButton type="submit">{service.is_active ? 'Ocultar' : 'Publicar'}</SecondaryButton>
                </form>
                <form action={handleDeleteService}>
                  <input type="hidden" name="serviceId" value={service.id} />
                  <SecondaryButton type="submit">Excluir</SecondaryButton>
                </form>
              </div>
            </div>
          )) : <EmptyState title="Nenhum serviço cadastrado" description="Adicione os primeiros serviços para que eles apareçam na página pública." />}
        </div>

        <form action={handleCreateService} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
          <input type="hidden" name="businessId" value={business.id} />
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
