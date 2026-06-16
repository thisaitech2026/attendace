import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSION: '@workpulse/session',
  ATTENDANCE: '@workpulse/attendance',
  LEAVE_REQUESTS: '@workpulse/leave_requests',
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const storageKeys = KEYS;
