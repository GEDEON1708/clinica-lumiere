import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { CLINIC_INFO, SALES_POINTS } from '@/src/constants';

const Footer = () => {
  return (
    <footer className="px-6 pb-8 pt-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#2f211c_0%,#1c1411_55%,#120d0b_100%)] px-6 py-12 text-white md:px-10 lg:px-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="serif text-2xl tracking-[0.35em] text-gold">{CLINIC_INFO.brandLabel}</span>
              <span className="text-[10px] uppercase tracking-[0.45em] text-white/45">{CLINIC_INFO.tagline}</span>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/68">
              Clínica premium em Recife para quem busca naturalidade, tecnologia e uma experiência de atendimento pensada para conversão em resultado real.
            </p>
            <div className="grid gap-3">
              {SALES_POINTS.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/78">
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="serif mb-6 text-lg italic text-gold">Mapa do site</h4>
            <div className="grid gap-3 text-sm text-white/68">
              <Link to="/" className="transition-colors hover:text-gold">Início</Link>
              <Link to="/sobre-nos" className="transition-colors hover:text-gold">Sobre nós</Link>
              <Link to="/servicos" className="transition-colors hover:text-gold">Serviços</Link>
              <Link to="/depoimentos" className="transition-colors hover:text-gold">Depoimentos</Link>
              <Link to="/agendamento" className="transition-colors hover:text-gold">Agendamento</Link>
            </div>
          </div>

          <div>
            <h4 className="serif mb-6 text-lg italic text-gold">Contato</h4>
            <div className="grid gap-4 text-sm text-white/68">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-gold" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <a href={`tel:${CLINIC_INFO.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Phone size={18} className="shrink-0 text-gold" />
                <span>{CLINIC_INFO.phone}</span>
              </a>
              <a href={`mailto:${CLINIC_INFO.email}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Mail size={18} className="shrink-0 text-gold" />
                <span>{CLINIC_INFO.email}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="serif mb-6 text-lg italic text-gold">Atendimento</h4>
            <div className="grid gap-3 text-sm text-white/68">
              {CLINIC_INFO.businessHours.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <a href={CLINIC_INFO.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/14 p-3 text-white/75 transition-colors hover:text-gold">
                <Instagram size={18} />
              </a>
              <a href={CLINIC_INFO.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-white/14 p-3 text-white/75 transition-colors hover:text-gold">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.22em] text-white/42 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            <Link to="/politica-de-privacidade" className="transition-colors hover:text-gold">Política de privacidade</Link>
            <span>© 2026 Lumière Estética. Todos os direitos reservados.</span>
          </div>
          <span>Desenvolvido pela Okapi Code Forge</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
