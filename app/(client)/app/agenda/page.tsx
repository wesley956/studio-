import { TopHeading } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function AgendaPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: business } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, customers(full_name), services(name)')
    .eq('business_id', business?.id)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  return (
    <div>
      <TopHeading title="Agenda" description="Veja os horários confirmados do seu negócio." />
      <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {appointments?.length ? appointments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{item.customers?.full_name || 'Cliente'}</p>
                  <p className="text-sm text-muted">{item.services?.name || 'Serviço'} • {item.appointment_date} às {item.appointment_time}</p>
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs uppercase">{item.status}</span>
              </div>
            </div>
          )) : <p className="text-muted">Nenhum agendamento confirmado ainda.</p>}
        </div>
      </div>
    </div>
  );
}
