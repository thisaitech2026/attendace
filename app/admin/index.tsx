import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AdminDashboard() {
  const { adminStats, pendingApprovals } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>HR Dashboard</Text>

      <View style={styles.stats}>
        <View style={styles.statsTop}>
          <StatCard
            label="Employees"
            value={String(adminStats.totalEmployees)}
            accent="#4F46E5"
            compact
            centered
            icon={{ ios: 'person.2.fill', android: 'groups', web: 'groups' }}
          />
          <StatCard
            label="Supervisors"
            value={String(adminStats.totalSupervisors)}
            accent="#0891B2"
            compact
            centered
            icon={{ ios: 'person.crop.circle.badge.checkmark', android: 'supervisor_account', web: 'supervisor_account' }}
          />
        </View>
        <View style={styles.statsBottom}>
          <View style={styles.statCell}>
            <StatCard
              label="Approvals"
              value={String(adminStats.pendingApprovals)}
              accent={colors.warning}
              compact
              centered
              statusSymbol="pending"
            />
          </View>
          <View style={styles.statCell} />
        </View>
      </View>

      <View style={styles.actions}>
        <Link href="/admin/new-hire" asChild>
          <Button title="+ Create New Hire" style={styles.actionBtn} />
        </Link>
        <Link href="/admin/employees" asChild>
          <Button title="View Employees" variant="outline" style={styles.actionBtn} />
        </Link>
      </View>

      <Text style={[styles.section, { color: colors.text }]}>Pending approvals</Text>
      {pendingApprovals.length === 0 ? (
        <Card>
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No pending approvals right now.</Text>
        </Card>
      ) : (
        pendingApprovals.slice(0, 3).map((item) => (
          <Card key={item.id} style={styles.card}>
            <Text style={[styles.name, { color: colors.text }]}>{item.employeeName}</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {item.type} leave · {item.days} day(s) · Supervisor: {item.supervisor}
            </Text>
            <Text style={[styles.reason, { color: colors.text }]}>{item.reason}</Text>
          </Card>
        ))
      )}

      {pendingApprovals.length > 0 ? (
        <Link href="/admin/approvals" asChild>
          <Button title="Review all approvals" variant="secondary" />
        </Link>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 16 },
  stats: { gap: 4, marginBottom: 16 },
  statsTop: { flexDirection: 'row', gap: 6 },
  statsBottom: { flexDirection: 'row', gap: 6 },
  statCell: { flex: 1, minWidth: 0 },
  actions: { gap: 10, marginBottom: 24 },
  actionBtn: { width: '100%' },
  section: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  card: { marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 12, marginTop: 4 },
  reason: { fontSize: 14, marginTop: 8 },
  empty: { textAlign: 'center', padding: 16 },
});
