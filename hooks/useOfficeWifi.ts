import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';

import { verifyOfficeWifi, type WifiVerificationResult } from '@/services/wifiService';

const DEFAULT_POLL_MS = 10_000;

const INITIAL_RESULT: WifiVerificationResult = {
  valid: false,
  ssid: null,
  ipAddress: null,
  connectionType: 'unknown',
  message: 'Checking network...',
};

export function useOfficeWifi(pollIntervalMs = DEFAULT_POLL_MS) {
  const [result, setResult] = useState<WifiVerificationResult>(INITIAL_RESULT);
  const [isChecking, setIsChecking] = useState(true);

  const refresh = useCallback(async () => {
    setIsChecking(true);
    try {
      const next = await verifyOfficeWifi();
      setResult(next);
      return next;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = NetInfo.addEventListener(() => {
      refresh();
    });
    const interval = setInterval(refresh, pollIntervalMs);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [refresh, pollIntervalMs]);

  return {
    wifiValid: result.valid,
    wifiMessage: result.message,
    wifiSsid: result.ssid,
    ipAddress: result.ipAddress,
    isChecking,
    refresh,
  };
}
