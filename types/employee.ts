export type PunchMethod = 'wifi' | 'manual';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager: string;
  joinDate: string;
  avatar?: string;
  address: string;
  emergencyContact: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  punchInMethod: PunchMethod | null;
  punchOutMethod: PunchMethod | null;
  wifiSsid: string | null;
  hoursWorked: number;
  status: 'present' | 'absent' | 'half-day' | 'late';
  manualApprovalStatus?: 'pending' | 'approved' | 'rejected';
}

export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  period: string;
  rating: number;
  goals: { title: string; completed: boolean }[];
  strengths: string[];
  improvements: string[];
  reviewer: string;
  reviewDate: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
  paymentDate: string;
  status: 'paid' | 'pending';
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type UserRole = 'employee' | 'admin';

export interface AppUser extends UserCredentials {
  role: UserRole;
  employeeId?: string;
  name: string;
}

export interface NewHireInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  supervisorId: string;
  address: string;
  emergencyContact: string;
  joinDate: string;
  tempPassword: string;
}
