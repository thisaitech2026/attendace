import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import { ALLOWED_WIFI_SSIDS } from '@/constants/config';
import { formatOfficeNetworkLabel, isOfficeIpAddress } from '@/utils/officeNetwork';

export interface WifiVerificationResult {
  valid: boolean;
  ssid: string | null;
  ipAddress: string | null;
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
  ipAddress: string | null;
  connectionType: string;
  isWifi: boolean;
}> {
  const state = await NetInfo.fetch();
  const isWifi = state.type === 'wifi';
  let ssid: string | null = null;
  let ipAddress: string | null = null;

  if (isWifi && state.details && 'ssid' in state.details) {
    const raw = state.details.ssid;
    ssid = raw ? normalizeSsid(String(raw)) : null;
  }

  if (isWifi && state.details && 'ipAddress' in state.details) {
    const rawIp = state.details.ipAddress;
    ipAddress = rawIp ? String(rawIp).trim() : null;
  }

  return {
    ssid,
    ipAddress,
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
      ipAddress: null,
      connectionType: 'unknown',
      message:
        Platform.OS === 'web'
          ? 'WiFi verification is not available on web. Use manual punch or run on a device.'
          : 'Location permission is required to verify office WiFi.',
    };
  }

  const { ssid, ipAddress, connectionType, isWifi } = await getCurrentWifiInfo();

  if (!isWifi) {
    return {
      valid: false,
      ssid: null,
      ipAddress,
      connectionType,
      message: `You must be connected to ${formatOfficeNetworkLabel()} to punch in at the office.`,
    };
  }

  if (!ssid) {
    return {
      valid: false,
      ssid: null,
      ipAddress,
      connectionType,
      message:
        'Could not detect WiFi network name. Enable location services and ensure you are on THISAI.',
    };
  }

  if (!isAllowedSsid(ssid)) {
    return {
      valid: false,
      ssid,
      ipAddress,
      connectionType,
      message: `"${ssid}" is not the office network. Connect to ${formatOfficeNetworkLabel()}.`,
    };
  }

  if (ipAddress && !isOfficeIpAddress(ipAddress)) {
    return {
      valid: false,
      ssid,
      ipAddress,
      connectionType,
      message: `Connected to ${ssid} but IP ${ipAddress} is outside the office range (192.168.100.x).`,
    };
  }

  const ipNote = ipAddress ? ` · IP ${ipAddress}` : ' · IP not detected';
  return {
    valid: true,
    ssid,
    ipAddress,
    connectionType,
    message: `Verified on office network: ${ssid}${ipNote}`,
  };
}

export function getAllowedNetworks(): string[] {
  return [...ALLOWED_WIFI_SSIDS];
}
