import type { ChatMessage } from '@/types/chat';

export const INITIAL_TEAM_MESSAGES: ChatMessage[] = [
  {
    id: 'msg1',
    employeeId: 'EMP002',
    senderName: 'Jane Smith',
    department: 'Human Resources',
    text: 'Reminder: Please submit leave requests at least 3 days in advance.',
    category: 'update',
    createdAt: '2026-06-16T08:30:00Z',
  },
  {
    id: 'msg2',
    employeeId: 'EMP001',
    senderName: 'John Doe',
    department: 'Engineering',
    text: 'I will be on sick leave today. Feeling unwell — will update if anything changes.',
    category: 'sick-leave',
    createdAt: '2026-06-16T09:15:00Z',
  },
  {
    id: 'msg3',
    employeeId: 'EMP002',
    senderName: 'Jane Smith',
    department: 'Human Resources',
    text: 'Thanks John, hope you feel better. Get well soon!',
    category: 'general',
    createdAt: '2026-06-16T09:22:00Z',
  },
  {
    id: 'msg4',
    employeeId: 'EMP001',
    senderName: 'John Doe',
    department: 'Engineering',
    text: 'Team standup moved to 11 AM today due to client call.',
    category: 'update',
    createdAt: '2026-06-16T10:05:00Z',
  },
];
