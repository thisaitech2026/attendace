import type { AttendanceRecord, Employee } from '@/types/employee';
import { format, parseISO } from 'date-fns';

export function formatPunchDetailLines(record: AttendanceRecord, employeeName?: string): string[] {
  const lines: string[] = [];
  if (employeeName) lines.push(`Employee: ${employeeName}`);
  lines.push(`Date: ${format(parseISO(record.date), 'EEEE, MMMM d, yyyy')}`);

  if (record.punchIn) {
    lines.push(`Punch In: ${record.punchIn.slice(0, 8)}`);
    lines.push(`Method: ${record.punchInMethod === 'wifi' ? 'Office WiFi' : 'Manual'}`);
    if (record.wifiSsid) lines.push(`Network: ${record.wifiSsid}`);
  } else {
    lines.push('Punch In: Not recorded yet');
  }

  if (record.punchOut) {
    lines.push(`Punch Out: ${record.punchOut.slice(0, 8)}`);
    lines.push(`Out Method: ${record.punchOutMethod === 'wifi' ? 'Office WiFi' : 'Manual'}`);
    lines.push(`Hours Worked: ${record.hoursWorked}h`);
  } else if (record.punchIn) {
    lines.push('Punch Out: Not recorded yet');
  }

  lines.push(`Status: ${record.status}`);
  return lines;
}

export function formatPunchPreviewLines(
  record: AttendanceRecord | undefined,
  employee?: Employee | null
): string[] {
  const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : undefined;
  const dateStr = record?.date ?? format(new Date(), 'yyyy-MM-dd');

  const lines: string[] = [];
  if (employeeName) lines.push(`Employee: ${employeeName}`);
  if (employee?.employeeId) lines.push(`Employee ID: ${employee.employeeId}`);
  if (employee?.department) lines.push(`Department: ${employee.department}`);
  lines.push(`Date: ${format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}`);

  if (!record) {
    lines.push('Status: Loading attendance...');
    return lines;
  }

  if (!record.punchIn) {
    lines.push('Punch In: —');
    lines.push('Punch Out: —');
    lines.push('Status: Ready to punch in');
    return lines;
  }

  return formatPunchDetailLines(record, employeeName);
}

export function formatPunchAlertTitle(record: AttendanceRecord): string {
  if (record.punchOut) return 'Punch Out Complete';
  if (record.punchIn) return 'Punched In Successfully';
  return 'Punch Details';
}

export function formatPunchAlertMessage(record: AttendanceRecord, employeeName?: string): string {
  return formatPunchDetailLines(record, employeeName).join('\n');
}
