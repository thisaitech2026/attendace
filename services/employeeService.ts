import { format, parseISO, differenceInMinutes } from 'date-fns';

import { createTodayAttendance } from '@/data/mockData';
import { getLeaveBalances as getBalances } from '@/services/employeeRegistry';
import {
  loadAttendanceForEmployee,
  loadLeaveRequests,
  loadPerformanceReviews,
  loadSalarySlips,
  saveAttendanceRecords,
  saveLeaveRequests,
} from '@/services/firestoreRepository';
import { calculateLeaveDays, validateLeaveDateRange } from '@/utils/leaveValidation';
import { getAvailableLeaveDays } from '@/utils/leaveBalances';
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
  const employeeRecords = await loadAttendanceForEmployee(employeeId);
  const today = new Date().toISOString().split('T')[0];
  const hasToday = employeeRecords.some((r) => r.date === today);
  if (!hasToday) {
    const todayRecord = createTodayAttendance(employeeId);
    await saveAttendanceRecords([todayRecord]);
    employeeRecords.unshift(todayRecord);
  }
  return employeeRecords.sort((a, b) => b.date.localeCompare(a.date));
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
    manualApprovalStatus: method === 'manual' ? 'pending' : undefined,
  };
  await saveAttendanceRecords([updated]);
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
  const punchOutTime = nowTime();
  const updated: AttendanceRecord = {
    ...today,
    punchOut: punchOutTime,
    punchOutMethod: method,
    hoursWorked: calcHours(today.punchIn, punchOutTime),
    status: 'present',
  };
  await saveAttendanceRecords([updated]);
  return updated;
}

export async function getLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
  return loadLeaveRequests(employeeId);
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
  const balances = await getBalances(employeeId);
  const existingRequests = await loadLeaveRequests(employeeId);
  const available = getAvailableLeaveDays(balances, existingRequests, type);
  if (days > available) {
    throw new Error(`You only have ${available} day(s) of ${type} leave remaining.`);
  }

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
  await saveLeaveRequests([request]);
  return request;
}

export async function getPerformanceReviews(employeeId: string): Promise<PerformanceReview[]> {
  return loadPerformanceReviews(employeeId);
}

export async function getSalarySlips(employeeId: string): Promise<SalarySlip[]> {
  return loadSalarySlips(employeeId);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
