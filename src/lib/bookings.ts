import { bookingCalendarConfig, syncCreatedBooking, syncUpdatedBookingStatus } from '@/src/lib/bookingIntegration';
import { hasSupabaseConfig, supabase } from '@/src/lib/supabase';
import {
  defaultBookingSyncSnapshot,
  type BookingInput,
  type BookingRecord,
  type BookingStatus,
  type BookingStorageMode,
  type BookingSyncSnapshot,
} from '@/src/lib/bookingTypes';

const LOCAL_STORAGE_KEY = 'lumiere-bookings';
const BOOKINGS_TABLE = 'bookings';

export type {
  BookingInput,
  BookingRecord,
  BookingStatus,
  BookingStorageMode,
};

type SupabaseBookingRow = {
  id: string;
  service_id: string;
  service_title: string;
  service_duration?: string | null;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  source?: string | null;
  calendar_sync_status?: string | null;
  calendar_provider?: string | null;
  external_event_id?: string | null;
  synced_at?: string | null;
  sync_error?: string | null;
};

const syncStatusValues = new Set(['not_configured', 'pending', 'synced', 'failed']);
const syncProviderValues = new Set(['none', 'custom-webhook', 'google-calendar', 'outlook', 'cal-com', 'n8n', 'make']);

const sortBookings = (bookings: BookingRecord[]) =>
  [...bookings].sort((left, right) => {
    const leftValue = `${left.date}T${left.time}`;
    const rightValue = `${right.date}T${right.time}`;

    return leftValue.localeCompare(rightValue);
  });

const normalizeBooking = (booking: BookingRecord): BookingRecord => ({
  ...booking,
  ...defaultBookingSyncSnapshot(),
  ...booking,
  calendarSyncStatus: syncStatusValues.has(booking.calendarSyncStatus) ? booking.calendarSyncStatus : 'not_configured',
  calendarProvider: syncProviderValues.has(booking.calendarProvider) ? booking.calendarProvider : 'none',
  externalEventId: booking.externalEventId ?? '',
  syncedAt: booking.syncedAt ?? '',
  syncError: booking.syncError ?? '',
  source: booking.source ?? 'website',
});

const mapSupabaseRow = (row: SupabaseBookingRow): BookingRecord => ({
  id: row.id,
  serviceId: row.service_id,
  serviceTitle: row.service_title,
  serviceDuration: row.service_duration ?? '60 min',
  date: row.appointment_date,
  time: row.appointment_time,
  name: row.client_name,
  phone: row.client_phone,
  email: row.client_email,
  notes: row.notes ?? '',
  status: row.status,
  createdAt: row.created_at,
  source: row.source ?? 'website',
  calendarSyncStatus: syncStatusValues.has(row.calendar_sync_status ?? '')
    ? (row.calendar_sync_status as BookingRecord['calendarSyncStatus'])
    : 'not_configured',
  calendarProvider: syncProviderValues.has(row.calendar_provider ?? '')
    ? (row.calendar_provider as BookingRecord['calendarProvider'])
    : 'none',
  externalEventId: row.external_event_id ?? '',
  syncedAt: row.synced_at ?? '',
  syncError: row.sync_error ?? '',
});

const canUseBrowserStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readLocalBookings = (): BookingRecord[] => {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return sortBookings((JSON.parse(raw) as BookingRecord[]).map(normalizeBooking));
  } catch {
    return [];
  }
};

const writeLocalBookings = (bookings: BookingRecord[]) => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortBookings(bookings)));
};

const mergeBookingSyncSnapshot = (booking: BookingRecord, snapshot: BookingSyncSnapshot): BookingRecord =>
  normalizeBooking({
    ...booking,
    ...snapshot,
  });

const updateLocalBooking = (bookingId: string, updater: (booking: BookingRecord) => BookingRecord) => {
  const currentBookings = readLocalBookings();
  const nextBookings = currentBookings.map((booking) => (booking.id === bookingId ? updater(booking) : booking));
  writeLocalBookings(nextBookings);

  return nextBookings.find((booking) => booking.id === bookingId) ?? null;
};

