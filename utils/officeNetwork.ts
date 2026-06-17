import { OFFICE_IP_PREFIX, OFFICE_WIFI_SSID } from '@/constants/config';

export { OFFICE_IP_PREFIX, OFFICE_WIFI_SSID };

export function isOfficeIpAddress(ip: string | null | undefined): boolean {
  if (!ip) return false;
  return ip.trim().startsWith(OFFICE_IP_PREFIX);
}

export function formatOfficeNetworkLabel(): string {
  return `${OFFICE_WIFI_SSID} (${OFFICE_IP_PREFIX}x)`;
}
