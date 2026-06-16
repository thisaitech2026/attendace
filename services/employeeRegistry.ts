import { INITIAL_USERS } from '@/constants/config';
import { MOCK_EMPLOYEES, MOCK_LEAVE_BALANCES } from '@/data/mockData';
import { getItem, setItem, storageKeys } from '@/services/storage';
import type { AppUser, Employee, LeaveBalance, NewHireInput } from '@/types/employee';

export async function loadEmployees(): Promise<Employee[]> {
  const stored = await getItem<Employee[]>(storageKeys.EMPLOYEES);
  return stored ?? MOCK_EMPLOYEES;
}

export async function saveEmployees(employees: Employee[]): Promise<void> {
  await setItem(storageKeys.EMPLOYEES, employees);
}

export async function loadUsers(): Promise<AppUser[]> {
  const stored = await getItem<AppUser[]>(storageKeys.USERS);
  return stored ?? INITIAL_USERS;
}

export async function saveUsers(users: AppUser[]): Promise<void> {
  await setItem(storageKeys.USERS, users);
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

export async function loadLeaveBalancesMap(): Promise<Record<string, LeaveBalance[]>> {
  const stored = await getItem<Record<string, LeaveBalance[]>>(storageKeys.LEAVE_BALANCES);
  return stored ?? MOCK_LEAVE_BALANCES;
}

async function saveLeaveBalancesMap(map: Record<string, LeaveBalance[]>): Promise<void> {
  await setItem(storageKeys.LEAVE_BALANCES, map);
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
  const balances = await loadLeaveBalancesMap();

  const supervisor = employees.find((e) => e.employeeId === input.supervisorId);
  if (!supervisor) {
    throw new Error('Supervisor not found');
  }

  const employeeId = nextEmployeeId(employees);
  const employee: Employee = {
    id: String(Date.now()),
    employeeId,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
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

  balances[employeeId] = [
    { type: 'annual', total: 20, used: 0, remaining: 20 },
    { type: 'sick', total: 10, used: 0, remaining: 10 },
    { type: 'personal', total: 5, used: 0, remaining: 5 },
    { type: 'unpaid', total: 0, used: 0, remaining: 0 },
  ];

  await saveEmployees([...employees, employee]);
  await saveUsers([...users, user]);
  await saveLeaveBalancesMap(balances);
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
  const employees = await loadEmployees();
  return employees;
}
