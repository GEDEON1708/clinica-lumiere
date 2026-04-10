import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type SyncEvent = 'booking.created' | 'booking.status_changed';

type BookingRow = {
  id: string;
  service_id: string;
  service_title: string;
  service_duration: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  external_event_id: string | null;
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const requiredEnv = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

const encodeBase64Url = (input: string | Uint8Array) => {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const pemToArrayBuffer = (pem: string) => {
  const sanitized = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');

  const binary = atob(sanitized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
};

const createGoogleAccessToken = async () => {
  const serviceAccountEmail = requiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = requiredEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const signingInput = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(payload))}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const assertion = `${signingInput}.${encodeBase64Url(new Uint8Array(signature))}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const data = (await response.json()) as { access_token?: string; error_description?: string };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description ?? 'Failed to obtain Google access token.');
  }

  return data.access_token;
};

const parseDurationInMinutes = (value: string) => {
  const parsed = Number.parseInt(value.replace(/\D+/g, ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
};

const toGoogleDateTime = (date: string, time: string) => `${date}T${time}:00-03:00`;

const createDescription = (booking: BookingRow) => {
  const notes = booking.notes?.trim() ? booking.notes.trim() : 'Sem observações adicionais.';

  return [
    'Reserva recebida pelo site Lumière Estética Avançada.',
    '',
    `Procedimento: ${booking.service_title}`,
    `Duração: ${booking.service_duration}`,
    `Cliente: ${booking.client_name}`,
    `Telefone: ${booking.client_phone}`,
    `E-mail: ${booking.client_email}`,
    `Status: ${booking.status}`,
    `Observações: ${notes}`,
    `Protocolo interno: ${booking.id}`,
  ].join('\n');
};

const buildEventPayload = (booking: BookingRow) => {
  const durationInMinutes = parseDurationInMinutes(booking.service_duration);
  const startDate = new Date(toGoogleDateTime(booking.appointment_date, booking.appointment_time));
  const endDate = new Date(startDate.getTime() + durationInMinutes * 60_000);
  const timezone = Deno.env.get('GOOGLE_CALENDAR_TIMEZONE') ?? 'America/Recife';
  const location = Deno.env.get('GOOGLE_CALENDAR_LOCATION') ?? 'Lumière Estética Avançada - Boa Viagem, Recife';

  return {
    summary: `${booking.service_title} • ${booking.client_name}`,
    description: createDescription(booking),
    location,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: timezone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: timezone,
    },
    status: booking.status === 'cancelled' ? 'cancelled' : 'confirmed',
  };
};

const requestGoogleCalendar = async (
  accessToken: string,
  path: string,
  method: 'POST' | 'PATCH',
  body: Record<string, unknown>
) => {
  const calendarId = requiredEnv('GOOGLE_CALENDAR_ID');
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const message = typeof data.error === 'object' && data.error && 'message' in data.error
      ? String(data.error.message)
      : 'Google Calendar request failed.';
    throw new Error(message);
  }

  return data;
};

const persistSyncState = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  bookingId: string,
  payload: Record<string, unknown>
) => {
  const { error } = await supabaseAdmin.from('bookings').update(payload).eq('id', bookingId);

  if (error) {
    throw new Error(error.message);
  }
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { bookingId } = (await request.json()) as { bookingId?: string; event?: SyncEvent };

    if (!bookingId) {
      return jsonResponse({ message: 'bookingId is required.' }, 400);
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id, service_id, service_title, service_duration, appointment_date, appointment_time, client_name, client_phone, client_email, notes, status, external_event_id')
      .eq('id', bookingId)
      .single();

    if (error || !data) {
      return jsonResponse({ message: 'Booking not found.' }, 404);
    }

    const booking = data as BookingRow;
    const accessToken = await createGoogleAccessToken();
    const eventPayload = buildEventPayload(booking);
    let eventId = booking.external_event_id ?? '';

    if (booking.status === 'cancelled' && eventId) {
      await requestGoogleCalendar(accessToken, `/events/${eventId}`, 'PATCH', { status: 'cancelled' });
    } else if (eventId) {
      await requestGoogleCalendar(accessToken, `/events/${eventId}`, 'PATCH', eventPayload);
    } else {
      const createdEvent = await requestGoogleCalendar(accessToken, '/events', 'POST', eventPayload);
      eventId = typeof createdEvent.id === 'string' ? createdEvent.id : '';
    }

    const syncedAt = new Date().toISOString();

    await persistSyncState(supabaseAdmin, booking.id, {
      calendar_sync_status: 'synced',
      calendar_provider: 'google-calendar',
      external_event_id: eventId || null,
      synced_at: syncedAt,
      sync_error: null,
    });

    return jsonResponse({
      provider: 'google-calendar',
      calendarSyncStatus: 'synced',
      eventId,
      syncedAt,
      syncError: '',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected Google Calendar sync failure.';

    return jsonResponse({
      provider: 'google-calendar',
      calendarSyncStatus: 'failed',
      eventId: '',
      syncedAt: '',
      syncError: message,
      message,
    }, 500);
  }
});