import { eachDayOfInterval, parseISO } from 'date-fns';

import { LEAVE_DEDUCTION_PER_DAY } from '@/constants/config';
import type { LeaveRequest, SalarySlip } from '@/types/employee';

const MONTH_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

export interface SlipLeaveDeduction {
  /** Number of leave days that landed in the slip's calendar month. */
  days: number;
  /** Money deducted from the slip's net pay (days * LEAVE_DEDUCTION_PER_DAY). */
  amount: number;
  /** Per-day rate applied (echoed for display convenience). */
  rate: number;
}

/**
 * Sum of approved + pending leave days for the given employee that fall inside
 * the slip's month/year. Pending leaves are included so the employee can
 * immediately see the projected deduction when they submit a request — they
 * disappear if the leave is rejected.
 */
export function computeLeaveDeductionForSlip(
  slip: SalarySlip,
  leaveRequests: LeaveRequest[]
): SlipLeaveDeduction {
  const monthIndex = MONTH_INDEX[slip.month.trim().toLowerCase()];
  if (monthIndex === undefined) {
    return { days: 0, amount: 0, rate: LEAVE_DEDUCTION_PER_DAY };
  }

  const targetYear = slip.year;
  let days = 0;

  for (const request of leaveRequests) {
    if (request.employeeId !== slip.employeeId) continue;
    if (request.status !== 'approved' && request.status !== 'pending') continue;

    let interval: Date[];
    try {
      interval = eachDayOfInterval({
        start: parseISO(request.startDate),
        end: parseISO(request.endDate),
      });
    } catch {
      continue;
    }

    for (const day of interval) {
      if (day.getFullYear() === targetYear && day.getMonth() === monthIndex) {
        days += 1;
      }
    }
  }

  return {
    days,
    amount: days * LEAVE_DEDUCTION_PER_DAY,
    rate: LEAVE_DEDUCTION_PER_DAY,
  };
}

export interface AdjustedSlip {
  slip: SalarySlip;
  leaveDeduction: SlipLeaveDeduction;
  /** Original slip's deductions plus the leave deduction. */
  totalDeductions: number;
  /** basic + allowances - totalDeductions. */
  adjustedNetPay: number;
}

export function applyLeaveDeductionToSlip(
  slip: SalarySlip,
  leaveRequests: LeaveRequest[]
): AdjustedSlip {
  const leaveDeduction = computeLeaveDeductionForSlip(slip, leaveRequests);
  const totalDeductions = slip.deductions + leaveDeduction.amount;
  const adjustedNetPay = slip.basic + slip.allowances - totalDeductions;
  return {
    slip,
    leaveDeduction,
    totalDeductions,
    adjustedNetPay,
  };
}
