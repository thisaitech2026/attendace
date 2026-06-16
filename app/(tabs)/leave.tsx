import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Link } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusOptionChip, StatusSymbolBadge } from '@/components/ui/StatusSymbolBadge';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import { useColorScheme } from '@/components/useColorScheme';


const statusMap = {
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected',
} as const;

export default function LeaveScreen() {
  const { leaveBalances, leaveRequests } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="Leave Management" subtitle="Balances and requests" />

      <View style={styles.statusRow}>
        <StatusOptionChip status="approved" count={approvedCount} active />
        <StatusOptionChip status="pending" count={pendingCount} />
      </View>

      <Link href="/leave-request" asChild>
        <Button title="+ Request Leave" style={styles.requestBtn} />
      </Link>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Leave Balances</Text>
      <View style={styles.balanceGrid}>
        {leaveBalances.map((balance) => (
          <Card key={balance.type} style={styles.balanceCard}>
            <Text style={[styles.balanceType, { color: colors.textSecondary }]}>
              {LEAVE_TYPE_LABELS[balance.type]}
            </Text>
            <Text style={[styles.balanceRemaining, { color: colors.primary }]}>
              {balance.remaining}
            </Text>
            <Text style={[styles.balanceSub, { color: colors.textSecondary }]}>
              of {balance.total} days · {balance.used} used
            </Text>
            <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${balance.total > 0 ? (balance.used / balance.total) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
          </Card>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>My Requests</Text>
      {leaveRequests.length === 0 ? (
        <Card>
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No leave requests yet.</Text>
        </Card>
      ) : (
        leaveRequests.map((request) => (
          <Card key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={[styles.requestType, { color: colors.text }]}>
                {LEAVE_TYPE_LABELS[request.type]}
              </Text>
              <StatusSymbolBadge status={statusMap[request.status]} compact />
            </View>
            <Text style={[styles.requestDates, { color: colors.textSecondary }]}>
              {format(parseISO(request.startDate), 'MMM d')} – {format(parseISO(request.endDate), 'MMM d, yyyy')}
              {' · '}{request.days} day{request.days > 1 ? 's' : ''}
            </Text>
            <Text style={[styles.requestReason, { color: colors.text }]}>{request.reason}</Text>
            <Text style={[styles.requestMeta, { color: colors.textSecondary }]}>
              Submitted {format(parseISO(request.submittedAt), 'MMM d, yyyy')}
            </Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  statusRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  requestBtn: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  balanceGrid: { gap: 12, marginBottom: 24 },
  balanceCard: { marginBottom: 0 },
  balanceType: { fontSize: 13, fontWeight: '500' },
  balanceRemaining: { fontSize: 36, fontWeight: '800', marginVertical: 4 },
  balanceSub: { fontSize: 12 },
  progressBg: { height: 6, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  requestCard: { marginBottom: 12 },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestType: { fontSize: 16, fontWeight: '700' },
  requestDates: { fontSize: 13, marginTop: 8 },
  requestReason: { fontSize: 14, marginTop: 8 },
  requestMeta: { fontSize: 11, marginTop: 8 },
  empty: { textAlign: 'center', padding: 20 },
});
