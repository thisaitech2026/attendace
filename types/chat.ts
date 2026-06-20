export type ChatCategory = 'general' | 'update' | 'sick-leave' | 'leave';

export interface ChatMessage {
  id: string;
  employeeId: string;
  senderName: string;
  department: string;
  text: string;
  category: ChatCategory;
  createdAt: string;
}
