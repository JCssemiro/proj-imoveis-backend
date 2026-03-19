# API ImobiConnect

Backend da plataforma ImobiConnect em **NestJS** com **Fastify**, **Prisma** e **PostgreSQL**, conforme [API-ARQ.md](../API-ARQ.md) e [API-DEV.md](../API-DEV.md).

## Pré-requisitos

- Node.js 20.x ou 22.x (LTS)
- pnpm ou npm
- PostgreSQL 14+ (local ou em nuvem)
- Git

## Setup local

1. **Instalar dependências**

   ```bash
   cd api
   pnpm install
   ```

2. **Configurar ambiente**

   ```bash
   cp .env.example .env
   ```

   Edite `.env` e preencha pelo menos:

   - `DATABASE_URL` – conexão PostgreSQL
   - `JWT_SECRET` – chave forte para assinatura do JWT
   - `FRONTEND_URL` – origem permitida no CORS

3. **Banco de dados**

   Certifique-se de que o PostgreSQL está rodando e que o banco indicado em `DATABASE_URL` existe (ex.: `imobiconnect`). Depois:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

   O `migrate deploy` aplica todas as migrations pendentes no banco. Para ver o status: `npx prisma migrate status`.

   Em desenvolvimento, para criar novas migrations após alterar o `schema.prisma`:

   ```bash
   npx prisma migrate dev
   ```

4. **Subir a API**

   ```bash
   pnpm dev
   ```

   A API fica em `http://localhost:3333/api/v1`.

## Comandos úteis

| Comando | Descrição |
|--------|-----------|
| `pnpm dev` | Desenvolvimento com hot-reload |
| `pnpm build` | Build de produção |
| `pnpm start` | Rodar a partir do build |
| `pnpm test` | Testes |
| `npx prisma migrate dev` | Criar/aplicar migrations (dev) |
| `npx prisma migrate deploy` | Aplicar migrations (produção) |
| `npx prisma generate` | Regenerar client Prisma |
| `npx prisma studio` | Interface visual do banco |

## Endpoints principais (singular; auth/health em inglês)

- **Health:** `GET /api/v1/health`
- **Auth:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/recuperar-senha`
- **Parâmetros (público):** `GET /api/v1/parametros` (todos) ou `GET /api/v1/parametros/finalidade`, `tipoimovel`, `tipocasa`, `mobilia`, `feature`, `plano`, `compraoualuguel` — use os **IDs** (campo `id`) retornados nos payloads de cadastro de interesse e no filtro de leads (`tipoImovelId`). Para compra/aluguel use o campo `valor`.
- **Usuário (perfil):** `GET /api/v1/usuario/eu`, `PATCH /api/v1/usuario/eu`
- **Interesse (cliente):** `GET/POST/PATCH/DELETE /api/v1/interesse`, `GET/PATCH/DELETE /api/v1/interesse/:id`
- **Prospecto (corretor):** `GET /api/v1/prospecto`, `GET/PATCH /api/v1/prospecto/:id`
- **Conversa:** `GET/POST /api/v1/conversa`, `GET /api/v1/conversa/:id`, `POST /api/v1/conversa/:id/mensagem`
- **Corretor (público):** `GET /api/v1/corretor`

Contratos completos em [API-BACKEND-SPEC.md](../API-BACKEND-SPEC.md).

## Estrutura (NestJS)

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── prisma/
├── auth/
├── users/
├── interests/
├── leads/
├── conversations/
├── brokers/
└── common/          # guards, filters, decorators
```

## Segurança

- Autenticação JWT em rotas protegidas
- Autorização por tipo de usuário (`client` / `broker`) com `RolesGuard`
- CORS restrito a `FRONTEND_URL`
- Rate limiting (Throttler)
- Validação de entrada com class-validator
- Respostas de erro padronizadas (`code`, `message`)

## Deploy

### Deploy na Vercel (recomendado para esta API)

A API está configurada para rodar na Vercel como **serverless function** (NestJS + Fastify em um único handler).

1. **Requisitos**
   - Conta na [Vercel](https://vercel.com)
   - Repositório Git com a pasta `api` (ou monorepo com root do projeto na pasta `api`)
   - Banco PostgreSQL acessível pela internet (ex.: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))

2. **Criar o projeto na Vercel**
   - Em [vercel.com/new](https://vercel.com/new), importe o repositório.
   - Defina o **Root Directory** como `api` (se o backend estiver dentro da pasta `api` no repo).
   - Framework Preset: **Other** (não use Next.js / Create React App).

3. **Variáveis de ambiente** (Settings → Environment Variables)

   | Variável        | Obrigatório | Descrição |
   |-----------------|-------------|-----------|
   | `DATABASE_URL`  | Sim         | URL PostgreSQL (ex.: `postgresql://user:pass@host:5432/db?sslmode=require`) |
   | `JWT_SECRET`    | Sim         | Chave secreta forte para JWT (produção) |
   | `FRONTEND_URL`  | Recomendado | URL do frontend para CORS (ex.: `https://seu-app.vercel.app`) |
   | `JWT_EXPIRES_IN`| Não         | Ex.: `7d` (padrão) |
   | `NODE_ENV`      | Não         | Defina `production` em produção |

4. **Migrations no primeiro deploy (ou após mudanças no schema)**
   - Na Vercel, o build já roda `prisma generate` e `nest build`.
   - Para aplicar migrations no banco de produção, use **uma** das opções:
     - **Opção A:** No painel do projeto → Settings → General → Build Command:  
       `npx prisma migrate deploy && npm run build`  
       (assim as migrations rodam em todo deploy).
     - **Opção B:** Rodar manualmente antes do deploy:  
       `DATABASE_URL="sua-url-prod" npx prisma migrate deploy`

5. **Deploy**
   - Push para a branch conectada ou use o CLI: `npx vercel --prod` (na pasta `api`).
   - A API ficará em `https://seu-projeto.vercel.app/api/v1` (health: `GET /api/v1/health`, docs: `GET /api/v1/docs`).

6. **Limites e dicas**
   - Função serverless: timeout padrão 30s (configurado em `vercel.json`), tamanho máximo 250MB.
   - Cold start: a primeira requisição pode ser mais lenta; as seguintes reutilizam a instância (Fluid compute).
   - Use um PostgreSQL em nuvem com SSL e IP liberado (ou connection pooler como PgBouncer).

### Deploy em outros provedores (Railway, Render, etc.)

1. Configurar variáveis de ambiente no provedor.
2. Build: `pnpm build` (ou `npm run build`).
3. Migrations: `npx prisma migrate deploy`.
4. Start: `node dist/main.js` (ou `pnpm start`).
5. Garantir que `GET /api/v1/health` retorne 200 para o health check do provedor.