const persistSupabaseSyncSnapshot = async (
  booking: BookingRecord,
  snapshot: BookingSyncSnapshot
): Promise<BookingRecord> => {
  const mergedBooking = mergeBookingSyncSnapshot(booking, snapshot);

  if (!hasSupabaseConfig || !supabase || snapshot.calendarSyncStatus === 'not_configured') {
    return mergedBooking;
  }

  if (bookingCalendarConfig.managedByServer) {
    return mergedBooking;
  }

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .update({
      calendar_sync_status: mergedBooking.calendarSyncStatus,
      calendar_provider: mergedBooking.calendarProvider,
      external_event_id: mergedBooking.externalEventId || null,
      synced_at: mergedBooking.syncedAt || null,
      sync_error: mergedBooking.syncError || null,
    })
    .eq('id', booking.id)
    .select('*')
    .single();

  if (error) {
    return mergedBooking;
  }

  return mapSupabaseRow(data as SupabaseBookingRow);
};

export const getBookingStorageMode = (): BookingStorageMode => (hasSupabaseConfig ? 'supabase' : 'local');

export const listBookings = async (): Promise<BookingRecord[]> => {
  if (!hasSupabaseConfig || !supabase) {
    return readLocalBookings();
  }

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SupabaseBookingRow[]).map(mapSupabaseRow);
};

export const createBooking = async (input: BookingInput): Promise<BookingRecord> => {
  if (!hasSupabaseConfig || !supabase) {
    const newBooking = normalizeBooking({
      id: `LM-${Date.now().toString().slice(-6)}`,
      serviceId: input.serviceId,
      serviceTitle: input.serviceTitle,
      serviceDuration: input.serviceDuration,
      date: input.date,
      time: input.time,
      name: input.name,
      phone: input.phone,
      email: input.email,
      notes: input.notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      source: 'website',
    });

    const currentBookings = readLocalBookings();
    writeLocalBookings([...currentBookings, newBooking]);

    const syncSnapshot = await syncCreatedBooking(newBooking);
    const updatedBooking = mergeBookingSyncSnapshot(newBooking, syncSnapshot);
    updateLocalBooking(newBooking.id, () => updatedBooking);

    return updatedBooking;
  }

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .insert({
      service_id: input.serviceId,
      service_title: input.serviceTitle,
      service_duration: input.serviceDuration,
      appointment_date: input.date,
      appointment_time: input.time,
      client_name: input.name,
      client_phone: input.phone,
      client_email: input.email,
      notes: input.notes,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const createdBooking = mapSupabaseRow(data as SupabaseBookingRow);
  const syncSnapshot = await syncCreatedBooking(createdBooking);

  return bookingCalendarConfig.managedByServer
    ? mergeBookingSyncSnapshot(createdBooking, syncSnapshot)
    : persistSupabaseSyncSnapshot(createdBooking, syncSnapshot);
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<BookingRecord> => {
  if (!hasSupabaseConfig || !supabase) {
    const currentBookings = readLocalBookings();
    const previousBooking = currentBookings.find((booking) => booking.id === bookingId);
    const updatedBookings = currentBookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    const updatedBooking = updatedBookings.find((booking) => booking.id === bookingId);

    if (!updatedBooking) {
      throw new Error('Reserva não encontrada.');
    }

    writeLocalBookings(updatedBookings);

    const syncSnapshot = previousBooking ? await syncUpdatedBookingStatus(updatedBooking, previousBooking.status) : defaultBookingSyncSnapshot();
    const syncedBooking = mergeBookingSyncSnapshot(updatedBooking, syncSnapshot);
    updateLocalBooking(bookingId, () => syncedBooking);

    return syncedBooking;
  }

  const { data: currentData } = await supabase
    .from(BOOKINGS_TABLE)
    .select('*')
    .eq('id', bookingId)
    .single();

  const previousBooking = currentData ? mapSupabaseRow(currentData as SupabaseBookingRow) : null;

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .update({ status })
    .eq('id', bookingId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const updatedBooking = mapSupabaseRow(data as SupabaseBookingRow);

  if (!previousBooking) {
    return updatedBooking;
  }

  const syncSnapshot = await syncUpdatedBookingStatus(updatedBooking, previousBooking.status);
  return bookingCalendarConfig.managedByServer
    ? mergeBookingSyncSnapshot(updatedBooking, syncSnapshot)
    : persistSupabaseSyncSnapshot(updatedBooking, syncSnapshot);
};