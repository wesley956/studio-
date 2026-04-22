'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { customerSchema } from '@/lib/validations/customer';

export async function createCustomer(formData: FormData) {
  const parsed = customerSchema.safeParse({
    businessId: formData.get('businessId'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    birthday: formData.get('birthday'),
    notes: formData.get('notes')
  });

  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' };

  const supabase = await createClient();
  const { error } = await supabase.from('customers').insert({
    business_id: parsed.data.businessId,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    birthday: parsed.data.birthday || null,
    notes: parsed.data.notes || null
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/app/clientes');
  return { success: true };
}
