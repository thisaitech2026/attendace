import { findEmployeeById, getEmployeeDisplayName, loadEmployees } from '@/services/employeeRegistry';
import {
  loadLeaveBalancesMap,
  loadLeaveRequests,
  saveLeaveBalancesMap,
  saveLeaveRequests,
} from '@/services/firestoreRepository';
import type { Employee, LeaveBalance, LeaveRequest, LeaveStatus } from '@/types/employee';

async function applyApprovedLeaveBalance(request: LeaveRequest): Promise<void> {
  const map = await loadLeaveBalancesMap();
  const balances = map[request.employeeId];
  if (!balances?.length) return;

  const updated = balances.map((balance) => {
    if (balance.type !== request.type) return balance;
    const used = balance.used + request.days;
    return {
      ...balance,
      used,
      remaining: Math.max(0, balance.total - used),
    } satisfies LeaveBalance;
  });

  await saveLeaveBalancesMap({ [request.employeeId]: updated });
}

function countSupervisors(employees: Employee[]): number {
  const withDirectReports = employees.filter((employee) =>
    employees.some(
      (other) =>
        other.employeeId !== employee.employeeId &&
        other.manager === getEmployeeDisplayName(employee)
    )
  ).length;

  if (withDirectReports > 0) {
    return withDirectReports;
  }

  return employees.filter((employee) => /manager|supervisor|lead/i.test(employee.position)).length;
}

export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  return loadLeaveRequests();
}

export async function getPendingApprovals(): Promise<LeaveRequest[]> {
  const all = await getAllLeaveRequests();
  return all.filter((r) => r.status === 'pending');
}

export async function reviewLeaveRequest(
  requestId: string,
  status: Exclude<LeaveStatus, 'pending'>,
  reviewedBy: string
): Promise<LeaveRequest> {
  const all = await getAllLeaveRequests();
  const target = all.find((r) => r.id === requestId);
  if (!target) {
    throw new Error('Leave request not found');
  }
  if (target.status !== 'pending') {
    throw new Error('Request already reviewed');
  }
  const updated: LeaveRequest = {
    ...target,
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy,
  };
  await saveLeaveRequests([updated]);
  if (status === 'approved') {
    await applyApprovedLeaveBalance(updated);
  }
  return updated;
}

export async function getAdminStats() {
  const [employees, pending] = await Promise.all([loadEmployees(), getPendingApprovals()]);
  return {
    totalEmployees: employees.length,
    totalSupervisors: countSupervisors(employees),
    pendingApprovals: pending.length,
    departments: [...new Set(employees.map((e) => e.department))].length,
  };
}

export async function enrichLeaveRequest(request: LeaveRequest) {
  const employee = await findEmployeeById(request.employeeId);
  return {
    ...request,
    employeeName: employee ? `${employee.firstName} ${employee.lastName}` : request.employeeId,
    department: employee?.department ?? '—',
    supervisor: employee?.manager ?? '—',
  };
}
