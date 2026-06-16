import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { ALLOWED_WIFI_SSIDS } from '@/constants/config';

export interface WifiVerificationResult {
  valid: boolean;
  ssid: string | null;
  connectionType: string;
  message: string;
}

function normalizeSsid(ssid: string): string {
  return ssid.replace(/^"|"$/g, '').trim();
}

function isAllowedSsid(ssid: string): boolean {
  const normalized = normalizeSsid(ssid).toLowerCase();
  return ALLOWED_WIFI_SSIDS.some((allowed) => allowed.toLowerCase() === normalized);
}

export async function requestWifiPermissions(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentWifiInfo(): Promise<{
  ssid: string | null;
  connectionType: string;
  isWifi: boolean;
}> {
  const state = await NetInfo.fetch();
  const isWifi = state.type === 'wifi';
  let ssid: string | null = null;

  if (isWifi && state.details && 'ssid' in state.details) {
    const raw = state.details.ssid;
    ssid = raw ? normalizeSsid(String(raw)) : null;
  }

  return {
    ssid,
    connectionType: state.type,
    isWifi,
  };
}

export async function verifyOfficeWifi(): Promise<WifiVerificationResult> {
  const hasPermission = await requestWifiPermissions();
  if (!hasPermission) {
    return {
      valid: false,
      ssid: null,
      connectionType: 'unknown',
      message:
        Platform.OS === 'web'
          ? 'WiFi verification is not available on web. Use manual punch or run on a device.'
          : 'Location permission is required to verify office WiFi.',
    };
  }

  const { ssid, connectionType, isWifi } = await getCurrentWifiInfo();

  if (!isWifi) {
    return {
      valid: false,
      ssid: null,
      connectionType,
      message: 'You must be connected to WiFi to punch in at the office.',
    };
  }

  if (!ssid) {
    return {
      valid: false,
      ssid: null,
      connectionType,
      message:
        'Could not detect WiFi network name. Ensure location services are enabled and try again.',
    };
  }

  const valid = isAllowedSsid(ssid);
  return {
    valid,
    ssid,
    connectionType,
    message: valid
      ? `Verified on office network: ${ssid}`
      : `"${ssid}" is not an approved office network.`,
  };
}

export function getAllowedNetworks(): string[] {
  return [...ALLOWED_WIFI_SSIDS];
}
