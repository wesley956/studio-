import { createBusiness } from '@/actions/admin-businesses';
import { Field, Input, Select, SubmitButton, Textarea } from '@/components/shared/forms';
import { TopHeading } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function NovoClientePage() {
  await requireUser();

  const supabase = await createClient();

  const { data: owners } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'client_owner')
    .order('full_name');

  async function handleCreateBusiness(formData: FormData): Promise<void> {
    'use server';
    await createBusiness(formData);
  }

  return (
    <div>
      <TopHeading
        title="Novo cliente"
        description="Crie um novo negócio dentro da plataforma."
      />

      <form
        action={handleCreateBusiness}
        className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Responsável">
            <Select name="ownerId" defaultValue="">
              <option value="">Selecione</option>
              {owners?.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.full_name || owner.email}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Nome do negócio">
            <Input name="businessName" />
          </Field>

          <Field label="Slug">
            <Input name="slug" />
          </Field>

          <Field label="Cidade">
            <Input name="city" />
          </Field>

          <Field label="WhatsApp">
            <Input name="whatsapp" />
          </Field>

          <Field label="Instagram">
            <Input name="instagram" />
          </Field>

          <Field label="Plano">
            <Select name="planName" defaultValue="start">
              <option value="start">Start</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </Select>
          </Field>

          <Field label="Status">
            <Select name="status" defaultValue="trial">
              <option value="trial">Teste</option>
              <option value="active">Ativo</option>
              <option value="blocked">Bloqueado</option>
            </Select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Endereço">
              <Input name="address" />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Descrição">
              <Textarea name="description" rows={4} />
            </Field>
          </div>
        </div>

        <div className="mt-6">
          <SubmitButton>Criar negócio</SubmitButton>
        </div>
      </form>
    </div>
  );
}
