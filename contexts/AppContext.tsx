import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { MOCK_USERS } from '@/constants/config';
import { loadChatMessages, sendChatMessage } from '@/services/chatService';
import {
  findEmployeeByEmail,
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
  PunchMethod,
  SalarySlip,
} from '@/types/employee';

interface Session {
  employeeId: string;
  email: string;
}

interface AppContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  employee: Employee | null;
  attendance: AttendanceRecord[];
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  salarySlips: SalarySlip[];
  chatMessages: ChatMessage[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
  doPunchIn: (method: PunchMethod, wifiSsid?: string | null) => Promise<void>;
  doPunchOut: (method: PunchMethod) => Promise<void>;
  requestLeave: (
    type: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ) => Promise<void>;
  sendMessage: (text: string, category?: ChatCategory) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const employeeId = employee?.employeeId ?? '';

  const leaveBalances = useMemo(
    () => (employeeId ? getLeaveBalances(employeeId) : []),
    [employeeId]
  );
  const salarySlips = useMemo(
    () => (employeeId ? getSalarySlips(employeeId) : []),
    [employeeId]
  );

  const refreshData = useCallback(async () => {
    const [att, leaves, messages] = await Promise.all([
      employeeId ? loadAttendance(employeeId) : Promise.resolve([]),
      employeeId ? getLeaveRequests(employeeId) : Promise.resolve([]),
      loadChatMessages(),
    ]);
    setAttendance(att);
    setLeaveRequests(leaves);
    setChatMessages(messages);
  }, [employeeId]);

  useEffect(() => {
    (async () => {
      const saved = await getItem<Session>(storageKeys.SESSION);
      if (saved) {
        const emp = findEmployeeByEmail(saved.email);
        if (emp) {
          setSession(saved);
          setEmployee(emp);
        }
      }
      const messages = await loadChatMessages();
      setChatMessages(messages);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (employeeId) {
      refreshData();
    }
  }, [employeeId, refreshData]);

  const login = useCallback(async (email: string, password: string) => {
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const emp = findEmployeeByEmail(email);
    if (!emp) {
      throw new Error('Employee record not found');
    }
    const newSession = { employeeId: user.employeeId, email: user.email };
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
      if (!employee) return;
      const message = await sendChatMessage(
        employee.employeeId,
        `${employee.firstName} ${employee.lastName}`,
        employee.department,
        text,
        category
      );
      setChatMessages((prev) => [...prev, message]);
    },
    [employee]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!session,
      employee,
      attendance,
      leaveBalances,
      leaveRequests,
      salarySlips,
      chatMessages,
      login,
      logout,
      refreshData,
      doPunchIn,
      doPunchOut,
      requestLeave,
      sendMessage,
    }),
    [
      isLoading,
      session,
      employee,
      attendance,
      leaveBalances,
      leaveRequests,
      salarySlips,
      chatMessages,
      login,
      logout,
      refreshData,
      doPunchIn,
      doPunchOut,
      requestLeave,
      sendMessage,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
