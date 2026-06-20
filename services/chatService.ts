import { loadChatMessages as loadMessages, saveChatMessage as saveMessage } from '@/services/firestoreRepository';
import type { ChatCategory, ChatMessage } from '@/types/chat';

export async function loadChatMessages(): Promise<ChatMessage[]> {
  return loadMessages();
}

export async function sendChatMessage(
  employeeId: string,
  senderName: string,
  department: string,
  text: string,
  category: ChatCategory = 'general'
): Promise<ChatMessage> {
  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    employeeId,
    senderName,
    department,
    text: text.trim(),
    category,
    createdAt: new Date().toISOString(),
  };
  await saveMessage(message);
  return message;
}
