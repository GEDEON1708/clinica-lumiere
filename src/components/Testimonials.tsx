import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { SERVICES } from '@/src/constants';

const Testimonials = () => {
  const allTestimonials = SERVICES.flatMap((service) =>
    service.testimonials.map((testimonial) => ({
      ...testimonial,
      service: service.title,
    }))
  );

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Prova social</span>
            <h2 className="serif mt-4 text-4xl italic text-ink md:text-5xl">Quem passa pela Lumière volta pela experiência e pelo resultado.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-brown/68">
            Depoimentos reais de pacientes que procuravam naturalidade, segurança e um atendimento premium do primeiro contato ao acompanhamento.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {allTestimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-4xl border border-white/45 bg-white/74 p-8 shadow-[0_22px_60px_rgba(60,35,24,0.08)]"
            >
              <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-[linear-gradient(90deg,rgba(183,134,69,0),rgba(183,134,69,0.9),rgba(183,134,69,0))]" />
              <Quote className="absolute right-8 top-7 text-gold/12 transition-colors duration-500 group-hover:text-gold/22" size={54} />
              <div className="mb-5 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                  <Star key={`${testimonial.id}-${starIndex}`} size={15} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="pr-6 text-base leading-8 text-brown/72">“{testimonial.content}”</p>
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-brown/8 pt-6">
                <div>
                  <h3 className="text-base font-semibold text-ink">{testimonial.author}</h3>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold">{testimonial.service}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-brown/40">{testimonial.date}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
