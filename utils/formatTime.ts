import { format, parseISO } from 'date-fns';

/** Converts stored 24h punch time (HH:mm or HH:mm:ss) to 12h display (e.g. 6:15 PM). */
export function formatDisplayTime(time: string | null | undefined): string {
  if (!time) return '—';
  const normalized = time.length === 5 ? `${time}:00` : time;
  return format(parseISO(`2000-01-01T${normalized}`), 'h:mm a');
}
