import type { AppUser, UserRole } from '@/types/employee';

export const APP_NAME = 'WorkPulse';

export const ALLOWED_WIFI_SSIDS = [
  'Office-WiFi',
  'Company-5G',
  'HQ-Guest',
  'WorkPulse-Office',
];

export const INITIAL_USERS: AppUser[] = [
  {
    email: 'john.doe@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP001',
    name: 'John Doe',
  },
  {
    email: 'jane.smith@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP002',
    name: 'Jane Smith',
  },
  {
    email: 'hr.admin@company.com',
    password: 'admin123',
    role: 'admin',
    name: 'HR Admin',
  },
];

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  personal: 'Personal Leave',
  unpaid: 'Unpaid Leave',
};

export const DEMO_LOGINS: Record<UserRole, { email: string; password: string }> = {
  employee: { email: 'john.doe@company.com', password: 'password123' },
  admin: { email: 'hr.admin@company.com', password: 'admin123' },
};
