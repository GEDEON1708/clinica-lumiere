import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-6 pb-24 pt-32">
      <div className="mx-auto max-w-4xl rounded-[40px] border border-white/45 bg-white/76 p-8 shadow-[0_22px_60px_rgba(60,35,24,0.08)] md:p-12">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Privacidade</span>
        <h1 className="serif mt-4 text-4xl italic text-ink md:text-5xl">Política de privacidade</h1>
        <div className="mt-10 space-y-8 text-base leading-8 text-brown/72">
          <section>
            <h2 className="serif text-2xl italic text-ink">1. Coleta de dados</h2>
            <p className="mt-3">
              Utilizamos as informações fornecidas em formulários de contato e agendamento, como nome, telefone, e-mail e preferências de atendimento, apenas para organizar a jornada comercial e operacional da clínica.
            </p>
          </section>

          <section>
            <h2 className="serif text-2xl italic text-ink">2. Finalidade de uso</h2>
            <p className="mt-3">Os dados são usados para confirmar reservas, enviar orientações de atendimento, responder a solicitações e apresentar novidades ou condições comerciais quando houver autorização.</p>
          </section>

          <section>
            <h2 className="serif text-2xl italic text-ink">3. Proteção e armazenamento</h2>
            <p className="mt-3">Adotamos medidas técnicas e organizacionais para reduzir riscos de uso indevido, acesso não autorizado ou perda de informações pessoais.</p>
          </section>

          <section>
            <h2 className="serif text-2xl italic text-ink">4. Direitos do titular</h2>
            <p className="mt-3">Você pode solicitar atualização, correção ou exclusão de seus dados entrando em contato pelos canais oficiais da Lumière.</p>
          </section>

          <p className="border-t border-brown/8 pt-6 text-sm uppercase tracking-[0.24em] text-brown/42">Última atualização: 7 de abril de 2026.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
