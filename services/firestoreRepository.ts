import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { INITIAL_USERS } from '@/constants/config';
import { FIRESTORE_COLLECTIONS } from '@/constants/firestoreCollections';
import {
  INITIAL_TEAM_MESSAGES,
} from '@/data/mockChat';
import {
  MOCK_EMPLOYEES,
  MOCK_LEAVE_BALANCES,
  MOCK_LEAVE_REQUESTS,
  MOCK_PERFORMANCE,
  MOCK_SALARY,
  getInitialAttendance,
} from '@/data/mockData';
import { firestore } from '@/services/firebase';
import type { ChatMessage } from '@/types/chat';
import type {
  AppUser,
  AttendanceRecord,
  Employee,
  LeaveBalance,
  LeaveRequest,
  PerformanceReview,
  SalarySlip,
} from '@/types/employee';

let seedPromise: Promise<void> | null = null;

function usersCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.USERS);
}

function employeesCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.EMPLOYEES);
}

function leaveBalancesCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.LEAVE_BALANCES);
}

function attendanceCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.ATTENDANCE);
}

function leaveRequestsCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.LEAVE_REQUESTS);
}

function chatMessagesCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.CHAT_MESSAGES);
}

function salarySlipsCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.SALARY_SLIPS);
}

function performanceReviewsCollection() {
  return collection(firestore, FIRESTORE_COLLECTIONS.PERFORMANCE_REVIEWS);
}

function userDocId(email: string) {
  return email.trim().toLowerCase();
}

export async function ensureFirestoreSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedFirestoreIfNeeded();
  }
  await seedPromise;
}

async function seedFirestoreIfNeeded(): Promise<void> {
  const metaRef = doc(firestore, FIRESTORE_COLLECTIONS.META, 'app');
  const metaSnap = await getDoc(metaRef);
  if (metaSnap.exists() && metaSnap.data()?.seeded) {
    return;
  }

  const batch = writeBatch(firestore);

  INITIAL_USERS.forEach((user) => {
    batch.set(doc(usersCollection(), userDocId(user.email)), user);
  });

  MOCK_EMPLOYEES.forEach((employee) => {
    batch.set(doc(employeesCollection(), employee.employeeId), employee);
  });

  Object.entries(MOCK_LEAVE_BALANCES).forEach(([employeeId, balances]) => {
    batch.set(doc(leaveBalancesCollection(), employeeId), { employeeId, balances });
  });

  getInitialAttendance().forEach((record) => {
    batch.set(doc(attendanceCollection(), record.id), record);
  });

  MOCK_LEAVE_REQUESTS.forEach((request) => {
    batch.set(doc(leaveRequestsCollection(), request.id), request);
  });

  INITIAL_TEAM_MESSAGES.forEach((message) => {
    batch.set(doc(chatMessagesCollection(), message.id), message);
  });

  MOCK_SALARY.forEach((slip) => {
    batch.set(doc(salarySlipsCollection(), slip.id), slip);
  });

  MOCK_PERFORMANCE.forEach((review) => {
    batch.set(doc(performanceReviewsCollection(), review.id), review);
  });

  batch.set(metaRef, {
    seeded: true,
    seededAt: new Date().toISOString(),
    appName: 'thisAI',
  });

  await batch.commit();
}

export async function createNewHireRecords(
  employee: Employee,
  user: AppUser,
  leaveBalances: LeaveBalance[]
): Promise<void> {
  const batch = writeBatch(firestore);
  batch.set(doc(employeesCollection(), employee.employeeId), employee);
  batch.set(doc(usersCollection(), userDocId(user.email)), user);
  batch.set(doc(leaveBalancesCollection(), employee.employeeId), { employeeId: employee.employeeId, balances: leaveBalances });
  await batch.commit();
}

export async function loadUsers(): Promise<AppUser[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(usersCollection());
  return snapshot.docs.map((item) => item.data() as AppUser);
}

