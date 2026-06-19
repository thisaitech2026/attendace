import { getEmployeeAvatarUri } from '@/components/ui/EmployeeAvatar';
import {
  createNewHireRecords,
  loadEmployees as loadEmployeesFromFirestore,
  loadLeaveBalancesMap,
  loadUsers as loadUsersFromFirestore,
  saveEmployees as saveEmployeesToFirestore,
  saveLeaveBalancesMap,
  saveUsers as saveUsersToFirestore,
} from '@/services/firestoreRepository';
import type { AppUser, Employee, LeaveBalance, NewHireInput, RegisterInput } from '@/types/employee';

export async function loadEmployees(): Promise<Employee[]> {
  return loadEmployeesFromFirestore();
}

export async function saveEmployees(employees: Employee[]): Promise<void> {
  await saveEmployeesToFirestore(employees);
}

export async function loadUsers(): Promise<AppUser[]> {
  return loadUsersFromFirestore();
}

export async function saveUsers(users: AppUser[]): Promise<void> {
  await saveUsersToFirestore(users);
}

export async function findEmployeeByEmail(email: string): Promise<Employee | undefined> {
  const employees = await loadEmployees();
  return employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
}

export async function findEmployeeById(employeeId: string): Promise<Employee | undefined> {
  const employees = await loadEmployees();
  return employees.find((e) => e.employeeId === employeeId);
}

export function getEmployeeDisplayName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`;
}

export async function getLeaveBalances(employeeId: string): Promise<LeaveBalance[]> {
  const map = await loadLeaveBalancesMap();
  return map[employeeId] ?? [];
}

function nextEmployeeId(employees: Employee[]): string {
  const nums = employees
    .map((e) => parseInt(e.employeeId.replace('EMP', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `EMP${String(next).padStart(3, '0')}`;
}

export async function createNewHire(input: NewHireInput): Promise<Employee> {
  const employees = await loadEmployees();
  const users = await loadUsers();

  const supervisor = employees.find((e) => e.employeeId === input.supervisorId);
  if (!supervisor) {
    throw new Error('Supervisor not found. Please select a supervisor.');
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const employeeId = nextEmployeeId(employees);
  const employee: Employee = {
    id: String(Date.now()),
    employeeId,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: normalizedEmail,
    phone: input.phone.trim(),
    department: input.department.trim(),
    position: input.position.trim(),
    manager: getEmployeeDisplayName(supervisor),
    joinDate: input.joinDate,
    address: input.address.trim(),
    emergencyContact: input.emergencyContact.trim(),
    avatar: getEmployeeAvatarUri({ employeeId, email: normalizedEmail }),
  };

  const user: AppUser = {
    email: employee.email,
    password: input.tempPassword,
    role: 'employee',
    employeeId,
    name: getEmployeeDisplayName(employee),
  };

  const defaultBalances: LeaveBalance[] = [
    { type: 'annual', total: 20, used: 0, remaining: 20 },
    { type: 'sick', total: 10, used: 0, remaining: 10 },
    { type: 'personal', total: 5, used: 0, remaining: 5 },
    { type: 'unpaid', total: 0, used: 0, remaining: 0 },
  ];

  await createNewHireRecords(employee, user, defaultBalances);
  return employee;
}

export async function registerEmployee(input: RegisterInput): Promise<Employee> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const password = input.password;

  if (!firstName || !lastName) {
    throw new Error('Please enter your first and last name.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const employees = await loadEmployees();
  const supervisors = await getSupervisorOptions();
  const supervisor = supervisors[0];
  if (!supervisor) {
    throw new Error('Registration is unavailable right now. Please contact HR.');
  }

  const today = new Date().toISOString().split('T')[0];
  return createNewHire({
    firstName,
    lastName,
    email: input.email,
    phone: input.phone?.trim() ?? '',
    department: 'Engineering',
    position: 'Software Engineer',
    supervisorId: supervisor.employeeId,
    address: '',
    emergencyContact: '',
    joinDate: today,
    tempPassword: password,
  });
}

export async function assignSupervisor(employeeId: string, supervisorId: string): Promise<Employee> {
  const employees = await loadEmployees();
  const employee = employees.find((e) => e.employeeId === employeeId);
  const supervisor = employees.find((e) => e.employeeId === supervisorId);
  if (!employee || !supervisor) {
    throw new Error('Employee or supervisor not found');
  }
  const updated = { ...employee, manager: getEmployeeDisplayName(supervisor) };
  await saveEmployees(employees.map((e) => (e.employeeId === employeeId ? updated : e)));
  return updated;
}

export async function getSupervisorOptions(): Promise<Employee[]> {
  const employees = await loadEmployees();
  const managers = employees.filter((employee) =>
    /manager|supervisor|lead|director|head/i.test(employee.position)
  );
  const withReports = employees.filter((employee) =>
    employees.some(
      (other) =>
        other.employeeId !== employee.employeeId &&
        other.manager === getEmployeeDisplayName(employee)
    )
  );
  const combined = [...new Map([...managers, ...withReports].map((e) => [e.employeeId, e])).values()];
  return combined.length > 0 ? combined : employees;
}
