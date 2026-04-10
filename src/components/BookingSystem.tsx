import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '@/src/constants';
import {
  createBooking,
  getBookingStorageMode,
  listBookings,
  type BookingRecord,
} from '@/src/lib/bookings';
import { bookingCalendarConfig, getBookingSyncLabel } from '@/src/lib/bookingIntegration';
import { cn } from '@/src/lib/utils';

type FormData = {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

const defaultFormData: FormData = {
  serviceId: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
};

const weekdayTimes = ['08:00', '09:00', '10:00', '11:00', '13:30', '15:00', '16:30', '18:00'];
const saturdayTimes = ['09:00', '10:00', '11:00', '12:00', '13:00'];

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateLabel = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${date}T12:00:00`));

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const getAvailableBaseTimes = (date: string) => {
  if (!date) return [];

  const day = new Date(`${date}T12:00:00`).getDay();

  if (day === 0) return [];

  return day === 6 ? saturdayTimes : weekdayTimes;
};

const isPastSlot = (date: string, time: string) => {
  const now = new Date();
  const selected = new Date(`${date}T${time}:00`);

  return selected.getTime() <= now.getTime();
};

interface BookingSystemProps {
  initialServiceId?: string;
}

const BookingSystem = ({ initialServiceId }: BookingSystemProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => ({
    ...defaultFormData,
    serviceId: initialServiceId ?? '',
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');

  const storageMode = getBookingStorageMode();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoadingBookings(true);
        const nextBookings = await listBookings();
        setBookings(nextBookings);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Não foi possível carregar a agenda.';
        setRequestError(message);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, []);

  useEffect(() => {
    if (initialServiceId) {
      setFormData((current) => ({ ...current, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  const selectedService = useMemo(
    () => SERVICES.find((service) => service.id === formData.serviceId) ?? null,
    [formData.serviceId]
  );

  const bookedTimes = useMemo(
    () =>
      bookings
        .filter((booking) => booking.date === formData.date && booking.status !== 'cancelled')
        .map((booking) => booking.time),
    [bookings, formData.date]
  );

  const availableTimes = useMemo(() => {
    const baseTimes = getAvailableBaseTimes(formData.date);
    return baseTimes.filter((time) => !bookedTimes.includes(time) && !isPastSlot(formData.date, time));
  }, [bookedTimes, formData.date]);

  useEffect(() => {
    if (formData.time && !availableTimes.includes(formData.time)) {
      setFormData((current) => ({ ...current, time: '' }));
    }
  }, [availableTimes, formData.time]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setRequestError('');
  };

  const validateStep = () => {
    const nextErrors: FieldErrors = {};

    if (step === 1 && !formData.serviceId) {
      nextErrors.serviceId = 'Selecione um tratamento para continuar.';
    }

    if (step === 2) {
      if (!formData.date) {
        nextErrors.date = 'Escolha a data desejada.';
      } else if (getAvailableBaseTimes(formData.date).length === 0) {
        nextErrors.date = 'Não trabalhamos aos domingos. Escolha outro dia.';
      }

      if (!formData.time) {
        nextErrors.time = 'Selecione um horário disponível.';
      }
    }

    if (step === 3) {
      if (!formData.name.trim()) {
        nextErrors.name = 'Informe seu nome completo.';
      }

      if (formData.phone.replace(/\D/g, '').length < 10) {
        nextErrors.phone = 'Informe um WhatsApp válido.';
      }

      if (!isValidEmail(formData.email)) {
        nextErrors.email = 'Informe um e-mail válido.';
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep() || !selectedService) {
      return;
    }

    try {
      setSubmitting(true);
      setRequestError('');

      const newBooking = await createBooking({
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        serviceDuration: selectedService.duration,
        date: formData.date,
        time: formData.time,
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email.trim(),
        notes: formData.notes.trim(),
      });

      setBookings((current) => [...current, newBooking]);
      setConfirmedBooking(newBooking);
      setStep(4);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir a reserva.';
      setRequestError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }

    if (step === 3) {
      await handleSubmit();
      return;
    }

    setStep((current) => current + 1);
  };

  const handleReset = () => {
    setStep(1);
    setErrors({});
    setConfirmedBooking(null);
    setFormData({
      ...defaultFormData,
      serviceId: initialServiceId ?? '',
    });
  };

  const summaryMessage = confirmedBooking
    ? `Olá! Acabei de solicitar meu agendamento na Lumière.%0A%0AProtocolo: ${confirmedBooking.id}%0ANome: ${confirmedBooking.name}%0AProcedimento: ${confirmedBooking.serviceTitle}%0AData: ${formatDateLabel(confirmedBooking.date)}%0AHorário: ${confirmedBooking.time}%0AEmail: ${confirmedBooking.email}`
    : '';

  const whatsappUrl = confirmedBooking
    ? `https://wa.me/${CLINIC_INFO.whatsappDigits}?text=${summaryMessage}`
    : '#';

  return (
    <div className="grid overflow-hidden rounded-[38px] border border-white/45 bg-white/76 shadow-[0_28px_80px_rgba(60,35,24,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="bg-[linear-gradient(180deg,#2f211c_0%,#1b130f_100%)] p-6 text-white sm:p-8 md:p-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-soft">Agendamento funcional</span>
        <h2 className="serif mt-4 text-3xl italic sm:text-4xl">Reserve seu horário com confirmação real.</h2>
        <p className="mt-5 text-sm leading-7 text-white/72">
          Escolha o protocolo, consulte a disponibilidade em tempo real nesta sessão e envie sua solicitação com os dados já prontos para confirmação no WhatsApp.
        </p>

        <div className="mt-6 rounded-3xl border border-white/12 bg-white/6 px-4 py-4 text-sm leading-7 text-white/72">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">
            {storageMode === 'supabase' ? 'Banco Supabase ativo' : 'Modo fallback local'}
          </span>
          <p className="mt-2">
            {storageMode === 'supabase'
              ? 'As reservas já estão sendo persistidas em banco real e aparecem no painel de reservas.'
              : 'O fluxo continua funcional neste ambiente e muda automaticamente para banco real quando as credenciais forem configuradas.'}
          </p>
        </div>

        <div className="mt-4 rounded-3xl border border-white/12 bg-white/6 px-4 py-4 text-sm leading-7 text-white/72">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">
            {bookingCalendarConfig.enabled ? `Integração ${bookingCalendarConfig.providerLabel} ativa` : 'Calendário externo pronto para ativação'}
          </span>
          <p className="mt-2">
            {bookingCalendarConfig.enabled
              ? 'Cada nova reserva pode ser enviada automaticamente para o fluxo externo configurado, permitindo criar evento, confirmar horário e sincronizar o operacional.'
              : 'Quando o webhook externo for configurado, o sistema poderá encaminhar a reserva para Google Calendar, Outlook, Cal.com, n8n, Make ou outro orquestrador.'}
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {[
            { number: '1', label: 'Escolha do tratamento' },
            { number: '2', label: 'Data e horário disponível' },
            { number: '3', label: 'Dados e confirmação' },
          ].map((item, index) => (
            <div key={item.number} className={cn('flex items-center gap-3 rounded-3xl border px-4 py-4 transition-opacity sm:gap-4', step >= index + 1 ? 'border-gold/30 bg-white/8 opacity-100' : 'border-white/10 opacity-55')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-[11px] font-bold uppercase tracking-[0.24em]">
                {item.number}
              </div>
              <span className="text-[12px] uppercase tracking-[0.16em] text-white/80 sm:text-sm sm:tracking-[0.24em]">{item.label}</span>
            </div>
          ))}
        </div>

        {selectedService ? (
          <div className="mt-8 rounded-[28px] border border-white/12 bg-white/6 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">Protocolo selecionado</p>
            <h3 className="serif mt-3 text-3xl italic">{selectedService.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">{selectedService.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-white/72">
              <span>{selectedService.duration}</span>
              <span>{selectedService.price}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-8 rounded-[28px] border border-white/12 bg-white/6 p-5 text-sm leading-7 text-white/72">
          <div className="mb-3 flex items-center gap-3 text-gold-soft">
            <ShieldCheck size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">Atendimento com privacidade</span>
          </div>
          {storageMode === 'supabase'
            ? 'As solicitações entram no banco em tempo real e podem ser gerenciadas pelo painel operacional.'
            : 'As solicitações ficam gravadas no navegador desta demonstração, permitindo bloqueio de horários já reservados antes da configuração do banco real.'}
        </div>
      </aside>

      <div className="p-6 sm:p-8 md:p-10">
        {requestError ? (
          <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {requestError}
          </div>
        ) : null}

        {loadingBookings ? (
          <div className="mb-6 rounded-3xl border border-brown/8 bg-cream/60 px-4 py-4 text-sm text-brown/64">
            Carregando disponibilidade da agenda...
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Etapa 1</p>
                <h3 className="serif mt-3 text-3xl italic text-ink sm:text-4xl">Qual procedimento você quer reservar?</h3>
              </div>
              <div className="grid gap-3">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => updateField('serviceId', service.id)}
                    className={cn(
                      'rounded-[26px] border p-5 text-left transition-all',
                      formData.serviceId === service.id
                        ? 'border-gold/45 bg-gold/8 shadow-[0_16px_30px_rgba(183,134,69,0.12)]'
                        : 'border-brown/8 bg-white hover:border-gold/28'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-ink">{service.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-brown/68">{service.description}</p>
                      </div>
                      {formData.serviceId === service.id ? <CheckCircle2 size={20} className="shrink-0 text-gold" /> : null}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-brown/45">
                      <span>{service.duration}</span>
                      <span>{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.serviceId ? <p className="text-sm text-rose-600">{errors.serviceId}</p> : null}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Etapa 2</p>
                <h3 className="serif mt-3 text-3xl italic text-ink sm:text-4xl">Escolha a melhor data e um horário livre.</h3>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
                <div className="rounded-[28px] border border-brown/8 bg-white p-5 shadow-[0_16px_36px_rgba(60,35,24,0.05)]">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brown/45">Data da visita</label>
                  <div className="relative mt-4">
                    <Calendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                    <input
                      type="date"
                      min={getTodayString()}
                      value={formData.date}
                      onChange={(event) => updateField('date', event.target.value)}
                      className="w-full rounded-2xl border border-brown/10 bg-cream/60 py-4 pl-12 pr-4 text-brown outline-none transition-colors focus:border-gold"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-brown/65">
                    Horários de segunda a sexta, das 08h às 20h, e sábado até 15h. Domingo indisponível.
                  </p>
                  {errors.date ? <p className="mt-3 text-sm text-rose-600">{errors.date}</p> : null}
                </div>

                <div className="rounded-[28px] border border-brown/8 bg-white p-5 shadow-[0_16px_36px_rgba(60,35,24,0.05)]">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brown/45">Horários disponíveis</label>
                    {formData.date ? <span className="text-[10px] uppercase tracking-[0.18em] text-gold sm:text-[11px] sm:tracking-[0.24em]">{formatDateLabel(formData.date)}</span> : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {availableTimes.length > 0 ? (
                      availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => updateField('time', time)}
                          className={cn(
                            'rounded-2xl border px-4 py-4 text-sm font-semibold transition-all',
                            formData.time === time
                              ? 'border-gold bg-gold text-white shadow-[0_14px_28px_rgba(183,134,69,0.25)]'
                              : 'border-brown/10 bg-cream/40 text-brown/72 hover:border-gold/35'
                          )}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full rounded-3xl bg-cream/70 px-5 py-6 text-sm leading-7 text-brown/68">
                        {formData.date
                          ? 'Não há horários livres para esta data. Escolha outro dia para seguir.'
                          : 'Selecione uma data para visualizar a agenda disponível.'}
                      </div>
                    )}
                  </div>
                  {errors.time ? <p className="mt-4 text-sm text-rose-600">{errors.time}</p> : null}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Etapa 3</p>
                <h3 className="serif mt-3 text-3xl italic text-ink sm:text-4xl">Preencha seus dados para concluir a reserva.</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative md:col-span-2">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="w-full rounded-3xl border border-brown/10 bg-white px-12 py-4 outline-none transition-colors focus:border-gold"
                  />
                  {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
                </div>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="tel"
                    placeholder="WhatsApp"
                    value={formData.phone}
                    onChange={(event) => updateField('phone', formatPhone(event.target.value))}
                    className="w-full rounded-3xl border border-brown/10 bg-white px-12 py-4 outline-none transition-colors focus:border-gold"
                  />
                  {errors.phone ? <p className="mt-2 text-sm text-rose-600">{errors.phone}</p> : null}
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="w-full rounded-3xl border border-brown/10 bg-white px-12 py-4 outline-none transition-colors focus:border-gold"
                  />
                  {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <textarea
                    rows={4}
                    placeholder="Se quiser, descreva seu objetivo ou alguma preferência de atendimento."
                    value={formData.notes}
                    onChange={(event) => updateField('notes', event.target.value)}
                    className="w-full rounded-3xl border border-brown/10 bg-white px-5 py-4 outline-none transition-colors focus:border-gold"
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-gold/16 bg-cream/70 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Resumo da reserva</p>
                <div className="mt-4 grid gap-3 text-sm leading-7 text-brown/72 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-ink">Procedimento:</span> {selectedService?.title}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Investimento:</span> {selectedService?.price}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Data:</span> {formData.date ? formatDateLabel(formData.date) : '-'}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Horário:</span> {formData.time || '-'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && confirmedBooking && (
            <motion.div key="step-4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={38} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Reserva registrada</p>
                <h3 className="serif mt-3 text-3xl italic text-ink sm:text-4xl">Horário solicitado com sucesso.</h3>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-brown/72">
                  Obrigado, {confirmedBooking.name.split(' ')[0]}. Sua solicitação foi salva com o protocolo {confirmedBooking.id}. O próximo passo é enviar a confirmação para a equipe no WhatsApp.
                </p>
              </div>

              <div className="rounded-[30px] border border-brown/8 bg-cream/70 p-5 text-sm leading-7 text-brown/72">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Status da agenda externa</p>
                <p className="mt-3">
                  {getBookingSyncLabel(confirmedBooking.calendarSyncStatus)}
                  {confirmedBooking.calendarProvider !== 'none' ? ` via ${confirmedBooking.calendarProvider}.` : '.'}
                </p>
                {confirmedBooking.calendarSyncStatus === 'synced' ? (
                  <p className="mt-2 text-brown/64">
                    A reserva já foi enviada para a integração externa e está pronta para seguir o fluxo operacional.
                  </p>
                ) : null}
                {confirmedBooking.calendarSyncStatus === 'failed' && confirmedBooking.syncError ? (
                  <p className="mt-2 text-rose-600">{confirmedBooking.syncError}</p>
                ) : null}
                {confirmedBooking.calendarSyncStatus === 'not_configured' ? (
                  <p className="mt-2 text-brown/64">
                    O agendamento ficou salvo normalmente, mas a sincronização com calendário ainda não foi ativada neste ambiente.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 rounded-[30px] border border-brown/8 bg-white p-6 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Detalhes</p>
                  <div className="mt-4 grid gap-2 text-sm leading-7 text-brown/72">
                    <span><strong>Procedimento:</strong> {confirmedBooking.serviceTitle}</span>
                    <span><strong>Data:</strong> {formatDateLabel(confirmedBooking.date)}</span>
                    <span><strong>Horário:</strong> {confirmedBooking.time}</span>
                    <span><strong>Contato:</strong> {confirmedBooking.phone}</span>
                  </div>
                </div>
                <div className="rounded-3xl bg-cream/75 p-5 text-sm leading-7 text-brown/72">
                  {storageMode === 'supabase'
                    ? 'Sua reserva já foi persistida no banco e pode ser acompanhada no painel de reservas.'
                    : 'Sua reserva ficou registrada localmente nesta demonstração. Se você tentar selecionar o mesmo horário novamente, ele aparecerá como indisponível.'}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.28em] transition-all sm:flex-1"
                >
                  <MessageCircle size={18} />
                  Confirmar no WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="button-secondary rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-brown transition-all sm:flex-1"
                >
                  Fazer novo agendamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 ? (
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-brown/8 pt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brown/52 transition-colors hover:text-brown"
              >
                Voltar
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => {
                void handleNext();
              }}
              disabled={submitting || loadingBookings}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-4 text-[11px] font-bold uppercase tracking-[0.22em] transition-all sm:px-8 sm:tracking-[0.28em]',
                submitting || loadingBookings ? 'cursor-wait bg-brown/30 text-white' : 'button-primary'
              )}
            >
              <span>
                {submitting ? 'Enviando...' : step === 3 ? 'Concluir reserva' : 'Continuar'}
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingSystem;
