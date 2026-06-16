import { INITIAL_TEAM_MESSAGES } from '@/data/mockChat';
import { getItem, setItem, storageKeys } from '@/services/storage';
import type { ChatCategory, ChatMessage } from '@/types/chat';

export async function loadChatMessages(): Promise<ChatMessage[]> {
  const stored = await getItem<ChatMessage[]>(storageKeys.CHAT_MESSAGES);
  return stored ?? INITIAL_TEAM_MESSAGES;
}

export async function sendChatMessage(
  employeeId: string,
  senderName: string,
  department: string,
  text: string,
  category: ChatCategory = 'general'
): Promise<ChatMessage> {
  const messages = await loadChatMessages();
  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    employeeId,
    senderName,
    department,
    text: text.trim(),
    category,
    createdAt: new Date().toISOString(),
  };
  await setItem(storageKeys.CHAT_MESSAGES, [...messages, message]);
  return message;
}
