import { approveBookingRequest, cancelBookingRequest } from '@/actions/client-bookings';
import { TopHeading, EmptyState } from '@/components/shared/shell';
import { createClient } from '@/lib/supabase/server';
import { getCurrentBusiness, requireClientOwner } from '@/lib/auth';
import { SecondaryButton } from '@/components/shared/forms';

export default async function SolicitacoesPage() {
  await requireClientOwner();
  const business = await getCurrentBusiness();
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from('booking_requests')
    .select('*, services(name)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  async function handleApproveBookingRequest(formData: FormData): Promise<void> {
    'use server';
    await approveBookingRequest(formData);
  }

  async function handleCancelBookingRequest(formData: FormData): Promise<void> {
    'use server';
    await cancelBookingRequest(formData);
  }

  return (
    <div>
      <TopHeading title="Solicitações" description="Aprove ou recuse os pedidos vindos da página pública." />

      <div className="space-y-4">
        {requests?.length ? requests.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{item.customer_name}</p>
                <p className="text-sm text-muted">
                  {item.services?.name || 'Serviço não informado'} • {item.requested_date} às {item.requested_time}
                </p>
                <p className="mt-1 text-sm text-muted">{item.customer_phone}</p>
                {item.notes && <p className="mt-2 text-sm text-muted">{item.notes}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary-soft px-3 py-2 text-xs uppercase">{item.status}</span>

                {item.status === 'pending' && (
                  <>
                    <form action={handleApproveBookingRequest}>
                      <input type="hidden" name="requestId" value={item.id} />
                      <button type="submit" className="rounded-2xl bg-primary px-4 py-2 text-white">
                        Aprovar
                      </button>
                    </form>

                    <form action={handleCancelBookingRequest}>
                      <input type="hidden" name="requestId" value={item.id} />
                      <SecondaryButton type="submit">Recusar</SecondaryButton>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )) : <EmptyState title="Nenhuma solicitação recebida" description="Quando uma cliente enviar um pedido pela página pública, ele aparecerá aqui." />}
      </div>
    </div>
  );
}
