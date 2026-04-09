import React from 'react';
import { motion } from 'motion/react';
import Testimonials from '@/src/components/Testimonials';

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen px-6 pb-16 pt-32">
      <div className="mx-auto mb-14 max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Resultados percebidos</span>
          <h1 className="serif mt-4 text-5xl italic text-ink md:text-7xl">Depoimentos que fortalecem a decisão de compra.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brown/70">
            Cada relato reforça a proposta da clínica: técnica segura, atendimento premium e resultados que mantêm a identidade da paciente.
          </p>
        </motion.div>
      </div>
      <Testimonials />
    </div>
  );
};

export default TestimonialsPage;
