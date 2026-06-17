import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { SymbolView } from 'expo-symbols';

import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/QuickAction';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AttendanceScreen() {
  const { attendance, refreshData } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader title="Attendance" />

      <SectionHeader title="Recent activity" />
      {attendance.map((record) => (
        <Card key={record.id} style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={[styles.dateIcon, { backgroundColor: colors.primaryLight }]}>
              <SymbolView name={{ ios: 'calendar', android: 'event', web: 'event' }} tintColor={colors.primary} size={14} />
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
  content: { padding: 20, paddingBottom: 40 },
  historyCard: { marginBottom: 10, paddingVertical: 14, paddingHorizontal: 14 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  historyBody: { flex: 1 },
  historyDate: { fontSize: 15, fontWeight: '700' },
  historyDetail: { fontSize: 12, marginTop: 3, fontWeight: '500' },
});
