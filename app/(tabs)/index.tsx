import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Link } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { APP_NAME } from '@/constants/config';

export default function DashboardScreen() {
  const { employee, attendance, leaveBalances, leaveRequests } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const today = attendance[0];
  const annualLeave = leaveBalances.find((b) => b.type === 'annual');
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending').length;

  const punchStatus = today?.punchIn
    ? today.punchOut
      ? 'Completed'
      : 'Working'
    : 'Not punched in';

  const punchTone = today?.punchIn ? (today.punchOut ? 'success' : 'primary') : 'warning';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={`Hello, ${employee?.firstName ?? 'there'}!`}
        subtitle={`Welcome to ${APP_NAME}`}
      />

      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Today's Status</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>{punchStatus}</Text>
            {today?.punchIn ? (
              <Text style={[styles.statusTime, { color: colors.textSecondary }]}>
                In: {today.punchIn.slice(0, 5)}
                {today.punchOut ? ` · Out: ${today.punchOut.slice(0, 5)}` : ''}
              </Text>
            ) : null}
          </View>
          <StatusBadge label={punchStatus} tone={punchTone} />
        </View>
        {!today?.punchOut && (
          <Link href="/(tabs)/attendance" asChild>
            <Button title={today?.punchIn ? 'Punch Out' : 'Punch In Now'} style={styles.punchBtn} />
          </Link>
        )}
      </Card>

      <View style={styles.stats}>
        <StatCard
          label="Annual Leave"
          value={`${annualLeave?.remaining ?? 0} days`}
          subtitle={`${annualLeave?.used ?? 0} used`}
          accent={colors.primary}
        />
        <StatCard
          label="Pending Requests"
          value={String(pendingLeaves)}
          subtitle="Awaiting approval"
          accent={colors.warning}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.actions}>
        <Link href="/(tabs)/leave" style={styles.actionLink}>
          <Card style={styles.actionCard}>
            <Text style={[styles.actionEmoji]}>📅</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Request Leave</Text>
          </Card>
        </Link>
        <Link href="/(tabs)/salary" style={styles.actionLink}>
          <Card style={styles.actionCard}>
            <Text style={styles.actionEmoji}>💰</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>View Payslip</Text>
          </Card>
        </Link>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Attendance</Text>
      {attendance.slice(0, 5).map((record) => (
        <Card key={record.id} style={styles.historyCard}>
          <View style={styles.historyRow}>
            <Text style={[styles.historyDate, { color: colors.text }]}>
              {format(parseISO(record.date), 'EEE, MMM d')}
            </Text>
            <StatusBadge
              label={record.status}
              tone={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'neutral'}
            />
          </View>
          <Text style={[styles.historyDetail, { color: colors.textSecondary }]}>
            {record.punchIn ? `${record.punchIn.slice(0, 5)} - ${record.punchOut?.slice(0, 5) ?? '—'}` : 'No punch'}
            {record.hoursWorked > 0 ? ` · ${record.hoursWorked}h` : ''}
            {record.punchInMethod === 'wifi' ? ' · WiFi' : ''}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  statusCard: { marginBottom: 16 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusLabel: { fontSize: 13, fontWeight: '500' },
  statusValue: { fontSize: 22, fontWeight: '700', marginTop: 4 },
  statusTime: { fontSize: 13, marginTop: 4 },
  punchBtn: { marginTop: 16 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionLink: { flex: 1 },
  actionCard: { alignItems: 'center', paddingVertical: 20 },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600' },
  historyCard: { marginBottom: 10 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyDate: { fontSize: 15, fontWeight: '600' },
  historyDetail: { fontSize: 13, marginTop: 6 },
});
