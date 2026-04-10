import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Testimonials from '@/src/components/Testimonials';
import { CLINIC_INFO, DIFFERENTIALS, SALES_POINTS, SERVICES, TRUST_NUMBERS } from '@/src/constants';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative px-4 pb-18 pt-28 sm:px-6 md:pb-20 md:pt-40">
        <div className="absolute inset-x-0 top-0 -z-10 h-180 bg-[radial-gradient(circle_at_top_right,rgba(183,134,69,0.2),transparent_30%),linear-gradient(180deg,rgba(255,249,241,0.95),rgba(247,240,232,0.72))]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold shadow-[0_12px_24px_rgba(183,134,69,0.08)] sm:text-[11px] sm:tracking-[0.3em]">
              <Sparkles size={14} />
              Estética premium em Recife
            </span>
            <h1 className="serif text-4xl leading-[0.96] text-ink sm:text-6xl md:text-7xl xl:text-[5.75rem]">
              Resultados que valorizam
              <span className="block italic text-gold">sua beleza com sofisticação.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-brown/72 sm:mt-8 sm:text-lg sm:leading-8">
              Protocolos faciais e corporais desenhados para quem quer mais autoestima, mais presença e um atendimento comercialmente impecável do primeiro contato ao pós-procedimento.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SALES_POINTS.map((point) => (
                <div key={point} className="section-card rounded-2xl px-4 py-4 text-sm leading-6 text-brown/72">
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/agendamento"
                className="button-primary inline-flex items-center justify-center rounded-full px-7 py-4 text-[11px] font-bold uppercase tracking-[0.24em] transition-all sm:px-8 sm:tracking-[0.28em]"
              >
                Agendar avaliação
              </Link>
              <Link
                to="/servicos"
                className="button-secondary inline-flex items-center justify-center rounded-full px-7 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-brown transition-all sm:px-8 sm:tracking-[0.28em]"
              >
                Explorar serviços
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {TRUST_NUMBERS.map((item) => (
                <div key={item.value} className="rounded-[28px] border border-white/45 bg-white/66 px-5 py-5 shadow-[0_16px_36px_rgba(60,35,24,0.08)] backdrop-blur-sm">
                  <p className="serif text-3xl italic text-gold">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-brown/70">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
            className="relative"
          >
            <div className="absolute -left-8 top-12 hidden h-56 w-56 rounded-full bg-gold/12 blur-3xl lg:block" />
            <div className="absolute -bottom-10 right-0 hidden h-64 w-64 rounded-full bg-rose/15 blur-3xl lg:block" />

            <div className="relative ml-auto max-w-full lg:max-w-140">
              <div className="absolute left-4 top-4 z-10 hidden w-52 rounded-[28px] border border-white/55 bg-white/78 p-4 shadow-[0_18px_40px_rgba(60,35,24,0.12)] backdrop-blur-sm lg:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Localização</p>
                <p className="mt-3 text-sm leading-6 text-brown/72">{CLINIC_INFO.neighborhood}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-brown/62">
                  <MapPin size={16} className="text-gold" />
                  <span>Atendimento reservado</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-white/45 bg-white/35 p-2.5 shadow-[0_28px_80px_rgba(60,35,24,0.16)] backdrop-blur-sm sm:rounded-[34px] sm:p-3">
                <div className="relative aspect-4/5 overflow-hidden rounded-[28px]">
                  <img
                    src="https://images.unsplash.com/photo-1731514721772-329626f84c8b?q=80&w=1400&auto=format&fit=crop"
                    alt="Recepção elegante de clínica de estética"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1f140f]/55 via-transparent to-white/10" />
                  <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:bottom-5 sm:left-5 sm:right-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/20 bg-white/14 p-4 backdrop-blur-md">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/72">Contato</p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-white">
                        <Phone size={16} className="text-gold-soft" />
                        <span>{CLINIC_INFO.phone}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/14 p-4 backdrop-blur-md">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/72">Disponibilidade</p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-white">
                        <CalendarDays size={16} className="text-gold-soft" />
                        <span>Agenda com confirmação rápida</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl rounded-[40px] border border-white/45 bg-white/70 p-8 shadow-[0_24px_70px_rgba(60,35,24,0.08)] backdrop-blur-sm md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Por que escolher a Lumière</span>
              <h2 className="serif mt-4 text-4xl italic text-ink md:text-5xl">Uma experiência que converte cuidado em desejo de retorno.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {DIFFERENTIALS.map((item) => (
                <div key={item.title} className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(247,240,232,0.9))] p-6 soft-ring">
                  <div className="mb-4 inline-flex rounded-full bg-gold/10 p-3 text-gold">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="serif text-2xl italic text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brown/72">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Tratamentos em destaque</span>
              <h2 className="serif mt-4 text-3xl italic text-ink sm:text-4xl md:text-5xl">Os protocolos mais buscados por quem quer resultado com elegância.</h2>
            </div>
            <Link to="/servicos" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold transition-transform hover:translate-x-1">
              <span>Ver portfólio completo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {SERVICES.slice(0, 3).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-[34px] border border-white/45 bg-white/72 p-4 shadow-[0_20px_55px_rgba(60,35,24,0.08)]"
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-[28px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#211611]/55 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur-md">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">{service.duration}</p>
                    <h3 className="serif mt-2 text-2xl italic text-white">{service.title}</h3>
                  </div>
                </div>
                <div className="px-2 pb-2 pt-6">
                  <p className="text-sm leading-7 text-brown/70">{service.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold">{service.price}</span>
                    <Link to={`/agendamento?service=${service.id}`} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-brown transition-colors hover:text-gold">
                      <span>Reservar</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative">
            <div className="animated-gradient absolute inset-6 rounded-[40px] blur-2xl" />
            <div className="relative overflow-hidden rounded-[40px] border border-white/45 bg-white/55 p-4 shadow-[0_26px_70px_rgba(60,35,24,0.08)] backdrop-blur-sm">
              <div className="overflow-hidden rounded-4xl">
                <img
                  src="https://images.unsplash.com/photo-1713085085470-fba013d67e65?q=80&w=1400&auto=format&fit=crop"
                  alt="Procedimento estético facial em clínica premium"
                  className="aspect-4/5 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Nossa proposta</span>
            <h2 className="serif text-3xl italic leading-tight text-ink sm:text-4xl md:text-5xl">Beleza natural, atendimento consultivo e decisão de compra com mais confiança.</h2>
            <p className="text-lg leading-8 text-brown/72">
              A Lumière foi desenhada para unir excelência técnica, ambientação refinada e uma jornada de atendimento clara. Cada passo comunica valor: da recepção ao protocolo indicado, da explicação de investimento ao acompanhamento do resultado.
            </p>
            <Link to="/sobre-nos" className="button-secondary inline-flex rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-brown transition-all">
              Conhecer a clínica
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="px-4 pb-20 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-4xl bg-[linear-gradient(135deg,#c69b61_0%,#a97434_52%,#8f5f2b_100%)] px-6 py-12 text-center text-white shadow-[0_28px_70px_rgba(167,116,52,0.35)] md:rounded-[40px] md:px-12 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/72">Pronta para viver essa experiência</p>
          <h2 className="serif mt-4 text-3xl italic sm:text-4xl md:text-6xl">Seu próximo cuidado pode começar hoje.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
            Reserve um horário, receba confirmação rápida e descubra o protocolo ideal para o seu objetivo em {CLINIC_INFO.neighborhood}.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/agendamento"
              className="cta-button-light inline-flex min-w-55 items-center justify-center rounded-full px-8 py-4 text-center text-[11px] font-bold uppercase tracking-[0.28em]"
            >
              Agendar agora
            </Link>
            <a href={`tel:${CLINIC_INFO.phone.replace(/\D/g, '')}`} className="rounded-full border border-white/35 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-white/10">
              Falar com a equipe
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
