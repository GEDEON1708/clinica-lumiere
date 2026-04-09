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
- VITE_BOOKING_WEBHOOK_URL
- VITE_BOOKING_WEBHOOK_PROVIDER

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

## Integração com Calendário Externo

O projeto já está preparado para sincronizar reservas com uma agenda real sem acoplar segredo no front-end.

Estratégia recomendada:

1. O site salva a reserva no Supabase.
2. A aplicação envia um webhook com os dados da reserva.
3. Seu backend, Edge Function, n8n, Make ou outro orquestrador cria ou atualiza o evento no calendário.
4. A resposta da integração retorna status, provedor, horário sincronizado e identificador externo do evento.

Essa abordagem permite integrar com:

- Google Calendar
- Outlook Calendar
- Cal.com
- n8n
- Make
- backend próprio em Node, Nest, Laravel ou outro stack

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
