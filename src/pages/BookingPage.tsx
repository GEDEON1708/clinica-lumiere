import React from 'react';
import { motion } from 'motion/react';
import { Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import BookingSystem from '@/src/components/BookingSystem';
import { getBookingStorageMode } from '@/src/lib/bookings';
import { bookingCalendarConfig } from '@/src/lib/bookingIntegration';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('service') ?? undefined;
  const storageMode = getBookingStorageMode();

  return (
    <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Reserva online</span>
            <h1 className="serif mt-4 text-4xl italic text-ink sm:text-5xl md:text-7xl">Agende uma avaliação com fluxo claro, rápido e funcional.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brown/70 sm:text-lg sm:leading-8">
              Este formulário bloqueia horários ocupados, envia a reserva para banco real quando o Supabase estiver configurado e deixa a confirmação pronta para o WhatsApp da clínica.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: Sparkles, title: 'Seleção guiada', description: 'Serviço, data e horário em etapas objetivas.' },
              { icon: Clock3, title: 'Agenda inteligente', description: 'Horários indisponíveis deixam de aparecer para o mesmo dia.' },
              {
                icon: ShieldCheck,
                title: bookingCalendarConfig.enabled ? 'Calendário conectado' : 'Dados organizados',
                description: bookingCalendarConfig.enabled
                  ? `Integração ${bookingCalendarConfig.providerLabel} habilitada para acionar a agenda externa.`
                  : storageMode === 'supabase'
                    ? 'Reservas persistidas no banco e prontas para painel e integração futura.'
                    : 'Fallback local ativo até o Supabase e a integração externa serem configurados.',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[28px] border border-white/45 bg-white/72 p-5 shadow-[0_16px_36px_rgba(60,35,24,0.06)]">
                  <div className="mb-4 inline-flex rounded-full bg-gold/10 p-3 text-gold">
                    <Icon size={18} />
                  </div>
                  <h2 className="serif text-2xl italic text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-brown/68">{item.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <BookingSystem initialServiceId={initialServiceId} />
      </div>
    </div>
  );
};

export default BookingPage;
