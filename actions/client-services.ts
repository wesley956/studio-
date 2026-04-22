'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { serviceSchema } from '@/lib/validations/service';

export async function createService(formData: FormData) {
  const parsed = serviceSchema.safeParse({
    businessId: formData.get('businessId'),
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    durationMinutes: formData.get('durationMinutes'),
    category: formData.get('category'),
    isActive: formData.get('isActive')
  });

  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' };

  const supabase = await createClient();
  const { error } = await supabase.from('services').insert({
    business_id: parsed.data.businessId,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: parsed.data.price,
    duration_minutes: parsed.data.durationMinutes,
    category: parsed.data.category || null,
    is_active: parsed.data.isActive
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/app/servicos');
  return { success: true };
}
