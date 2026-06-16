import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEMO_LOGINS } from '@/constants/config';
import {
  enrichLeaveRequest,
  getAdminStats,
  getAllLeaveRequests,
  getPendingApprovals,
  reviewLeaveRequest,
} from '@/services/adminService';
import { loadChatMessages, sendChatMessage } from '@/services/chatService';
import {
  assignSupervisor,
  createNewHire,
  findEmployeeByEmail,
  getEmployeeDisplayName,
  getSupervisorOptions,
  loadEmployees,
  loadUsers,
} from '@/services/employeeRegistry';
import {
  getLeaveBalances,
  getLeaveRequests,
  getSalarySlips,
  loadAttendance,
  punchIn,
  punchOut,
  submitLeaveRequest,
} from '@/services/employeeService';
import { getItem, removeItem, setItem, storageKeys } from '@/services/storage';
import type { ChatCategory, ChatMessage } from '@/types/chat';
import type {
  AttendanceRecord,
  Employee,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  NewHireInput,
  PunchMethod,
  SalarySlip,
  UserRole,
} from '@/types/employee';

interface Session {
  role: UserRole;
  email: string;
  employeeId?: string;
  name: string;
}

export interface EnrichedLeaveRequest extends LeaveRequest {
  employeeName: string;
  department: string;
  supervisor: string;
}

