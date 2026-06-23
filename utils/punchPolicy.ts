import type { Employee } from '@/types/employee';

/** Office employees punch in via THISAI WiFi (home screen). */
export function isOfficeEmployee(employee: Employee | null | undefined): boolean {
  return !employee?.workFromHome;
}

/** WFH employees use manual punch on the Attendance tab (HR approval required). */
export function isWorkFromHomeEmployee(employee: Employee | null | undefined): boolean {
  return Boolean(employee?.workFromHome);
}
