import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { currencyBRL, whatsappLink } from '@/lib/utils';

export default async function PublicBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!business) notFound();

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  const { data: gallery } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('business_id', business.id)
    .order('sort_order', { ascending: true });

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted">Studio+</p>
            <h1 className="text-5xl leading-tight">{business.business_name}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              {business.description || 'Beleza, cuidado e atendimento com hora marcada.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${business.slug}/agendar`} className="rounded-2xl bg-primary px-6 py-3 text-white">Agendar horário</Link>
              {business.whatsapp && (
                <a href={whatsappLink(business.whatsapp)} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-white px-6 py-3">WhatsApp</a>
              )}
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <h2 className="text-2xl">Serviços em destaque</h2>
            <div className="mt-4 space-y-3">
              {services?.length ? services.slice(0, 4).map((service) => (
                <div key={service.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg">{service.name}</h3>
                      <p className="text-sm text-muted">{service.duration_minutes} min</p>
                    </div>
                    <span className="text-sm font-medium">{currencyBRL(service.price)}</span>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">O studio ainda não cadastrou serviços públicos.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl">Sobre o espaço</h2>
              <p className="mt-3 max-w-2xl text-muted">{business.description || 'Atendimento personalizado, ambiente acolhedor e serviços pensados para realçar sua beleza.'}</p>
            </div>
            <div className="rounded-2xl bg-[#FBF7F3] px-5 py-4 text-sm text-muted">
              <p>{business.city || 'Nova Odessa - SP'}</p>
              {business.address && <p className="mt-2">{business.address}</p>}
              {business.instagram && <p className="mt-2">@{business.instagram.replace('@', '')}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h2 className="mb-5 text-3xl">Todos os serviços</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services?.length ? services.map((service) => (
            <div key={service.id} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
              <h3 className="text-xl">{service.name}</h3>
              <p className="mt-2 text-sm text-muted">{service.description || 'Atendimento profissional com agendamento prévio.'}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">{service.duration_minutes} min</span>
                <span className="font-medium">{currencyBRL(service.price)}</span>
              </div>
            </div>
          )) : (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-white p-6 text-muted shadow-sm">
              Em breve este studio publicará seus serviços aqui.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-3xl">Galeria</h2>
            <Link href={`/${business.slug}/agendar`} className="text-sm text-primary">Solicitar horário</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(gallery?.length ? gallery : [{ id: '1' }, { id: '2' }, { id: '3' }]).map((item, index) => (
              <div key={item.id || index} className="aspect-[4/3] rounded-[1.5rem] border border-border bg-[#EFE6DE]" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
