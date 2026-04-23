import { createBusiness } from '@/actions/admin-businesses';
import { Field, Input, Select, SubmitButton, Textarea } from '@/components/shared/forms';
import { TopHeading } from '@/components/shared/shell';
import { requireAdmin } from '@/lib/auth';

export default async function NovoClientePage() {
  await requireAdmin();

  async function handleCreateBusiness(formData: FormData): Promise<void> {
    'use server';
    await createBusiness(formData);
  }

  return (
    <div>
      <TopHeading title="Novo cliente" description="Crie o acesso da dona do negócio e o business dela em um único passo." />
      <form action={handleCreateBusiness} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-6">
          <div>
            <h3 className="text-xl font-serif">Acesso da cliente</h3>
            <p className="mt-1 text-sm text-muted">Estes dados serão usados para criar o login da dona do studio.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Nome da responsável"><Input name="ownerName" /></Field>
            <Field label="E-mail da responsável"><Input name="ownerEmail" type="email" /></Field>
            <Field label="Senha inicial"><Input name="ownerPassword" type="password" /></Field>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-xl font-serif">Dados do negócio</h3>
            <p className="mt-1 text-sm text-muted">Você pode usar o nome do negócio e o sistema monta o slug automaticamente.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome do negócio"><Input name="businessName" /></Field>
            <Field label="Slug"><Input name="slug" placeholder="ex: studio-bella" /></Field>
            <Field label="Cidade"><Input name="city" /></Field>
            <Field label="WhatsApp"><Input name="whatsapp" /></Field>
            <Field label="Instagram"><Input name="instagram" /></Field>
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
            <div className="md:col-span-2"><Field label="Endereço"><Input name="address" /></Field></div>
            <div className="md:col-span-2"><Field label="Descrição"><Textarea name="description" rows={4} /></Field></div>
          </div>

          <div><SubmitButton>Criar cliente completo</SubmitButton></div>
        </div>
      </form>
    </div>
  );
}
