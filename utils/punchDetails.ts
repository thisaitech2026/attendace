import type { AttendanceRecord } from '@/types/employee';
import { format, parseISO } from 'date-fns';

export function formatPunchDetailLines(record: AttendanceRecord, employeeName?: string): string[] {
  const lines: string[] = [];
  if (employeeName) lines.push(`Employee: ${employeeName}`);
  lines.push(`Date: ${format(parseISO(record.date), 'EEEE, MMMM d, yyyy')}`);

  if (record.punchIn) {
    lines.push(`Punch In: ${record.punchIn.slice(0, 8)}`);
    lines.push(`Method: ${record.punchInMethod === 'wifi' ? 'Office WiFi' : 'Manual'}`);
    if (record.wifiSsid) lines.push(`Network: ${record.wifiSsid}`);
  }

  if (record.punchOut) {
    lines.push(`Punch Out: ${record.punchOut.slice(0, 8)}`);
    lines.push(`Out Method: ${record.punchOutMethod === 'wifi' ? 'Office WiFi' : 'Manual'}`);
    lines.push(`Hours Worked: ${record.hoursWorked}h`);
  }

  lines.push(`Status: ${record.status}`);
  return lines;
}

export function formatPunchAlertTitle(record: AttendanceRecord): string {
  if (record.punchOut) return 'Punch Out Complete';
  if (record.punchIn) return 'Punched In Successfully';
  return 'Punch Details';
}

export function formatPunchAlertMessage(record: AttendanceRecord, employeeName?: string): string {
  return formatPunchDetailLines(record, employeeName).join('\n');
}
