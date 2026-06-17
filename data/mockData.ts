import type {
  AttendanceRecord,
  Employee,
  LeaveBalance,
  LeaveRequest,
  PerformanceReview,
  SalarySlip,
} from '@/types/employee';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    manager: 'Sarah Johnson',
    joinDate: '2021-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
    address: '123 Tech Street, San Francisco, CA 94102',
    emergencyContact: 'Jane Doe — +1 (555) 987-6543',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Human Resources',
    position: 'HR Manager',
    manager: 'Michael Brown',
    joinDate: '2019-08-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    address: '456 People Ave, Austin, TX 78701',
    emergencyContact: 'Robert Smith — +1 (555) 876-5432',
  },
];

export const MOCK_LEAVE_BALANCES: Record<string, LeaveBalance[]> = {
  EMP001: [
    { type: 'annual', total: 20, used: 8, remaining: 12 },
    { type: 'sick', total: 10, used: 2, remaining: 8 },
    { type: 'personal', total: 5, used: 1, remaining: 4 },
    { type: 'unpaid', total: 0, used: 0, remaining: 0 },
  ],
  EMP002: [
    { type: 'annual', total: 22, used: 5, remaining: 17 },
    { type: 'sick', total: 12, used: 3, remaining: 9 },
    { type: 'personal', total: 5, used: 0, remaining: 5 },
    { type: 'unpaid', total: 0, used: 0, remaining: 0 },
  ],
};

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    employeeId: 'EMP001',
    type: 'annual',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    submittedAt: '2026-05-10T10:00:00Z',
    reviewedAt: '2026-05-12T14:30:00Z',
  },
  {
    id: 'lr2',
    employeeId: 'EMP001',
    type: 'sick',
    startDate: '2026-06-02',
    endDate: '2026-06-02',
    days: 1,
    reason: 'Medical appointment',
    status: 'pending',
    submittedAt: '2026-06-01T09:00:00Z',
  },
];

export const MOCK_PERFORMANCE: PerformanceReview[] = [
  {
    id: 'pr1',
    employeeId: 'EMP001',
    period: 'Q1 2026',
    rating: 4.5,
    goals: [
      { title: 'Deliver mobile app v2.0', completed: true },
      { title: 'Mentor 2 junior developers', completed: true },
      { title: 'Reduce bug count by 20%', completed: false },
    ],
    strengths: ['Technical leadership', 'Cross-team collaboration', 'Problem solving'],
    improvements: ['Documentation', 'Time estimation'],
    reviewer: 'Sarah Johnson',
    reviewDate: '2026-04-15',
  },
  {
    id: 'pr2',
    employeeId: 'EMP001',
    period: 'Q4 2025',
    rating: 4.2,
    goals: [
      { title: 'Complete API migration', completed: true },
      { title: 'Lead sprint planning', completed: true },
      { title: 'Present at tech talk', completed: true },
    ],
    strengths: ['Code quality', 'Initiative'],
    improvements: ['Delegation'],
    reviewer: 'Sarah Johnson',
    reviewDate: '2026-01-10',
  },
];

export const MOCK_SALARY: SalarySlip[] = [
  {
    id: 'sal1',
    employeeId: 'EMP001',
    month: 'May',
    year: 2026,
    basic: 8500,
    allowances: 1200,
    deductions: 980,
    netPay: 8720,
    paymentDate: '2026-05-30',
    status: 'paid',
  },
  {
    id: 'sal2',
    employeeId: 'EMP001',
    month: 'April',
    year: 2026,
    basic: 8500,
    allowances: 1200,
    deductions: 980,
    netPay: 8720,
    paymentDate: '2026-04-30',
    status: 'paid',
  },
  {
    id: 'sal3',
    employeeId: 'EMP001',
    month: 'June',
    year: 2026,
    basic: 8500,
    allowances: 1200,
    deductions: 980,
    netPay: 8720,
    paymentDate: '2026-06-30',
    status: 'pending',
  },
];

export function createTodayAttendance(employeeId: string): AttendanceRecord {
  const today = new Date().toISOString().split('T')[0];
  return {
    id: `att-${employeeId}-${today}`,
    employeeId,
    date: today,
    punchIn: null,
    punchOut: null,
    punchInMethod: null,
    punchOutMethod: null,
    wifiSsid: null,
    hoursWorked: 0,
    status: 'absent',
  };
}

export function getInitialAttendance(): AttendanceRecord[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split('T')[0];

  return [
    {
      id: 'att-EMP001-yesterday',
      employeeId: 'EMP001',
      date: yDate,
      punchIn: '09:02:00',
      punchOut: '18:15:00',
      punchInMethod: 'wifi',
      punchOutMethod: 'wifi',
      wifiSsid: 'THISAI',
      hoursWorked: 9.2,
      status: 'present',
    },
  ];
}
