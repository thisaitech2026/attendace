import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { ProfileHeader } from '@/components/ui/ProfileHeader';
import { QuickAction, SectionHeader } from '@/components/ui/QuickAction';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function DashboardScreen() {
  const { employee, attendance, leaveBalances, leaveRequests } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  const today = attendance[0];
  const annualLeave = leaveBalances.find((b) => b.type === 'annual');
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending').length;

  const punchStatus = today?.punchIn ? (today.punchOut ? 'Done' : 'Active') : 'Away';
  const punchTone = today?.punchIn ? (today.punchOut ? 'success' : 'primary') : 'warning';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      {employee ? (
        <ProfileHeader
          firstName={employee.firstName}
          lastName={employee.lastName}
          position={employee.position}
          department={employee.department}
          employeeId={employee.employeeId}
        />
      ) : null}

      <SectionHeader title="Quick access" />
      <View style={styles.actions}>
        <QuickAction
          href="/(tabs)/leave"
          label="Leave"
          actionKey="leave"
          color={colors.primary}
          bgColor={colors.card}
          accentBg={colors.primaryLight}
        />
        <QuickAction
          href="/(tabs)/attendance"
          label="Time"
          actionKey="time"
          color={colors.accent}
          bgColor={colors.card}
          accentBg={colors.accentLight}
        />
        <QuickAction
          href="/(tabs)/salary"
          label="Pay"
          actionKey="pay"
          color={colors.success}
          bgColor={colors.card}
          accentBg={colors.successLight}
        />
        <QuickAction
          href="/(tabs)/performance"
          label="Goals"
          actionKey="goals"
          color={colors.warning}
          bgColor={colors.card}
          accentBg={colors.warningLight}
        />
      </View>

      <Card noPadding style={styles.heroCard}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Today's attendance</Text>
              <Text style={styles.heroStatus}>{punchStatus}</Text>
              {today?.punchIn ? (
                <Text style={styles.heroTime}>
                  {today.punchIn.slice(0, 5)}
                  {today.punchOut ? ` → ${today.punchOut.slice(0, 5)}` : ' · still working'}
                </Text>
              ) : (
                <Text style={styles.heroTime}>Tap below to punch in</Text>
              )}
            </View>
            <StatusBadge label={punchStatus} tone={punchTone} light />
          </View>
          {!today?.punchOut && (
            <Link href="/(tabs)/attendance" asChild>
              <Button
                title={today?.punchIn ? 'Punch Out' : 'Punch In Now'}
                style={styles.heroBtn}
                variant="light"
              />
            </Link>
          )}
        </LinearGradient>
      </Card>

      <View style={styles.stats}>
        <StatCard
          label="Leave left"
          value={`${annualLeave?.remaining ?? 0}`}
          subtitle={`${annualLeave?.used ?? 0} days used`}
          accent={colors.primary}
          icon={{ ios: 'beach.umbrella.fill', android: 'beach_access', web: 'beach_access' }}
        />
        <StatCard
          label="Pending"
          value={String(pendingLeaves)}
          subtitle="leave requests"
          accent={colors.warning}
          icon={{ ios: 'clock.badge', android: 'pending', web: 'pending' }}
        />
      </View>

      <SectionHeader title="Recent activity" action={{ label: 'See all', href: '/(tabs)/attendance' }} />
      {attendance.slice(0, 4).map((record) => (
        <Card key={record.id} style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={[styles.dateIcon, { backgroundColor: colors.primaryLight }]}>
              <SymbolView name={{ ios: 'calendar', android: 'event', web: 'event' }} tintColor={colors.primary} size={16} />
            </View>
            <View style={styles.historyBody}>
              <Text style={[styles.historyDate, { color: colors.text }]}>
                {format(parseISO(record.date), 'EEE, MMM d')}
              </Text>
              <Text style={[styles.historyDetail, { color: colors.textSecondary }]}>
                {record.punchIn ? `${record.punchIn.slice(0, 5)} – ${record.punchOut?.slice(0, 5) ?? '—'}` : 'No punch recorded'}
                {record.hoursWorked > 0 ? ` · ${record.hoursWorked}h` : ''}
              </Text>
            </View>
            <StatusBadge
              label={record.status}
              tone={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'neutral'}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  heroCard: { marginBottom: 16 },
  gradient: { padding: 20, borderRadius: 20 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroStatus: { color: '#FFF', fontSize: 28, fontWeight: '800', marginTop: 6, letterSpacing: -0.5 },
  heroTime: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6, fontWeight: '500' },
  heroBtn: { marginTop: 18 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  historyCard: { marginBottom: 10, paddingVertical: 14, paddingHorizontal: 14 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  historyBody: { flex: 1 },
  historyDate: { fontSize: 15, fontWeight: '700' },
  historyDetail: { fontSize: 12, marginTop: 3, fontWeight: '500' },
});
