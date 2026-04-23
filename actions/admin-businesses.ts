'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { businessSchema } from '@/lib/validations/business';

export async function createBusiness(formData: FormData): Promise<void> {
  const parsed = businessSchema.safeParse({
    ownerId: formData.get('ownerId'),
    businessName: formData.get('businessName'),
    slug: formData.get('slug'),
    city: formData.get('city'),
    whatsapp: formData.get('whatsapp'),
    instagram: formData.get('instagram'),
    address: formData.get('address'),
    description: formData.get('description'),
    planName: formData.get('planName') || 'start',
    status: formData.get('status') || 'trial'
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Dados inválidos.');
  }

  const supabase = await createClient();

  const { error } = await supabase.from('businesses').insert({
    owner_id: parsed.data.ownerId,
    business_name: parsed.data.businessName,
    slug: parsed.data.slug,
    city: parsed.data.city || null,
    whatsapp: parsed.data.whatsapp || null,
    instagram: parsed.data.instagram || null,
    address: parsed.data.address || null,
    description: parsed.data.description || null,
    plan_name: parsed.data.planName,
    status: parsed.data.status
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/clientes');
}
