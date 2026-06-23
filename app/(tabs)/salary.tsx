import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusOptionChip, StatusSymbolBadge } from '@/components/ui/StatusSymbolBadge';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/services/employeeService';
import { useColorScheme } from '@/components/useColorScheme';
import { applyLeaveDeductionToSlip } from '@/utils/salary';
import { LEAVE_DEDUCTION_PER_DAY } from '@/constants/config';

const SALARY_STAT_COLORS = {
  total: {
    box: 'rgba(125, 211, 252, 0.22)',
    label: '#E0F2FE',
    value: '#7DD3FC',
  },
  allowances: {
    box: 'rgba(110, 231, 183, 0.22)',
    label: '#D1FAE5',
    value: '#6EE7B7',
  },
  deductions: {
    box: 'rgba(253, 164, 175, 0.22)',
    label: '#FFE4E6',
    value: '#FDA4AF',
  },
} as const;

export default function SalaryScreen() {
  const { salarySlips, leaveRequests } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const adjustedSlips = useMemo(
    () => salarySlips.map((slip) => applyLeaveDeductionToSlip(slip, leaveRequests)),
    [salarySlips, leaveRequests]
  );

  const latestAdjusted = adjustedSlips[0];
  const latest = latestAdjusted?.slip;
  const paidSlips = salarySlips.filter((s) => s.status === 'paid');
  const pendingSlips = salarySlips.filter((s) => s.status === 'pending');
  const totalSalary = latest?.basic ?? 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Salary & Payslips" />

      <View style={styles.statusRow}>
        <StatusOptionChip status="paid" count={paidSlips.length} active />
        <StatusOptionChip status="pending" count={pendingSlips.length} />
      </View>

      <Card style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>Latest Net Pay</Text>
          {latest ? <StatusSymbolBadge status={latest.status} compact /> : null}
        </View>
        <Text style={styles.heroAmount}>
          {latestAdjusted ? formatCurrency(latestAdjusted.adjustedNetPay) : '—'}
        </Text>
        <Text style={styles.heroPeriod}>
          {latest ? `${latest.month} ${latest.year}` : 'No payslips'}
        </Text>
        {latestAdjusted && latestAdjusted.leaveDeduction.days > 0 ? (
          <Text style={styles.heroLeaveNote}>
            -{formatCurrency(latestAdjusted.leaveDeduction.amount)} leave deduction (
            {latestAdjusted.leaveDeduction.days} day
            {latestAdjusted.leaveDeduction.days > 1 ? 's' : ''} × {formatCurrency(LEAVE_DEDUCTION_PER_DAY)})
          </Text>
        ) : null}
        <View style={styles.heroStats}>
          <View style={[styles.heroStatBox, { backgroundColor: SALARY_STAT_COLORS.total.box }]}>
            <Text style={[styles.heroStatLabel, { color: SALARY_STAT_COLORS.total.label }]}>Basic Salary</Text>
            <Text style={[styles.heroStatValue, { color: SALARY_STAT_COLORS.total.value }]}>
              {latest ? formatCurrency(totalSalary) : '—'}
            </Text>
          </View>
          <View style={[styles.heroStatBox, { backgroundColor: SALARY_STAT_COLORS.allowances.box }]}>
            <Text style={[styles.heroStatLabel, { color: SALARY_STAT_COLORS.allowances.label }]}>Allowances</Text>
            <Text style={[styles.heroStatValue, { color: SALARY_STAT_COLORS.allowances.value }]}>
              {latest ? `+${formatCurrency(latest.allowances)}` : '—'}
            </Text>
          </View>
          <View style={[styles.heroStatBox, { backgroundColor: SALARY_STAT_COLORS.deductions.box }]}>
            <Text style={[styles.heroStatLabel, { color: SALARY_STAT_COLORS.deductions.label }]}>Deductions</Text>
            <Text style={[styles.heroStatValue, { color: SALARY_STAT_COLORS.deductions.value }]}>
              {latestAdjusted ? `-${formatCurrency(latestAdjusted.totalDeductions)}` : '—'}
            </Text>
          </View>
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Payslip History</Text>
      {adjustedSlips.map(({ slip, leaveDeduction, adjustedNetPay }) => (
        <Card key={slip.id} noPadding style={styles.slipCard}>
          <View style={styles.slipInner}>
          <View style={styles.slipHeader}>
            <Text style={[styles.slipMonth, { color: colors.text }]}>
              {slip.month} {slip.year}
            </Text>
            <StatusSymbolBadge status={slip.status} compact />
          </View>

          <View style={styles.slipRow}>
            <Text style={[styles.slipLabel, { color: colors.textSecondary }]}>Basic Salary</Text>
            <Text style={[styles.slipValue, { color: colors.text }]}>{formatCurrency(slip.basic)}</Text>
          </View>
          <View style={styles.slipRow}>
            <Text style={[styles.slipLabel, { color: colors.textSecondary }]}>Allowances</Text>
            <Text style={[styles.slipValue, { color: colors.success }]}>+{formatCurrency(slip.allowances)}</Text>
          </View>
          <View style={styles.slipRow}>
            <Text style={[styles.slipLabel, { color: colors.textSecondary }]}>Deductions</Text>
            <Text style={[styles.slipValue, { color: colors.danger }]}>-{formatCurrency(slip.deductions)}</Text>
          </View>
          {leaveDeduction.days > 0 ? (
            <View style={styles.slipRow}>
              <Text style={[styles.slipLabel, { color: colors.textSecondary }]}>
                Leave deduction ({leaveDeduction.days} day{leaveDeduction.days > 1 ? 's' : ''} × {formatCurrency(leaveDeduction.rate)})
              </Text>
              <Text style={[styles.slipValue, { color: colors.danger }]}>
                -{formatCurrency(leaveDeduction.amount)}
              </Text>
            </View>
          ) : null}
          <View style={[styles.slipDivider, { backgroundColor: colors.border }]} />
          <View style={styles.slipRow}>
            <Text style={[styles.slipTotalLabel, { color: colors.text }]}>Net Pay</Text>
            <Text style={[styles.slipTotal, { color: colors.primary }]}>{formatCurrency(adjustedNetPay)}</Text>
          </View>
          <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
            Payment date: {slip.paymentDate}
          </Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  statusRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginBottom: 12 },
  heroCard: { marginBottom: 16, borderRadius: 16, padding: 16 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500', flex: 1 },
  heroAmount: { color: '#FFF', fontSize: 28, fontWeight: '800', marginTop: 4, marginBottom: 2 },
  heroPeriod: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  heroLeaveNote: {
    color: '#FECACA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  heroStats: { flexDirection: 'row', marginTop: 12, gap: 6 },
  heroStatBox: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  heroStatLabel: { fontSize: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },
  heroStatValue: { fontSize: 11, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  slipCard: { marginBottom: 8, borderRadius: 14 },
  slipInner: { paddingHorizontal: 12, paddingVertical: 10 },
  slipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  slipMonth: { fontSize: 15, fontWeight: '700' },
  slipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  slipLabel: { fontSize: 13 },
  slipValue: { fontSize: 13, fontWeight: '600' },
  slipDivider: { height: 1, marginVertical: 4 },
  slipTotalLabel: { fontSize: 14, fontWeight: '700' },
  slipTotal: { fontSize: 16, fontWeight: '800' },
  paymentDate: { fontSize: 10, marginTop: 4 },
});
