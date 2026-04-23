'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { customerSchema } from '@/lib/validations/customer';

export async function createCustomer(formData: FormData): Promise<void> {
  const parsed = customerSchema.safeParse({
    businessId: formData.get('businessId'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    birthday: formData.get('birthday'),
    notes: formData.get('notes')
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Dados inválidos.');
  }

  const supabase = await createClient();

  const { error } = await supabase.from('customers').insert({
    business_id: parsed.data.businessId,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    birthday: parsed.data.birthday || null,
    notes: parsed.data.notes || null
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/app/clientes');
}

export async function deleteCustomer(formData: FormData): Promise<void> {
  const customerId = String(formData.get('customerId') || '');

  if (!customerId) {
    throw new Error('Cliente inválida.');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('customers').delete().eq('id', customerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/app/clientes');
}
