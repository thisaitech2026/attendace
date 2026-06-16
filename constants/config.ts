import type { UserCredentials } from '@/types/employee';

export const APP_NAME = 'WorkPulse';

/** Office WiFi SSIDs approved for automatic punch-in (WorkJam-style). */
export const ALLOWED_WIFI_SSIDS = [
  'Office-WiFi',
  'Company-5G',
  'HQ-Guest',
  'WorkPulse-Office',
];

export const MOCK_USERS: (UserCredentials & { employeeId: string })[] = [
  { email: 'john.doe@company.com', password: 'password123', employeeId: 'EMP001' },
  { email: 'jane.smith@company.com', password: 'password123', employeeId: 'EMP002' },
];

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  personal: 'Personal Leave',
  unpaid: 'Unpaid Leave',
};
