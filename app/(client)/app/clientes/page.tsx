import { createCustomer } from '@/actions/client-customers';
import { Field, Input, Textarea, SubmitButton } from '@/components/shared/forms';
import { TopHeading } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function ClientesPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', business?.id)
    .order('created_at', { ascending: false });

  async function handleCreateCustomer(formData: FormData): Promise<void> {
    'use server';
    await createCustomer(formData);
  }

  return (
    <div>
      <TopHeading
        title="Clientes"
        description="Cadastre e acompanhe as clientes do seu negócio."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
          <div className="space-y-3">
            {customers?.length ? (
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="rounded-2xl border border-border p-4"
                >
                  <p className="font-medium">{customer.full_name}</p>
                  <p className="text-sm text-muted">{customer.phone}</p>
                  {customer.notes && (
                    <p className="mt-2 text-sm text-muted">{customer.notes}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">Nenhuma cliente cadastrada.</p>
            )}
          </div>
        </div>

        <form
          action={handleCreateCustomer}
          className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="businessId" value={business?.id ?? ''} />

          <h3 className="mb-4 text-2xl">Nova cliente</h3>

          <div className="grid gap-4">
            <Field label="Nome completo">
              <Input name="fullName" />
            </Field>

            <Field label="Telefone">
              <Input name="phone" />
            </Field>

            <Field label="Aniversário">
              <Input name="birthday" type="date" />
            </Field>

            <Field label="Observações">
              <Textarea name="notes" rows={4} />
            </Field>

            <SubmitButton>Salvar cliente</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
