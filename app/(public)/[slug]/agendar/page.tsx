import { createPublicBookingRequest } from '@/actions/public-bookings';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Field, Input, Select, SubmitButton, Textarea } from '@/components/shared/forms';
import { whatsappLink } from '@/lib/utils';

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!business) notFound();

  const { data: services } = await supabase
    .from('services')
    .select('id, name')
    .eq('business_id', business.id)
    .eq('is_active', true)
    .order('name');

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-muted">Agendamento</p>
        <h1 className="text-4xl">Agende seu horário</h1>
        <p className="mt-3 max-w-2xl text-muted">Escolha o serviço, a data e o horário desejado. Sua solicitação será enviada para confirmação.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-[0.9fr,1.1fr]">
        <aside className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
          <h2 className="text-2xl">{business.business_name}</h2>
          <div className="mt-4 space-y-3 text-muted">
            <p>{business.city || 'Atendimento com hora marcada'}</p>
            {business.address && <p>{business.address}</p>}
            {business.whatsapp && <a href={whatsappLink(business.whatsapp)} className="block text-primary" target="_blank" rel="noreferrer">Falar no WhatsApp</a>}
          </div>
        </aside>
        <form action={createPublicBookingRequest} className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
          <input type="hidden" name="businessId" value={business.id} />
          <div className="grid gap-5">
            <Field label="Serviço">
              <Select name="serviceId" defaultValue="">
                <option value="">Selecione um serviço</option>
                {services?.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </Select>
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Data"><Input name="requestedDate" type="date" /></Field>
              <Field label="Horário desejado"><Input name="requestedTime" type="time" /></Field>
            </div>
            <Field label="Seu nome"><Input name="customerName" type="text" /></Field>
            <Field label="WhatsApp"><Input name="customerPhone" type="text" /></Field>
            <Field label="Observações"><Textarea name="notes" rows={4} /></Field>
            <SubmitButton>Solicitar agendamento</SubmitButton>
          </div>
        </form>
      </div>
    </main>
  );
}
