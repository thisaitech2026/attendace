import type { LeaveBalance, LeaveRequest, LeaveType } from '@/types/employee';

export function computeLeaveBalances(
  balances: LeaveBalance[],
  requests: LeaveRequest[]
): LeaveBalance[] {
  return balances.map((balance) => {
    const approvedDays = requests
      .filter((request) => request.type === balance.type && request.status === 'approved')
      .reduce((sum, request) => sum + request.days, 0);
    const pendingDays = requests
      .filter((request) => request.type === balance.type && request.status === 'pending')
      .reduce((sum, request) => sum + request.days, 0);
    const used = approvedDays;
    const remaining = Math.max(0, balance.total - used - pendingDays);
    return { ...balance, used, remaining };
  });
}

export function getAvailableLeaveDays(
  balances: LeaveBalance[],
  requests: LeaveRequest[],
  type: LeaveType
): number {
  const computed = computeLeaveBalances(balances, requests);
  return computed.find((balance) => balance.type === type)?.remaining ?? 0;
}

export function getPendingLeaveDays(
  balances: LeaveBalance[],
  requests: LeaveRequest[],
  type: LeaveType
): number {
  return requests
    .filter((request) => request.type === type && request.status === 'pending')
    .reduce((sum, request) => sum + request.days, 0);
}
