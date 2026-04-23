'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { businessSchema } from '@/lib/validations/business';
import { slugify } from '@/lib/utils';

export async function updateBusinessSettings(formData: FormData): Promise<void> {
  const businessId = String(formData.get('businessId') || '');

  const parsed = businessSchema.safeParse({
    ownerId: String(formData.get('ownerId') || '00000000-0000-0000-0000-000000000000'),
    businessName: formData.get('businessName'),
    slug: slugify(String(formData.get('slug') || formData.get('businessName') || '')),
    city: formData.get('city'),
    whatsapp: formData.get('whatsapp'),
    instagram: formData.get('instagram'),
    address: formData.get('address'),
    description: formData.get('description'),
    planName: formData.get('planName') || 'start',
    status: formData.get('status') || 'active'
  });

  if (!businessId) {
    throw new Error('Negócio inválido.');
  }

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Dados inválidos.');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('businesses')
    .update({
      business_name: parsed.data.businessName,
      slug: parsed.data.slug,
      city: parsed.data.city || null,
      whatsapp: parsed.data.whatsapp || null,
      instagram: parsed.data.instagram || null,
      address: parsed.data.address || null,
      description: parsed.data.description || null
    })
    .eq('id', businessId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/app/configuracoes');
}
