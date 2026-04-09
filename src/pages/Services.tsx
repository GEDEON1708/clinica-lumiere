import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '@/src/constants';

const Services = () => {
  return (
    <div className="px-4 pb-20 pt-28 sm:px-6 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Portfólio de tratamentos</span>
          <h1 className="serif mt-4 text-4xl italic text-ink sm:text-5xl md:text-7xl">Protocolos desenhados para vender resultado com naturalidade.</h1>
          <p className="mt-6 text-base leading-7 text-brown/70 sm:text-lg sm:leading-8">
            Escolha entre procedimentos faciais e corporais com abordagem consultiva, investimento transparente e acompanhamento pensado para performance e satisfação.
          </p>
        </div>

        <div className="space-y-20">
          {SERVICES.map((service, index) => (
            <motion.section
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              viewport={{ once: true }}
              className={`grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center ${index % 2 === 1 ? 'lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1' : ''}`}
            >
              <div className="relative">
                <div className="overflow-hidden rounded-[38px] border border-white/45 bg-white/60 p-4 shadow-[0_24px_70px_rgba(60,35,24,0.1)]">
                  <div className="relative overflow-hidden rounded-[28px]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="aspect-4/5 w-full object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1c130f]/40 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="mt-4 ml-auto w-fit rounded-3xl border border-white/45 bg-white/82 px-5 py-4 text-right shadow-[0_18px_40px_rgba(60,35,24,0.12)] backdrop-blur-sm sm:absolute sm:bottom-6 sm:right-6 sm:mt-0">
                  <p className="serif text-3xl italic text-gold">{service.price}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brown/40">Investimento inicial</p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="inline-flex items-center gap-3 rounded-full border border-gold/15 bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  <Sparkles size={14} />
                  Procedimento premium
                </div>

                <div>
                  <h2 className="serif text-3xl italic text-ink sm:text-4xl md:text-5xl">{service.title}</h2>
                  <p className="mt-5 text-base leading-7 text-brown/72 sm:text-lg sm:leading-8">{service.longDescription}</p>
                </div>

                <div className="grid gap-4 rounded-[28px] border border-brown/8 bg-white/72 p-6 md:grid-cols-[auto_auto_1fr] md:items-center">
                  <div className="flex items-center gap-3 text-sm text-brown/70">
                    <Clock3 size={18} className="text-gold" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-brown/70">
                    <Check size={18} className="text-gold" />
                    <span>Indicação personalizada</span>
                  </div>
                  <div className="text-sm text-brown/58">Plano orientado por objetivo, anatomia e rotina da paciente.</div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="rounded-3xl bg-cream/78 px-4 py-4 text-sm leading-6 text-brown/72">
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  {service.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="rounded-3xl border border-white/50 bg-white/75 px-5 py-4 text-sm leading-7 text-brown/70 shadow-[0_12px_30px_rgba(60,35,24,0.05)]">
                      “{testimonial.content}”
                      <span className="ml-2 font-semibold text-ink">{testimonial.author}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/agendamento?service=${service.id}`}
                  className="button-primary inline-flex w-full justify-center rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.28em] transition-all sm:w-auto"
                >
                  Reservar este protocolo
                </Link>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
