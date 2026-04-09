import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { Session } from '@supabase/supabase-js';
import { CalendarDays, CheckCircle2, CircleAlert, Database, LoaderCircle, LockKeyhole, LogOut, ShieldCheck } from 'lucide-react';
import { bookingCalendarConfig, getBookingSyncLabel } from '@/src/lib/bookingIntegration';
import {
  type BookingRecord,
  type BookingStatus,
  getBookingStorageMode,
  listBookings,
  updateBookingStatus,
} from '@/src/lib/bookings';
import { hasSupabaseConfig, supabase } from '@/src/lib/supabase';

const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

const statusLabel: Record<BookingStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

const statusClassName: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-sky-100 text-sky-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const syncStatusClassName: Record<BookingRecord['calendarSyncStatus'], string> = {
  not_configured: 'bg-stone-100 text-stone-700',
  pending: 'bg-amber-100 text-amber-700',
  synced: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
};

const formatDateTime = (booking: BookingRecord) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${booking.date}T12:00:00`));

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const storageMode = getBookingStorageMode();
  const requiresAuth = hasSupabaseConfig;

  useEffect(() => {
    if (!requiresAuth || !supabase) {
      setAuthLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [requiresAuth]);

  const refreshBookings = async () => {
    if (requiresAuth && !session) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const nextBookings = await listBookings();
      setBookings(nextBookings);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Não foi possível carregar as reservas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    refreshBookings();
  }, [authLoading, session]);

  const bookingStats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === 'pending').length;
    const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length;
    const completed = bookings.filter((booking) => booking.status === 'completed').length;

    return { total: bookings.length, pending, confirmed, completed };
  }, [bookings]);

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      setUpdatingId(bookingId);
      const updated = await updateBookingStatus(bookingId, status);
      setBookings((current) => current.map((booking) => (booking.id === bookingId ? updated : booking)));
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Não foi possível atualizar a reserva.';
      setError(message);
    } finally {
      setUpdatingId('');
    }
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    try {
      setAuthSubmitting(true);
      setError('');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Não foi possível autenticar o painel.';
      setError(message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setBookings([]);
  };

  return (
    <div className="min-h-screen px-6 pb-24 pt-32">
      <div className="mx-auto max-w-7xl space-y-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Painel de reservas</span>
            <h1 className="serif mt-4 text-5xl italic text-ink md:text-7xl">Acompanhe a agenda comercial em tempo real.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brown/70">
              Este painel lista os agendamentos enviados pelo site, permite alterar o status operacional e funciona com banco Supabase quando as credenciais estiverem configuradas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/45 bg-white/75 p-5 shadow-[0_16px_36px_rgba(60,35,24,0.06)]">
              <div className="mb-4 inline-flex rounded-full bg-gold/10 p-3 text-gold">
                <Database size={18} />
              </div>
              <h2 className="serif text-2xl italic text-ink">Modo de dados</h2>
              <p className="mt-2 text-sm leading-7 text-brown/70">
                {storageMode === 'supabase'
                  ? 'Supabase conectado. As reservas já estão sendo persistidas em banco real.'
                  : 'Fallback local ativo. Configure o Supabase para persistência real em produção.'}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/45 bg-white/75 p-5 shadow-[0_16px_36px_rgba(60,35,24,0.06)]">
              <div className="mb-4 inline-flex rounded-full bg-gold/10 p-3 text-gold">
                <CalendarDays size={18} />
              </div>
              <h2 className="serif text-2xl italic text-ink">Visão rápida</h2>
              <div className="mt-3 grid gap-2 text-sm leading-7 text-brown/70">
                <span>Total: {bookingStats.total}</span>
                <span>Pendentes: {bookingStats.pending}</span>
                <span>Confirmadas: {bookingStats.confirmed}</span>
                <span>Concluídas: {bookingStats.completed}</span>
                <span>Calendário: {bookingCalendarConfig.enabled ? bookingCalendarConfig.providerLabel : 'Desativado'}</span>
                {requiresAuth ? <span>Login: {session ? 'Autenticado' : 'Necessário'}</span> : null}
              </div>
            </div>
          </div>
        </motion.div>

        {error ? (
          <div className="flex items-start gap-3 rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
            <CircleAlert size={18} className="mt-1 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {authLoading ? (
          <div className="flex min-h-70 items-center justify-center gap-3 rounded-[34px] border border-white/45 bg-white/78 text-brown/60 shadow-[0_24px_70px_rgba(60,35,24,0.08)]">
            <LoaderCircle size={20} className="animate-spin" />
            <span>Verificando autenticação do painel...</span>
          </div>
        ) : null}

        {!authLoading && requiresAuth && !session ? (
          <div className="grid gap-8 rounded-[34px] border border-white/45 bg-white/78 p-8 shadow-[0_24px_70px_rgba(60,35,24,0.08)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Acesso protegido</span>
              <h2 className="serif mt-4 text-4xl italic text-ink">Entre com um usuário administrativo do Supabase.</h2>
              <p className="mt-5 text-base leading-8 text-brown/70">
                As reservas continuam aceitando inserção pública no site, mas a visualização completa e a alteração de status agora dependem de autenticação real no painel.
              </p>
              <div className="mt-6 rounded-[28px] bg-cream/70 p-5 text-sm leading-7 text-brown/68">
                <div className="mb-3 flex items-center gap-3 text-gold">
                  <ShieldCheck size={18} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">Como liberar acesso</span>
                </div>
                Crie um usuário de administração em Supabase Auth e use esse e-mail e senha aqui. As policies SQL já foram ajustadas para leitura e atualização apenas por usuários autenticados.
              </div>
            </div>

            <form onSubmit={handleSignIn} className="rounded-[30px] border border-brown/8 bg-white p-6 shadow-[0_18px_44px_rgba(60,35,24,0.06)]">
              <div className="mb-5 inline-flex rounded-full bg-gold/10 p-3 text-gold">
                <LockKeyhole size={18} />
              </div>
              <h3 className="serif text-3xl italic text-ink">Login do painel</h3>
              <div className="mt-6 grid gap-4">
                <input
                  type="email"
                  placeholder="E-mail administrativo"
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-3xl border border-brown/10 bg-cream/50 px-5 py-4 outline-none transition-colors focus:border-gold"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-3xl border border-brown/10 bg-cream/50 px-5 py-4 outline-none transition-colors focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="button-primary rounded-full px-6 py-4 text-[11px] font-bold uppercase tracking-[0.28em] transition-all disabled:cursor-wait disabled:bg-brown/30"
                >
                  {authSubmitting ? 'Entrando...' : 'Entrar no painel'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {!authLoading && (!requiresAuth || session) ? (
        <div className="overflow-hidden rounded-[34px] border border-white/45 bg-white/78 shadow-[0_24px_70px_rgba(60,35,24,0.08)]">
          <div className="flex items-center justify-between border-b border-brown/8 px-6 py-5">
            <div>
              <h2 className="serif text-3xl italic text-ink">Reservas recebidas</h2>
              <p className="mt-1 text-sm text-brown/58">Atualize o status conforme o andamento do atendimento.</p>
            </div>
            <div className="flex items-center gap-3">
              {requiresAuth && session ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="button-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brown transition-all"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              ) : null}
              <button
                type="button"
                onClick={refreshBookings}
                className="button-secondary rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.28em] text-brown transition-all"
              >
                Atualizar lista
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-70 items-center justify-center gap-3 text-brown/60">
              <LoaderCircle size={20} className="animate-spin" />
              <span>Carregando reservas...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex min-h-70 flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="rounded-full bg-gold/10 p-4 text-gold">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="serif text-3xl italic text-ink">Nenhuma reserva ainda.</h3>
                <p className="mt-2 text-sm leading-7 text-brown/60">Quando os visitantes concluírem o agendamento pelo site, eles aparecerão aqui.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.24em] text-brown/44">
                    <th className="px-6 py-4">Protocolo</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Serviço</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Agenda</th>
                    <th className="px-6 py-4">Atualizar</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-brown/8 align-top">
                      <td className="px-6 py-5 text-sm text-brown/62">
                        <div className="font-semibold text-ink">{booking.id}</div>
                        <div>{booking.phone}</div>
                        <div>{booking.email}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-brown/68">
                        <div className="font-semibold text-ink">{booking.name}</div>
                        <div className="max-w-xs leading-7">{booking.notes || 'Sem observações informadas.'}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-brown/68">
                        <div className="font-semibold text-ink">{booking.serviceTitle}</div>
                        <div>{booking.serviceId}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-brown/68">
                        <div>{formatDateTime(booking)}</div>
                        <div>{booking.time}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${statusClassName[booking.status]}`}>
                          {statusLabel[booking.status]}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-brown/68">
                        <span className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${syncStatusClassName[booking.calendarSyncStatus]}`}>
                          {getBookingSyncLabel(booking.calendarSyncStatus)}
                        </span>
                        <div className="mt-2 max-w-[220px] text-xs leading-6 text-brown/56">
                          {booking.calendarProvider !== 'none' ? booking.calendarProvider : 'Sem provedor'}
                          {booking.syncError ? ` • ${booking.syncError}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={booking.status}
                          disabled={updatingId === booking.id}
                          onChange={(event) => handleStatusChange(booking.id, event.target.value as BookingStatus)}
                          className="w-full rounded-2xl border border-brown/10 bg-cream/60 px-4 py-3 text-sm text-brown outline-none transition-colors focus:border-gold"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminBookings;