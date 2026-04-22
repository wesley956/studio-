# Studio+

Micro-SaaS para beleza e estética com:
- página pública por slug;
- solicitação de agendamento;
- painel do cliente;
- painel admin;
- Supabase + Vercel.

## Stack
- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + Storage
- Vercel

## Como rodar
1. Instale dependências:
```bash
npm install
```

2. Crie `.env.local` a partir de `.env.example`.

3. Rode o SQL de `supabase/migrations/0001_init.sql` no seu projeto Supabase.

4. Inicie:
```bash
npm run dev
```

## Estrutura principal
- `app/(public)/[slug]` → página pública do negócio
- `app/(public)/[slug]/agendar` → solicitação pública
- `app/(client)/app` → painel do cliente
- `app/(admin)/admin` → painel admin
- `actions/` → server actions
- `lib/` → supabase, auth, utils e validações
- `supabase/migrations/` → schema SQL

## Observações importantes
- O projeto já tem a base completa do MVP.
- A autenticação está conectada ao Supabase.
- Para o fluxo admin ficar completo, você precisa criar usuários em `auth.users` e perfis em `profiles`.
- A checagem de role admin/cliente está modelada no banco e no perfil, mas você pode endurecer isso depois com guards extras por rota.
- O projeto está pronto como base sólida para evolução, mas ainda é um MVP inicial e não inclui recursos avançados como cobrança recorrente, múltiplas profissionais com agendas separadas e WhatsApp oficial.

## Próximos upgrades sugeridos
- endurecer guard de admin por role;
- CRUD completo de edição/exclusão;
- upload real de galeria e logo;
- dashboard com gráficos;
- tema visual configurável por cliente;
- integração oficial de WhatsApp.
