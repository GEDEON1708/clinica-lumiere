import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, MapPin, Shield, Sparkles } from 'lucide-react';
import { CLINIC_INFO, DIFFERENTIALS, TRUST_NUMBERS } from '@/src/constants';

const About = () => {
  return (
    <div className="px-4 pb-20 pt-28 sm:px-6 md:pb-24 md:pt-32">
      <section className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Sobre a clínica</span>
          <h1 className="serif text-4xl italic leading-tight text-ink sm:text-5xl md:text-7xl">Excelência, acolhimento e decisão guiada por critério estético.</h1>
          <p className="text-base leading-7 text-brown/72 sm:text-lg sm:leading-8">
            A Lumière nasceu para atender pacientes que desejam mais do que um procedimento: querem orientação segura, ambiente sofisticado e uma entrega coerente com o investimento feito.
          </p>
          <p className="text-base leading-7 text-brown/72 sm:text-lg sm:leading-8">
            Em Boa Viagem, reunimos avaliação consultiva, tecnologia atualizada e um plano de atendimento que valoriza naturalidade, continuidade e relacionamento de longo prazo.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {TRUST_NUMBERS.map((item) => (
              <div key={item.value} className="rounded-[28px] border border-white/45 bg-white/72 px-5 py-5 shadow-[0_18px_45px_rgba(60,35,24,0.08)]">
                <p className="serif text-3xl italic text-gold">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-brown/70">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute -left-6 top-8 hidden h-48 w-48 rounded-full bg-gold/12 blur-3xl lg:block" />
          <div className="overflow-hidden rounded-[42px] border border-white/50 bg-white/60 p-4 shadow-[0_28px_70px_rgba(60,35,24,0.12)]">
            <div className="relative overflow-hidden rounded-4xl">
              <img
                src="https://images.unsplash.com/photo-1652903761255-4fbf11cff931?q=80&w=1400&auto=format&fit=crop"
                alt="Ambiente premium da clínica Lumière"
                className="aspect-4/5 w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1c130f]/50 to-transparent" />
            </div>
          </div>
          <div className="relative mt-4 rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-[0_18px_44px_rgba(60,35,24,0.12)] backdrop-blur-sm md:absolute md:-bottom-6 md:left-auto md:-right-5.5 md:mt-0 md:w-[320px]">
            <p className="serif text-2xl italic text-gold">“Atendimento premium só faz sentido quando o resultado também respeita a identidade da paciente.”</p>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-brown/50">Equipe Lumière</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-7xl rounded-[40px] border border-white/50 bg-white/72 p-8 shadow-[0_26px_70px_rgba(60,35,24,0.08)] md:p-10 lg:p-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Nossos pilares</span>
          <h2 className="serif mt-4 text-3xl italic text-ink sm:text-4xl md:text-5xl">Uma jornada estruturada para elevar segurança e percepção de valor.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { icon: Shield, title: 'Segurança', description: 'Protocolos rigorosos, orientação clara e insumos confiáveis para cada indicação.' },
            { icon: Heart, title: 'Personalização', description: 'Nada é padronizado: avaliamos anatomia, objetivo e timing para definir o melhor plano.' },
            { icon: Award, title: 'Performance', description: 'Tecnologia, técnica e acompanhamento para maximizar resultado e recorrência.' },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,240,232,0.95))] p-8 soft-ring">
                <div className="mb-5 inline-flex rounded-full bg-gold/10 p-3 text-gold">
                  <Icon size={24} />
                </div>
                <h3 className="serif text-3xl italic text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-brown/72">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-8 lg:mt-24 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="overflow-hidden rounded-[40px] bg-[linear-gradient(160deg,#2f211c_0%,#19120f_100%)] p-8 text-white md:p-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Diferenciais de atendimento</span>
          <div className="mt-8 grid gap-5">
            {DIFFERENTIALS.map((item) => (
              <div key={item.title} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="mb-3 inline-flex rounded-full bg-white/10 p-2 text-gold">
                  <Sparkles size={16} />
                </div>
                <h3 className="serif text-2xl italic">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[40px] border border-white/45 bg-white/74 shadow-[0_24px_70px_rgba(60,35,24,0.08)]">
          <div className="grid h-full lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-8 md:p-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Onde estamos</span>
              <h2 className="serif mt-4 text-3xl italic text-ink sm:text-4xl">No ponto mais desejado de Recife.</h2>
              <p className="mt-5 text-base leading-8 text-brown/72">
                Ambiente reservado, fácil acesso e estrutura pensada para que a paciente entre, seja atendida com privacidade e saia com a certeza de ter escolhido o lugar certo.
              </p>
              <div className="mt-8 rounded-[28px] bg-cream/80 p-5 text-sm leading-7 text-brown/72">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 shrink-0 text-gold" />
                  <span>{CLINIC_INFO.address}</span>
                </div>
              </div>
            </div>
            <div className="min-h-70 sm:min-h-85">
              <iframe
                src={CLINIC_INFO.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da clínica Lumière"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