interface AppContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  employee: Employee | null;
  adminName: string | null;
  attendance: AttendanceRecord[];
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  salarySlips: SalarySlip[];
  chatMessages: ChatMessage[];
  allEmployees: Employee[];
  pendingApprovals: EnrichedLeaveRequest[];
  adminStats: { totalEmployees: number; pendingApprovals: number; departments: number };
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
  doPunchIn: (method: PunchMethod, wifiSsid?: string | null) => Promise<void>;
  doPunchOut: (method: PunchMethod) => Promise<void>;
  requestLeave: (type: LeaveType, startDate: string, endDate: string, reason: string) => Promise<void>;
  sendMessage: (text: string, category?: ChatCategory) => Promise<void>;
  createHire: (input: NewHireInput) => Promise<Employee>;
  updateSupervisor: (employeeId: string, supervisorId: string) => Promise<void>;
  approveLeave: (requestId: string) => Promise<void>;
  rejectLeave: (requestId: string) => Promise<void>;
  getSupervisors: () => Promise<Employee[]>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<EnrichedLeaveRequest[]>([]);
  const [adminStats, setAdminStats] = useState({ totalEmployees: 0, pendingApprovals: 0, departments: 0 });

  const employeeId = employee?.employeeId ?? '';
  const role = session?.role ?? null;
  const isAdmin = role === 'admin';
  const salarySlips = useMemo(
    () => (employeeId ? getSalarySlips(employeeId) : []),
    [employeeId]
  );

  const refreshData = useCallback(async () => {
    const messages = await loadChatMessages();
    setChatMessages(messages);

    if (session?.role === 'admin') {
      const [employees, pending, stats] = await Promise.all([
        loadEmployees(),
        getPendingApprovals(),
        getAdminStats(),
      ]);
      const enriched = await Promise.all(pending.map((r) => enrichLeaveRequest(r)));
      setAllEmployees(employees);
      setPendingApprovals(enriched);
      setAdminStats(stats);
      return;
    }

    if (employeeId) {
      const [att, leaves, balances] = await Promise.all([
        loadAttendance(employeeId),
        getLeaveRequests(employeeId),
        getLeaveBalances(employeeId),
      ]);
      setAttendance(att);
      setLeaveRequests(leaves);
      setLeaveBalances(balances);
    }
  }, [employeeId, session?.role]);

  useEffect(() => {
    (async () => {
      const saved = await getItem<Session>(storageKeys.SESSION);
      if (saved) {
        setSession(saved);
        if (saved.role === 'employee' && saved.email) {
          const emp = await findEmployeeByEmail(saved.email);
          setEmployee(emp ?? null);
        }
      }
      const messages = await loadChatMessages();
      setChatMessages(messages);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (session) {
      refreshData();
    }
  }, [session, employeeId, refreshData]);

  const login = useCallback(async (email: string, password: string, loginRole: UserRole) => {
    const users = await loadUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === loginRole
    );
    if (!user) {
      throw new Error(`Invalid ${loginRole} credentials`);
    }

    if (user.role === 'admin') {
      const newSession: Session = { role: 'admin', email: user.email, name: user.name };
      await setItem(storageKeys.SESSION, newSession);
      setSession(newSession);
      setEmployee(null);
      return;
    }

    const emp = await findEmployeeByEmail(user.email);
    if (!emp) {
      throw new Error('Employee record not found');
    }
    const newSession: Session = {
      role: 'employee',
      email: user.email,
      employeeId: user.employeeId,
      name: user.name,
    };
    await setItem(storageKeys.SESSION, newSession);
    setSession(newSession);
    setEmployee(emp);
  }, []);

  const logout = useCallback(async () => {
    await removeItem(storageKeys.SESSION);
    setSession(null);
    setEmployee(null);
    setAttendance([]);
    setLeaveRequests([]);
    setLeaveBalances([]);
    setAllEmployees([]);
    setPendingApprovals([]);
    setAdminStats({ totalEmployees: 0, pendingApprovals: 0, departments: 0 });
  }, []);

  const doPunchIn = useCallback(
    async (method: PunchMethod, wifiSsid: string | null = null) => {
      if (!employeeId) return;
      await punchIn(employeeId, method, wifiSsid);
      await refreshData();
    },
    [employeeId, refreshData]
  );

  const doPunchOut = useCallback(
    async (method: PunchMethod) => {
      if (!employeeId) return;
      await punchOut(employeeId, method);
      await refreshData();
    },
    [employeeId, refreshData]
  );

  const requestLeave = useCallback(
    async (type: LeaveType, startDate: string, endDate: string, reason: string) => {
      if (!employeeId) return;
      await submitLeaveRequest(employeeId, type, startDate, endDate, reason);
      await refreshData();
    },
    [employeeId, refreshData]
  );

  const sendMessage = useCallback(
    async (text: string, category: ChatCategory = 'general') => {
      if (!session) return;
      if (employee) {
        const message = await sendChatMessage(
          employee.employeeId,
          getEmployeeDisplayName(employee),
          employee.department,
          text,
          category
        );
        setChatMessages((prev) => [...prev, message]);
        return;
      }
      if (isAdmin) {
        const message = await sendChatMessage('ADMIN', session.name, 'Human Resources', text, category);
        setChatMessages((prev) => [...prev, message]);
      }
    },
    [employee, session, isAdmin]
  );

  const createHire = useCallback(async (input: NewHireInput) => {
    const created = await createNewHire(input);
    await refreshData();
    return created;
  }, [refreshData]);

  const updateSupervisor = useCallback(async (empId: string, supervisorId: string) => {
    await assignSupervisor(empId, supervisorId);
    await refreshData();
  }, [refreshData]);

  const approveLeave = useCallback(
    async (requestId: string) => {
      await reviewLeaveRequest(requestId, 'approved', session?.name ?? 'HR Admin');
      await refreshData();
    },
    [session?.name, refreshData]
  );

  const rejectLeave = useCallback(
    async (requestId: string) => {
      await reviewLeaveRequest(requestId, 'rejected', session?.name ?? 'HR Admin');
      await refreshData();
    },
    [session?.name, refreshData]
  );

  const getSupervisors = useCallback(() => getSupervisorOptions(), []);

  const value = useMemo<AppContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!session,
      role,
      isAdmin,
      employee,
      adminName: isAdmin ? session?.name ?? null : null,
      attendance,
      leaveBalances,
      leaveRequests,
      salarySlips,
      chatMessages,
      allEmployees,
      pendingApprovals,
      adminStats,
      login,
      logout,
      refreshData,
      doPunchIn,
      doPunchOut,
      requestLeave,
      sendMessage,
      createHire,
      updateSupervisor,
      approveLeave,
      rejectLeave,
      getSupervisors,
    }),
    [
      isLoading,
      session,
      role,
      isAdmin,
      employee,
      attendance,
      leaveBalances,
      leaveRequests,
      salarySlips,
      chatMessages,
      allEmployees,
      pendingApprovals,
      adminStats,
      login,
      logout,
      refreshData,
      doPunchIn,
      doPunchOut,
      requestLeave,
      sendMessage,
      createHire,
      updateSupervisor,
      approveLeave,
      rejectLeave,
      getSupervisors,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { DEMO_LOGINS };
