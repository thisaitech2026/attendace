import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';

import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
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

      <Text style={[styles.sectionTitle, { color: colors.text }]}>History</Text>
      {attendance.map((record) => (
        <Card key={record.id} style={styles.historyCard}>
          <Text style={[styles.historyDate, { color: colors.text }]}>
            {format(parseISO(record.date), 'MMM d, yyyy')}
          </Text>
          <View style={styles.punchRow}>
            <View style={styles.punchBlock}>
              <Text style={[styles.punchLabel, { color: colors.textSecondary }]}>Punch In</Text>
              <Text style={[styles.punchTime, { color: colors.text }]}>
                {record.punchIn?.slice(0, 5) ?? '—'}
              </Text>
            </View>
            <Text style={[styles.punchArrow, { color: colors.textMuted }]}>→</Text>
            <View style={styles.punchBlock}>
              <Text style={[styles.punchLabel, { color: colors.textSecondary }]}>Punch Out</Text>
              <Text style={[styles.punchTime, { color: colors.text }]}>
                {record.punchOut?.slice(0, 5) ?? '—'}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  historyCard: { marginBottom: 10 },
  historyDate: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  punchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  punchBlock: { flex: 1 },
  punchLabel: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
  punchTime: { fontSize: 20, fontWeight: '700' },
  punchArrow: { fontSize: 18, fontWeight: '600', marginHorizontal: 12 },
});
