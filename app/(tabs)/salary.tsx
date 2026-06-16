import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/services/employeeService';
import { useColorScheme } from '@/components/useColorScheme';

export default function SalaryScreen() {
  const { salarySlips, employee } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const latest = salarySlips[0];
  const ytdNet = salarySlips
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + s.netPay, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Salary & Payslips" subtitle="Compensation details" />

      <Card style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroLabel}>Latest Net Pay</Text>
        <Text style={styles.heroAmount}>{latest ? formatCurrency(latest.netPay) : '—'}</Text>
        <Text style={styles.heroPeriod}>
          {latest ? `${latest.month} ${latest.year}` : 'No payslips'}
        </Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>YTD Net</Text>
            <Text style={styles.heroStatValue}>{formatCurrency(ytdNet)}</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Position</Text>
            <Text style={styles.heroStatValue}>{employee?.position ?? '—'}</Text>
          </View>
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Payslip History</Text>
      {salarySlips.map((slip) => (
        <Card key={slip.id} style={styles.slipCard}>
          <View style={styles.slipHeader}>
            <Text style={[styles.slipMonth, { color: colors.text }]}>
              {slip.month} {slip.year}
            </Text>
            <StatusBadge label={slip.status} tone={slip.status === 'paid' ? 'success' : 'warning'} />
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
          <View style={[styles.slipDivider, { backgroundColor: colors.border }]} />
          <View style={styles.slipRow}>
            <Text style={[styles.slipTotalLabel, { color: colors.text }]}>Net Pay</Text>
            <Text style={[styles.slipTotal, { color: colors.primary }]}>{formatCurrency(slip.netPay)}</Text>
          </View>
          <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
            Payment date: {slip.paymentDate}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  heroCard: { marginBottom: 24, borderRadius: 20, padding: 24 },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  heroAmount: { color: '#FFF', fontSize: 36, fontWeight: '800', marginVertical: 8 },
  heroPeriod: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  heroStats: { flexDirection: 'row', marginTop: 20, gap: 24 },
  heroStat: { flex: 1 },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  heroStatValue: { color: '#FFF', fontSize: 14, fontWeight: '700', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  slipCard: { marginBottom: 12 },
  slipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  slipMonth: { fontSize: 16, fontWeight: '700' },
  slipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  slipLabel: { fontSize: 14 },
  slipValue: { fontSize: 14, fontWeight: '600' },
  slipDivider: { height: 1, marginVertical: 8 },
  slipTotalLabel: { fontSize: 15, fontWeight: '700' },
  slipTotal: { fontSize: 18, fontWeight: '800' },
  paymentDate: { fontSize: 11, marginTop: 8 },
});
