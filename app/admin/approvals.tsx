import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusSymbolBadge } from '@/components/ui/StatusSymbolBadge';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import { useColorScheme } from '@/components/useColorScheme';

export default function AdminApprovalsScreen() {
  const { pendingApprovals, approveLeave, rejectLeave } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Approvals</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Review leave requests and take action
      </Text>

      {pendingApprovals.length === 0 ? (
        <Card>
          <Text style={[styles.empty, { color: colors.textSecondary }]}>All caught up — no pending requests.</Text>
        </Card>
      ) : (
        pendingApprovals.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: colors.text }]}>{item.employeeName}</Text>
              <StatusSymbolBadge status="pending" compact />
            </View>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {LEAVE_TYPE_LABELS[item.type]} · {item.days} day(s)
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {format(parseISO(item.startDate), 'MMM d')} – {format(parseISO(item.endDate), 'MMM d, yyyy')}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>Department: {item.department}</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>Supervisor: {item.supervisor}</Text>
            <Text style={[styles.reason, { color: colors.text }]}>{item.reason}</Text>
            <View style={styles.actions}>
              <Button title="Approve ✓" onPress={() => approveLeave(item.id)} style={styles.btn} />
              <Button title="Reject ✕" variant="danger" onPress={() => rejectLeave(item.id)} style={styles.btn} />
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 20, fontWeight: '500' },
  card: { marginBottom: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700' },
  meta: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  reason: { fontSize: 14, marginTop: 10, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1 },
  empty: { textAlign: 'center', padding: 20 },
});
