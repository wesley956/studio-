import { TopHeading, EmptyState } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { getCurrentBusiness, requireClientOwner } from '@/lib/auth';
import { updateAppointmentStatus } from '@/actions/client-bookings';
import { SecondaryButton } from '@/components/shared/forms';

export default async function AgendaPage() {
  await requireClientOwner();
  const business = await getCurrentBusiness();
  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, customers(full_name), services(name)')
    .eq('business_id', business.id)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  async function handleUpdateAppointmentStatus(formData: FormData): Promise<void> {
    'use server';
    await updateAppointmentStatus(formData);
  }

  return (
    <div>
      <TopHeading title="Agenda" description="Veja os horários confirmados e marque o andamento dos atendimentos." />
      <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {appointments?.length ? appointments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium">{item.customers?.full_name || 'Cliente'}</p>
                  <p className="text-sm text-muted">{item.services?.name || 'Serviço'} • {item.appointment_date} às {item.appointment_time}</p>
                </div>
                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-xs uppercase">{item.status}</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'confirmed', label: 'Confirmado' },
                      { value: 'completed', label: 'Concluir' },
                      { value: 'cancelled', label: 'Cancelar' },
                      { value: 'no_show', label: 'Faltou' }
                    ].map((status) => (
                      <form key={status.value} action={handleUpdateAppointmentStatus}>
                        <input type="hidden" name="appointmentId" value={item.id} />
                        <input type="hidden" name="status" value={status.value} />
                        <SecondaryButton type="submit" className="px-3 py-2 text-xs uppercase">
                          {status.label}
                        </SecondaryButton>
                      </form>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )) : <EmptyState title="Nenhum agendamento confirmado" description="Quando você aprovar solicitações, os horários confirmados aparecerão aqui." />}
        </div>
      </div>
    </div>
  );
}
