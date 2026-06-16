export type TabPictureKey = 'home' | 'time' | 'leave' | 'goals' | 'pay';

export const TAB_PICTURES: Record<
  TabPictureKey,
  { emoji: string; icon: { ios: string; android: string; web: string }; label: string }
> = {
  home: { emoji: '🏠', icon: { ios: 'house.fill', android: 'home', web: 'home' }, label: 'Home' },
  time: { emoji: '⏱️', icon: { ios: 'clock.fill', android: 'schedule', web: 'schedule' }, label: 'Time' },
  leave: { emoji: '📅', icon: { ios: 'calendar', android: 'event', web: 'event' }, label: 'Leave' },
  goals: { emoji: '🎯', icon: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }, label: 'Goals' },
  pay: { emoji: '💰', icon: { ios: 'dollarsign.circle.fill', android: 'payments', web: 'payments' }, label: 'Pay' },
};

export type QuickActionKey = 'leave' | 'time' | 'pay' | 'goals';

export const QUICK_ACTION_PICTURES: Record<
  QuickActionKey,
  { emoji: string; icon: { ios: string; android: string; web: string } }
> = {
  leave: { emoji: TAB_PICTURES.leave.emoji, icon: { ios: 'calendar.badge.plus', android: 'event_available', web: 'event_available' } },
  time: { emoji: TAB_PICTURES.time.emoji, icon: TAB_PICTURES.time.icon },
  pay: { emoji: TAB_PICTURES.pay.emoji, icon: TAB_PICTURES.pay.icon },
  goals: { emoji: TAB_PICTURES.goals.emoji, icon: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up', web: 'trending_up' } },
};
