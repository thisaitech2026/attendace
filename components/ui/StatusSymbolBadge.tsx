import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { STATUS_SYMBOLS, type SymbolStatus } from '@/constants/statusSymbols';
import { useColorScheme } from '@/components/useColorScheme';

interface StatusSymbolBadgeProps {
  status: SymbolStatus;
  compact?: boolean;
  showLabel?: boolean;
}

export function StatusSymbolBadge({ status, compact = false, showLabel = true }: StatusSymbolBadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const config = STATUS_SYMBOLS[status];

  const toneColors = {
    success: { bg: colors.successLight, text: colors.success, symbolBg: colors.success },
    warning: { bg: colors.warningLight, text: colors.warning, symbolBg: colors.warning },
    danger: { bg: colors.dangerLight, text: colors.danger, symbolBg: colors.danger },
  }[config.tone];

  return (
    <View style={[styles.badge, compact && styles.badgeCompact, { backgroundColor: toneColors.bg }]}>
      <View style={[styles.symbolCircle, compact && styles.symbolCircleCompact, { backgroundColor: toneColors.symbolBg }]}>
        <Text style={[styles.symbol, compact && styles.symbolCompact]}>{config.symbol}</Text>
      </View>
      {showLabel ? (
        <Text style={[styles.label, compact && styles.labelCompact, { color: toneColors.text }]}>
          {config.label}
        </Text>
      ) : null}
    </View>
  );
}

interface StatusOptionChipProps {
  status: 'paid' | 'pending' | 'approved';
  count?: number | string;
  active?: boolean;
}

export function StatusOptionChip({ status, count, active = false }: StatusOptionChipProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const config = STATUS_SYMBOLS[status];
  const toneColors = {
    paid: { bg: colors.successLight, text: colors.success, symbolBg: colors.success, border: colors.success },
    approved: { bg: colors.successLight, text: colors.success, symbolBg: colors.success, border: colors.success },
    pending: { bg: colors.warningLight, text: colors.warning, symbolBg: colors.warning, border: colors.warning },
  }[status];

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: toneColors.bg,
          borderColor: active ? toneColors.border : 'transparent',
        },
      ]}
    >
      <View style={[styles.chipSymbol, { backgroundColor: toneColors.symbolBg }]}>
        <Text style={styles.chipSymbolText}>{config.symbol}</Text>
      </View>
      <Text style={[styles.chipLabel, { color: toneColors.text }]}>{config.label}</Text>
      {count !== undefined ? (
        <Text style={[styles.chipCount, { color: toneColors.text }]}>{count}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeCompact: { paddingHorizontal: 8, paddingVertical: 4, gap: 5 },
  symbolCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolCircleCompact: { width: 16, height: 16, borderRadius: 8 },
  symbol: { color: '#FFF', fontSize: 12, fontWeight: '800', lineHeight: 14 },
  symbolCompact: { fontSize: 11, lineHeight: 13 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  labelCompact: { fontSize: 10 },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  chipSymbol: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSymbolText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  chipLabel: { fontSize: 13, fontWeight: '700', flex: 1 },
  chipCount: { fontSize: 16, fontWeight: '800' },
});

export type { SymbolStatus };
