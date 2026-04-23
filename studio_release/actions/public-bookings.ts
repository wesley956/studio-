'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { bookingRequestSchema } from '@/lib/validations/booking';

export async function createPublicBookingRequest(formData: FormData): Promise<void> {
  const returnTo = String(formData.get('returnTo') || '/');

  const parsed = bookingRequestSchema.safeParse({
    businessId: formData.get('businessId'),
    serviceId: formData.get('serviceId'),
    requestedDate: formData.get('requestedDate'),
    requestedTime: formData.get('requestedTime'),
    customerName: formData.get('customerName'),
    customerPhone: formData.get('customerPhone'),
    notes: formData.get('notes')
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Dados inválidos.');
  }

  const supabase = await createClient();

  const { error } = await supabase.from('booking_requests').insert({
    business_id: parsed.data.businessId,
    service_id: parsed.data.serviceId || null,
    requested_date: parsed.data.requestedDate,
    requested_time: parsed.data.requestedTime,
    customer_name: parsed.data.customerName,
    customer_phone: parsed.data.customerPhone,
    notes: parsed.data.notes || null,
    status: 'pending',
    source: 'public_page'
  });

  if (error) {
    throw new Error('Não foi possível enviar a solicitação.');
  }

  redirect(`${returnTo}${returnTo.includes('?') ? '&' : '?'}success=1`);
}