export async function saveUsers(users: AppUser[]): Promise<void> {
  const batch = writeBatch(firestore);
  users.forEach((user) => {
    batch.set(doc(usersCollection(), userDocId(user.email)), user);
  });
  await batch.commit();
}

export async function loadEmployees(): Promise<Employee[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(employeesCollection());
  const mockById = Object.fromEntries(MOCK_EMPLOYEES.map((employee) => [employee.employeeId, employee]));

  return snapshot.docs.map((item) => {
    const employee = item.data() as Employee;
    if (employee.avatar) return employee;

    const mockAvatar = mockById[employee.employeeId]?.avatar;
    return mockAvatar ? { ...employee, avatar: mockAvatar } : employee;
  });
}

export async function saveEmployees(employees: Employee[]): Promise<void> {
  const batch = writeBatch(firestore);
  employees.forEach((employee) => {
    batch.set(doc(employeesCollection(), employee.employeeId), employee);
  });
  await batch.commit();
}

export async function loadLeaveBalancesMap(): Promise<Record<string, LeaveBalance[]>> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(leaveBalancesCollection());
  const map: Record<string, LeaveBalance[]> = {};
  snapshot.docs.forEach((item) => {
    const data = item.data() as { employeeId: string; balances: LeaveBalance[] };
    map[data.employeeId] = data.balances;
  });
  return map;
}

export async function saveLeaveBalancesMap(map: Record<string, LeaveBalance[]>): Promise<void> {
  const batch = writeBatch(firestore);
  Object.entries(map).forEach(([employeeId, balances]) => {
    batch.set(doc(leaveBalancesCollection(), employeeId), { employeeId, balances });
  });
  await batch.commit();
}

export async function loadAllAttendance(): Promise<AttendanceRecord[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(attendanceCollection());
  return snapshot.docs.map((item) => item.data() as AttendanceRecord);
}

export async function loadAttendanceForEmployee(employeeId: string): Promise<AttendanceRecord[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(query(attendanceCollection(), where('employeeId', '==', employeeId)));
  return snapshot.docs.map((item) => item.data() as AttendanceRecord);
}

export async function saveAttendanceRecords(records: AttendanceRecord[]): Promise<void> {
  const batch = writeBatch(firestore);
  records.forEach((record) => {
    batch.set(doc(attendanceCollection(), record.id), record);
  });
  await batch.commit();
}

export async function loadLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
  await ensureFirestoreSeed();
  const snapshot = employeeId
    ? await getDocs(query(leaveRequestsCollection(), where('employeeId', '==', employeeId)))
    : await getDocs(leaveRequestsCollection());
  return snapshot.docs
    .map((item) => item.data() as LeaveRequest)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function saveLeaveRequests(requests: LeaveRequest[]): Promise<void> {
  const batch = writeBatch(firestore);
  requests.forEach((request) => {
    batch.set(doc(leaveRequestsCollection(), request.id), request);
  });
  await batch.commit();
}

export async function loadChatMessages(): Promise<ChatMessage[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(chatMessagesCollection());
  return snapshot.docs
    .map((item) => item.data() as ChatMessage)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function saveChatMessage(message: ChatMessage): Promise<void> {
  await setDoc(doc(chatMessagesCollection(), message.id), message);
}

export async function loadSalarySlips(employeeId: string): Promise<SalarySlip[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(query(salarySlipsCollection(), where('employeeId', '==', employeeId)));
  return snapshot.docs
    .map((item) => item.data() as SalarySlip)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month.localeCompare(a.month);
    });
}

export async function loadPerformanceReviews(employeeId: string): Promise<PerformanceReview[]> {
  await ensureFirestoreSeed();
  const snapshot = await getDocs(query(performanceReviewsCollection(), where('employeeId', '==', employeeId)));
  return snapshot.docs.map((item) => item.data() as PerformanceReview);
}
