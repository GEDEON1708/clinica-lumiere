import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, CalendarDays, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { CLINIC_INFO } from '@/src/constants';

const navLinks = [
  { name: 'Início', path: '/' },
  { name: 'Sobre', path: '/sobre-nos' },
  { name: 'Serviços', path: '/servicos' },
  { name: 'Resultados', path: '/depoimentos' },
  { name: 'Agendamento', path: '/agendamento' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-3 py-3 transition-all duration-500 sm:px-4 md:px-6',
        scrolled ? 'glass py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="hidden lg:flex items-center justify-between pb-3 text-[11px] uppercase tracking-[0.28em] text-brown/65">
          <div className="flex items-center gap-3">
            <MapPin size={14} className="text-gold" />
            <span>{CLINIC_INFO.neighborhood}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`tel:${CLINIC_INFO.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-gold">
              <Phone size={14} className="text-gold" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
            <Link to="/agendamento" className="flex items-center gap-2 transition-colors hover:text-gold">
              <CalendarDays size={14} className="text-gold" />
              <span>Avaliação com horário reservado</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[28px] border border-white/40 bg-white/60 px-4 py-3 shadow-[0_12px_35px_rgba(60,35,24,0.08)] backdrop-blur-xl md:rounded-full md:px-6">
          <Link to="/" className="flex flex-col items-start">
            <span className="serif text-lg font-medium tracking-[0.22em] text-gold sm:text-xl md:text-2xl md:tracking-[0.35em]">{CLINIC_INFO.brandLabel}</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-brown/60 sm:text-[9px] md:text-[10px] md:tracking-[0.42em]">{CLINIC_INFO.tagline}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'nav-link text-[11px] font-semibold uppercase tracking-[0.28em]',
                  location.pathname === link.path ? 'active text-gold' : 'text-brown/75 hover:text-gold'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/agendamento"
              className="button-primary rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.28em] transition-all"
            >
              Reservar horário
            </Link>
          </div>

          <button
            type="button"
            className="text-brown md:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Abrir menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-3 rounded-[28px] border border-white/45 bg-white/92 p-5 shadow-[0_22px_60px_rgba(60,35,24,0.14)] md:hidden"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] transition-colors',
                      location.pathname === link.path
                        ? 'border-gold/40 bg-gold/8 text-gold'
                        : 'border-brown/10 text-brown/70'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid gap-3 text-sm text-brown/70">
                <a href={`tel:${CLINIC_INFO.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 rounded-2xl bg-cream/70 px-4 py-3">
                  <Phone size={18} className="text-gold" />
                  <span>{CLINIC_INFO.phone}</span>
                </a>
                <Link
                  to="/agendamento"
                  className="button-primary rounded-2xl px-4 py-4 text-center text-[11px] font-bold uppercase tracking-[0.26em] transition-all"
                >
                  Agendar avaliação
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
