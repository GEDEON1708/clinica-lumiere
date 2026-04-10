# Lumière Estética Avançada

Aplicação institucional premium desenvolvida para a Lumière Estética Avançada, com foco em apresentação comercial, experiência refinada, agendamento online e operação preparada para evoluir com calendário externo, autenticação administrativa e persistência real.

## Visão Geral

O projeto foi construído para unir posicionamento de marca, conversão comercial e base técnica sustentável. Além das páginas institucionais, a aplicação já inclui:

- vitrine de serviços com conteúdo comercial estruturado;
- fluxo de agendamento com bloqueio de horários ocupados;
- persistência local para demonstração e fallback operacional;
- persistência real com Supabase;
- painel administrativo para acompanhamento e atualização de status;
- camada pronta para sincronização com agenda externa por webhook.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- React Router
- Supabase

## Principais Funcionalidades

- Landing page comercial com identidade visual premium.
- Páginas institucionais para serviços, sobre, depoimentos e política de privacidade.
- Agendamento em etapas com validação de campos.
- Bloqueio de horários já reservados.
- Painel em /painel-reservas para operação administrativa.
- Suporte a autenticação no painel quando Supabase estiver ativo.
- Estrutura preparada para integração com Google Calendar, Outlook, Cal.com, n8n, Make ou backend próprio.

## Execução Local

### Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior

### Instalação

```bash
npm install
```

### Ambiente

Use o arquivo [.env.example](.env.example) como base e crie seu .env.local.

Variáveis disponíveis:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_BOOKING_WEBHOOK_PROVIDER
- VITE_BOOKING_SYNC_FUNCTION_NAME
- VITE_BOOKING_WEBHOOK_URL

### Desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

## Configuração do Supabase

Se quiser usar persistência real de reservas:

1. Crie um projeto no Supabase.
2. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
3. Execute o script [supabase/bookings.sql](supabase/bookings.sql) no SQL Editor.
4. Crie um usuário administrativo em Supabase Auth para acessar o painel.

Com isso, o site passa a salvar reservas no banco e o painel administrativo deixa de depender do fallback local.

## Integração Real com Google Calendar

O projeto agora inclui uma integração real com Google Calendar usando Supabase Edge Function e conta de serviço do Google, evitando expor credenciais no front-end.

### Como funciona

1. O site salva a reserva no Supabase.
2. O front invoca a Function google-calendar-sync com o bookingId.
3. A Function busca a reserva no banco com service role.
4. A Function cria ou atualiza o evento no Google Calendar.
5. O status da sincronização fica salvo na própria tabela bookings.

### O que configurar

1. Crie ou escolha um Google Calendar da clínica.
2. Crie uma Service Account no Google Cloud.
3. Compartilhe o calendário com o e-mail da Service Account com permissão para editar eventos.
4. Configure os secrets da Supabase Edge Function:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - GOOGLE_SERVICE_ACCOUNT_EMAIL
   - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
   - GOOGLE_CALENDAR_ID
   - GOOGLE_CALENDAR_TIMEZONE
   - GOOGLE_CALENDAR_LOCATION
5. Faça deploy da Function localizada em supabase/functions/google-calendar-sync.
6. Defina em .env.local:
   - VITE_BOOKING_WEBHOOK_PROVIDER=google-calendar
   - VITE_BOOKING_SYNC_FUNCTION_NAME=google-calendar-sync

### Observações

- A criação do evento usa a duração real do procedimento escolhido.
- Alterações de status também sincronizam com a agenda.
- Cancelamentos podem ser refletidos no evento do calendário.
- Se você preferir outro provedor, o fluxo por webhook genérico continua disponível.

## Rotas Relevantes

- /: página inicial
- /sobre-nos: apresentação institucional
- /servicos: portfólio de tratamentos
- /depoimentos: prova social
- /agendamento: fluxo principal de reserva
- /painel-reservas: painel administrativo
- /politica-de-privacidade: política de privacidade

## Estrutura do Projeto

```text
src/
   components/
   lib/
      bookingIntegration.ts
      bookings.ts
      bookingTypes.ts
      supabase.ts
   pages/
supabase/
   bookings.sql
   functions/
      google-calendar-sync/
```

## Direção de Arquitetura e Refatoração Futura

O projeto já foi organizado para facilitar crescimento sem reescrever a aplicação inteira. Os próximos passos naturais de refatoração são:

- separar regras de disponibilidade por serviço em uma camada dedicada de agenda;
- mover a integração de calendário para backend próprio ou Edge Functions autenticadas;
- criar módulos de domínio para reservas, catálogo, conteúdo institucional e autenticação;
- adicionar testes para fluxo de reserva e regras de disponibilidade;
- introduzir observabilidade para falhas de sincronização e operação do painel.

Essa base permite evoluir o projeto de site institucional para plataforma operacional sem trocar a interface já construída.

## Qualidade Atual

- identidade visual refinada e responsiva;
- textos revisados em português;
- imagens alinhadas com o contexto da clínica;
- build de produção validado;
- base pronta para publicação e evolução.

## Repositório

GitHub: https://github.com/GEDEON1708/clinica-lumiere
