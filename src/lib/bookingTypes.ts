export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type BookingStorageMode = 'supabase' | 'local';
export type BookingSyncStatus = 'not_configured' | 'pending' | 'synced' | 'failed';
export type BookingSyncProvider = 'none' | 'custom-webhook' | 'google-calendar' | 'outlook' | 'cal-com' | 'n8n' | 'make';

export interface BookingSyncSnapshot {
  calendarSyncStatus: BookingSyncStatus;
  calendarProvider: BookingSyncProvider;
  externalEventId: string;
  syncedAt: string;
  syncError: string;
}

export interface BookingRecord extends BookingSyncSnapshot {
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
  source: string;
}

export interface BookingInput {
  serviceId: string;
  serviceTitle: string;
  serviceDuration: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export const defaultBookingSyncSnapshot = (): BookingSyncSnapshot => ({
  calendarSyncStatus: 'not_configured',
  calendarProvider: 'none',
  externalEventId: '',
  syncedAt: '',
  syncError: '',
});