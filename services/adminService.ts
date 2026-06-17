import { findEmployeeById, loadEmployees } from '@/services/employeeRegistry';
import { loadLeaveRequests, saveLeaveRequests } from '@/services/firestoreRepository';
import type { LeaveRequest, LeaveStatus } from '@/types/employee';

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
  return updated;
}

export async function getAdminStats() {
  const [employees, pending] = await Promise.all([loadEmployees(), getPendingApprovals()]);
  return {
    totalEmployees: employees.length,
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
