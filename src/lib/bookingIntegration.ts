import { hasSupabaseConfig, supabase } from '@/src/lib/supabase';
import type { BookingRecord, BookingStatus, BookingSyncProvider, BookingSyncSnapshot } from '@/src/lib/bookingTypes';
import { defaultBookingSyncSnapshot } from '@/src/lib/bookingTypes';

const webhookUrl = import.meta.env.VITE_BOOKING_WEBHOOK_URL?.trim() ?? '';
const configuredProvider = import.meta.env.VITE_BOOKING_WEBHOOK_PROVIDER?.trim() ?? 'custom-webhook';
const syncFunctionName = import.meta.env.VITE_BOOKING_SYNC_FUNCTION_NAME?.trim() || 'google-calendar-sync';

const allowedProviders = new Set<BookingSyncProvider>([
  'none',
  'custom-webhook',
  'google-calendar',
  'outlook',
  'cal-com',
  'n8n',
  'make',
]);

const providerLabels: Record<BookingSyncProvider, string> = {
  none: 'Não configurado',
  'custom-webhook': 'Webhook personalizado',
  'google-calendar': 'Google Calendar',
  outlook: 'Outlook Calendar',
  'cal-com': 'Cal.com',
  n8n: 'n8n',
  make: 'Make',
};

const normalizeProvider = (value: string): BookingSyncProvider => {
  const normalized = value.toLowerCase() as BookingSyncProvider;
  return allowedProviders.has(normalized) ? normalized : 'custom-webhook';
};

const preferredProvider = normalizeProvider(configuredProvider);
const shouldUseSupabaseFunction = preferredProvider === 'google-calendar' && hasSupabaseConfig && Boolean(supabase);
const activeProvider = shouldUseSupabaseFunction ? 'google-calendar' : webhookUrl ? preferredProvider : 'none';

export const bookingCalendarConfig = {
  enabled: shouldUseSupabaseFunction || Boolean(webhookUrl),
  provider: activeProvider,
  providerLabel: providerLabels[activeProvider],
  webhookUrl,
  syncFunctionName,
  managedByServer: shouldUseSupabaseFunction,
};

type BookingWebhookPayload = {
  event: 'booking.created' | 'booking.status_changed';
  provider: BookingSyncProvider;
  source: string;
  bookingId: string;
  booking: {
    id: string;
    serviceId: string;
    serviceTitle: string;
    serviceDuration: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
    status: BookingStatus;
    createdAt: string;
  };
  previousStatus?: BookingStatus;
};

const readResponseData = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const createFailedSnapshot = (message: string): BookingSyncSnapshot => ({
  calendarSyncStatus: 'failed',
  calendarProvider: activeProvider === 'none' ? preferredProvider : activeProvider,
  externalEventId: '',
  syncedAt: '',
  syncError: message,
});

const mapResponseToSnapshot = (responseData: Record<string, unknown> | null): BookingSyncSnapshot => ({
  calendarSyncStatus:
    responseData?.calendarSyncStatus === 'pending' ||
    responseData?.calendarSyncStatus === 'synced' ||
    responseData?.calendarSyncStatus === 'failed' ||
    responseData?.calendarSyncStatus === 'not_configured'
      ? responseData.calendarSyncStatus
      : 'synced',
  calendarProvider:
    typeof responseData?.provider === 'string'
      ? normalizeProvider(responseData.provider)
      : bookingCalendarConfig.provider,
  externalEventId: typeof responseData?.eventId === 'string' ? responseData.eventId : '',
  syncedAt: typeof responseData?.syncedAt === 'string' ? responseData.syncedAt : new Date().toISOString(),
  syncError: typeof responseData?.syncError === 'string' ? responseData.syncError : '',
});

const invokeSupabaseSyncFunction = async (payload: BookingWebhookPayload): Promise<BookingSyncSnapshot> => {
  if (!supabase) {
    return createFailedSnapshot('Cliente Supabase indisponível para sincronização da agenda.');
  }

  const { data, error } = await supabase.functions.invoke(bookingCalendarConfig.syncFunctionName, {
    body: {
      event: payload.event,
      bookingId: payload.bookingId,
      previousStatus: payload.previousStatus,
    },
  });

  if (error) {
    return createFailedSnapshot(error.message);
  }

  return mapResponseToSnapshot((data ?? null) as Record<string, unknown> | null);
};

const postBookingWebhook = async (payload: BookingWebhookPayload): Promise<BookingSyncSnapshot> => {
  if (!bookingCalendarConfig.enabled) {
    return defaultBookingSyncSnapshot();
  }

  if (bookingCalendarConfig.managedByServer) {
    return invokeSupabaseSyncFunction(payload);
  }

  try {
    const response = await fetch(bookingCalendarConfig.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await readResponseData(response);

    if (!response.ok) {
      const detail = typeof responseData?.message === 'string' ? responseData.message : 'A integração externa recusou a solicitação.';
      throw new Error(detail);
    }

    return mapResponseToSnapshot(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao sincronizar a reserva com a agenda externa.';
    return createFailedSnapshot(message);
  }
};

export const syncCreatedBooking = async (booking: BookingRecord) =>
  postBookingWebhook({
    event: 'booking.created',
    provider: bookingCalendarConfig.provider,
    source: booking.source,
    bookingId: booking.id,
    booking: {
      id: booking.id,
      serviceId: booking.serviceId,
      serviceTitle: booking.serviceTitle,
      serviceDuration: booking.serviceDuration,
      date: booking.date,
      time: booking.time,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
    },
  });

export const syncUpdatedBookingStatus = async (
  booking: BookingRecord,
  previousStatus: BookingStatus
) =>
  postBookingWebhook({
    event: 'booking.status_changed',
    provider: bookingCalendarConfig.provider,
    source: booking.source,
    bookingId: booking.id,
    previousStatus,
    booking: {
      id: booking.id,
      serviceId: booking.serviceId,
      serviceTitle: booking.serviceTitle,
      serviceDuration: booking.serviceDuration,
      date: booking.date,
      time: booking.time,
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
    },
  });

export const getBookingSyncLabel = (status: BookingSyncSnapshot['calendarSyncStatus']) => {
  if (status === 'synced') return 'Sincronizada';
  if (status === 'failed') return 'Falhou';
  if (status === 'pending') return 'Pendente';
  return 'Não configurada';
};