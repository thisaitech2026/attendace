import { useEffect, useRef } from 'react';

interface AutoWifiPunchInOptions {
  enabled: boolean;
  wifiValid: boolean;
  wifiSsid: string | null;
  isChecking: boolean;
  onPunchIn: (ssid: string | null) => Promise<void>;
}

/**
 * Automatically punches in when office WiFi is verified and the user has not punched in yet.
 */
export function useAutoWifiPunchIn({
  enabled,
  wifiValid,
  wifiSsid,
  isChecking,
  onPunchIn,
}: AutoWifiPunchInOptions) {
  const attemptedRef = useRef(false);
  const punchingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      attemptedRef.current = false;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || isChecking || !wifiValid || attemptedRef.current || punchingRef.current) {
      return;
    }

    attemptedRef.current = true;
    punchingRef.current = true;

    onPunchIn(wifiSsid)
      .catch(() => {
        attemptedRef.current = false;
      })
      .finally(() => {
        punchingRef.current = false;
      });
  }, [enabled, isChecking, onPunchIn, wifiSsid, wifiValid]);
}
