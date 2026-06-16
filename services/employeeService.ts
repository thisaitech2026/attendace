import { format, parseISO, differenceInMinutes } from 'date-fns';

import { MOCK_LEAVE_REQUESTS, MOCK_PERFORMANCE, MOCK_SALARY, createTodayAttendance, getInitialAttendance } from '@/data/mockData';
import {
  findEmployeeByEmail,
  findEmployeeById,
  getLeaveBalances as getBalances,
} from '@/services/employeeRegistry';
import { getItem, setItem, storageKeys } from '@/services/storage';
import { calculateLeaveDays, validateLeaveDateRange } from '@/utils/leaveValidation';
import type {
  AttendanceRecord,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  PerformanceReview,
  PunchMethod,
  SalarySlip,
} from '@/types/employee';

export { findEmployeeByEmail, findEmployeeById } from '@/services/employeeRegistry';

export async function getLeaveBalances(employeeId: string): Promise<LeaveBalance[]> {
  return getBalances(employeeId);
}

export async function loadAttendance(employeeId: string): Promise<AttendanceRecord[]> {
  const stored = await getItem<AttendanceRecord[]>(storageKeys.ATTENDANCE);
  const records = stored ?? getInitialAttendance();
  const employeeRecords = records.filter((r) => r.employeeId === employeeId);
  const today = new Date().toISOString().split('T')[0];
  const hasToday = employeeRecords.some((r) => r.date === today);
  if (!hasToday) {
    employeeRecords.unshift(createTodayAttendance(employeeId));
  }
  return employeeRecords.sort((a, b) => b.date.localeCompare(a.date));
}

async function saveAttendance(records: AttendanceRecord[]): Promise<void> {
  const stored = (await getItem<AttendanceRecord[]>(storageKeys.ATTENDANCE)) ?? getInitialAttendance();
  const map = new Map(stored.map((r) => [r.id, r]));
  records.forEach((r) => map.set(r.id, r));
  await setItem(storageKeys.ATTENDANCE, Array.from(map.values()));
}

function nowTime(): string {
  return format(new Date(), 'HH:mm:ss');
}

function calcHours(punchIn: string, punchOut: string): number {
  const start = parseISO(`2000-01-01T${punchIn}`);
  const end = parseISO(`2000-01-01T${punchOut}`);
  return Math.round((differenceInMinutes(end, start) / 60) * 10) / 10;
}

export async function punchIn(
  employeeId: string,
  method: PunchMethod,
  wifiSsid: string | null = null
): Promise<AttendanceRecord> {
  const records = await loadAttendance(employeeId);
  const today = records[0];
  if (today.punchIn) {
    throw new Error('Already punched in today');
  }
  const updated: AttendanceRecord = {
    ...today,
    punchIn: nowTime(),
    punchInMethod: method,
    wifiSsid,
    status: method === 'wifi' ? 'present' : 'late',
  };
  await saveAttendance([updated]);
  return updated;
}

export async function punchOut(employeeId: string, method: PunchMethod): Promise<AttendanceRecord> {
  const records = await loadAttendance(employeeId);
  const today = records[0];
  if (!today.punchIn) {
    throw new Error('You must punch in first');
  }
  if (today.punchOut) {
    throw new Error('Already punched out today');
  }
  const punchOut = nowTime();
  const updated: AttendanceRecord = {
    ...today,
    punchOut,
    punchOutMethod: method,
    hoursWorked: calcHours(today.punchIn, punchOut),
    status: 'present',
  };
  await saveAttendance([updated]);
  return updated;
}

export async function getLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
  const stored = await getItem<LeaveRequest[]>(storageKeys.LEAVE_REQUESTS);
  const all = stored ?? MOCK_LEAVE_REQUESTS;
  return all.filter((r) => r.employeeId === employeeId);
}

export async function submitLeaveRequest(
  employeeId: string,
  type: LeaveType,
  startDate: string,
  endDate: string,
  reason: string
): Promise<LeaveRequest> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    throw new Error('Please enter a reason for your leave.');
  }

  const validation = validateLeaveDateRange(startDate, endDate);
  if (!validation.valid) {
    throw new Error(validation.errors.end ?? validation.errors.start ?? 'Please enter valid dates.');
  }

  const days = calculateLeaveDays(startDate, endDate);
  const request: LeaveRequest = {
    id: `lr-${Date.now()}`,
    employeeId,
    type,
    startDate,
    endDate,
    days,
    reason: trimmedReason,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  const stored = (await getItem<LeaveRequest[]>(storageKeys.LEAVE_REQUESTS)) ?? MOCK_LEAVE_REQUESTS;
  await setItem(storageKeys.LEAVE_REQUESTS, [request, ...stored]);
  return request;
}

export function getPerformanceReviews(employeeId: string): PerformanceReview[] {
  return MOCK_PERFORMANCE.filter((r) => r.employeeId === employeeId);
}

export function getSalarySlips(employeeId: string): SalarySlip[] {
  return MOCK_SALARY.filter((s) => s.employeeId === employeeId);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
