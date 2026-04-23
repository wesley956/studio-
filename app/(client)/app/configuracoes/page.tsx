import { TopHeading } from '@/components/shared/shell';
import { getCurrentBusiness, requireClientOwner } from '@/lib/auth';
import { Field, Input, SubmitButton, Textarea } from '@/components/shared/forms';
import { updateBusinessSettings } from '@/actions/client-settings';

export default async function ConfiguracoesPage() {
  await requireClientOwner();
  const business = await getCurrentBusiness();

  async function handleUpdateBusinessSettings(formData: FormData): Promise<void> {
    'use server';
    await updateBusinessSettings(formData);
  }

  return (
    <div>
      <TopHeading title="Configurações" description="Ajuste os dados do negócio e a aparência básica da sua página pública." />

      <form action={handleUpdateBusinessSettings} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="ownerId" value={business.owner_id} />
        <input type="hidden" name="planName" value={business.plan_name} />
        <input type="hidden" name="status" value={business.status} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome do negócio"><Input name="businessName" defaultValue={business.business_name} /></Field>
          <Field label="Slug público" hint="Usado no link do seu mini site."><Input name="slug" defaultValue={business.slug} /></Field>
          <Field label="Cidade"><Input name="city" defaultValue={business.city || ''} /></Field>
          <Field label="WhatsApp"><Input name="whatsapp" defaultValue={business.whatsapp || ''} /></Field>
          <Field label="Instagram"><Input name="instagram" defaultValue={business.instagram || ''} /></Field>
          <Field label="Endereço"><Input name="address" defaultValue={business.address || ''} /></Field>
          <div className="md:col-span-2">
            <Field label="Descrição"><Textarea name="description" rows={5} defaultValue={business.description || ''} /></Field>
          </div>
        </div>

        <div className="mt-6">
          <SubmitButton>Salvar alterações</SubmitButton>
        </div>
      </form>
    </div>
  );
}
