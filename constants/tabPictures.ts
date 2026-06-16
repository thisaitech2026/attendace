export type TabPictureKey = 'home' | 'time' | 'leave' | 'chat' | 'pay';

export const TAB_PICTURES: Record<
  TabPictureKey,
  { emoji: string; icon: { ios: string; android: string; web: string }; label: string }
> = {
  home: { emoji: '🏠', icon: { ios: 'house.fill', android: 'home', web: 'home' }, label: 'Home' },
  time: { emoji: '⏱️', icon: { ios: 'clock.fill', android: 'schedule', web: 'schedule' }, label: 'Time' },
  leave: { emoji: '📅', icon: { ios: 'calendar', android: 'event', web: 'event' }, label: 'Leave' },
  chat: { emoji: '💬', icon: { ios: 'bubble.left.and.bubble.right.fill', android: 'chat', web: 'chat' }, label: 'Chat' },
  pay: { emoji: '💰', icon: { ios: 'dollarsign.circle.fill', android: 'payments', web: 'payments' }, label: 'Pay' },
};

export type QuickActionKey = 'leave' | 'time' | 'pay' | 'chat';

export const QUICK_ACTION_PICTURES: Record<
  QuickActionKey,
  { emoji: string; icon: { ios: string; android: string; web: string } }
> = {
  leave: { emoji: TAB_PICTURES.leave.emoji, icon: { ios: 'calendar.badge.plus', android: 'event_available', web: 'event_available' } },
  time: { emoji: TAB_PICTURES.time.emoji, icon: TAB_PICTURES.time.icon },
  pay: { emoji: TAB_PICTURES.pay.emoji, icon: TAB_PICTURES.pay.icon },
  chat: { emoji: TAB_PICTURES.chat.emoji, icon: TAB_PICTURES.chat.icon },
};

export const CHAT_CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  update: 'Update',
  'sick-leave': 'Sick Leave',
  leave: 'Leave',
};
