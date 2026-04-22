'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function approveBookingRequest(formData: FormData) {
  const requestId = String(formData.get('requestId') || '');
  if (!requestId) return { success: false, error: 'Solicitação inválida.' };

  const supabase = await createClient();
  const { data: request, error: requestError } = await supabase
    .from('booking_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (requestError || !request) return { success: false, error: 'Solicitação não encontrada.' };

  let customerId: string | null = null;

  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('business_id', request.business_id)
    .eq('phone', request.customer_phone)
    .maybeSingle();

  if (existingCustomer?.id) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({
        business_id: request.business_id,
        full_name: request.customer_name,
        phone: request.customer_phone
      })
      .select('id')
      .single();

    if (customerError || !newCustomer) return { success: false, error: 'Não foi possível criar a cliente.' };
    customerId = newCustomer.id;
  }

  const { error: appointmentError } = await supabase.from('appointments').insert({
    business_id: request.business_id,
    customer_id: customerId,
    booking_request_id: request.id,
    service_id: request.service_id,
    appointment_date: request.requested_date,
    appointment_time: request.requested_time,
    status: 'confirmed',
    notes: request.notes || null
  });

  if (appointmentError) return { success: false, error: appointmentError.message };

  const { error: updateError } = await supabase
    .from('booking_requests')
    .update({ status: 'approved' })
    .eq('id', request.id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath('/app/solicitacoes');
  revalidatePath('/app/agenda');
  return { success: true };
}
