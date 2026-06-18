import {
  loadEmployees as loadEmployeesFromFirestore,
  loadLeaveBalancesMap,
  loadUsers as loadUsersFromFirestore,
  saveEmployees as saveEmployeesToFirestore,
  saveLeaveBalancesMap,
  saveUsers as saveUsersToFirestore,
} from '@/services/firestoreRepository';
import type { AppUser, Employee, LeaveBalance, NewHireInput } from '@/types/employee';

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

  await saveEmployees([employee]);
  await saveUsers([user]);
  await saveLeaveBalancesMap({ [employeeId]: defaultBalances });
  return employee;
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
  return loadEmployees();
}
