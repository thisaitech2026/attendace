export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#7C3AED',
  secondaryLight: '#EDE9FE',
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#0891B2',
  infoLight: '#CFFAFE',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.5)',
  shadow: 'rgba(15, 23, 42, 0.08)',
  gradientStart: '#2563EB',
  gradientEnd: '#7C3AED',
};

export const propertyTypeColors: Record<string, string> = {
  House: '#2563EB',
  Apartment: '#7C3AED',
  Villa: '#059669',
  Shop: '#D97706',
  'Commercial Unit': '#DC2626',
};

export const statusColors: Record<string, { bg: string; text: string }> = {
  Occupied: { bg: '#D1FAE5', text: '#059669' },
  Vacant: { bg: '#FEE2E2', text: '#DC2626' },
  Success: { bg: '#D1FAE5', text: '#059669' },
  Failed: { bg: '#FEE2E2', text: '#DC2626' },
  Pending: { bg: '#FEF3C7', text: '#D97706' },
};
