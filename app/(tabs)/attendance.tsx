import { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { getCurrentWifiInfo, verifyOfficeWifi } from '@/services/wifiService';
import { useColorScheme } from '@/components/useColorScheme';

export default function AttendanceScreen() {
  const { attendance, doPunchIn, doPunchOut, refreshData } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [wifiValid, setWifiValid] = useState(false);
  const [wifiMessage, setWifiMessage] = useState('Checking network...');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const today = attendance[0];
  const canPunchIn = today && !today.punchIn;
  const canPunchOut = today && today.punchIn && !today.punchOut;

  const checkWifi = useCallback(async () => {
    await getCurrentWifiInfo();
    const result = await verifyOfficeWifi();
    setWifiValid(result.valid);
    setWifiMessage(result.message);
  }, []);

  useEffect(() => {
    checkWifi();
    const interval = setInterval(checkWifi, 10000);
    return () => clearInterval(interval);
  }, [checkWifi]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshData(), checkWifi()]);
    setRefreshing(false);
  };

  const handleWifiPunchIn = async () => {
    setLoading(true);
    try {
      const result = await verifyOfficeWifi();
      if (!result.valid) {
        Alert.alert('WiFi Verification Failed', result.message);
        return;
      }
      await doPunchIn('wifi', result.ssid);
      Alert.alert('Punched In', `Verified via office WiFi: ${result.ssid}`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Punch in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPunchIn = async () => {
    Alert.alert(
      'Manual Punch In',
      'Manual punch requires manager approval. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            setLoading(true);
            try {
              await doPunchIn('manual', null);
              Alert.alert('Punched In', 'Manual punch recorded — pending approval.');
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'Punch in failed');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handlePunchOut = async () => {
    setLoading(true);
    try {
      const result = await verifyOfficeWifi();
      const method = result.valid ? 'wifi' : 'manual';
      await doPunchOut(method);
      Alert.alert('Punched Out', `Recorded at ${new Date().toLocaleTimeString()}`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Punch out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader title="Attendance" />

      <Card style={[styles.wifiCard, { borderColor: wifiValid ? colors.success : colors.border }]}>
        <View style={styles.wifiHeader}>
          <Text style={styles.wifiIcon}>{wifiValid ? '✅' : '📶'}</Text>
          <View style={styles.wifiInfo}>
            <Text style={[styles.wifiTitle, { color: colors.text }]}>Office WiFi</Text>
            <Text style={[styles.wifiMsg, { color: colors.textSecondary }]}>{wifiMessage}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.todayCard}>
        <Text style={[styles.todayLabel, { color: colors.textSecondary }]}>Today</Text>
        <Text style={[styles.todayDate, { color: colors.text }]}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Text>
        <View style={styles.punchTimes}>
          <View style={styles.todayPunchBlock}>
            <Text style={[styles.punchLabel, { color: colors.textSecondary }]}>Punch In</Text>
            <Text style={[styles.todayPunchTime, { color: colors.text }]}>
              {today?.punchIn?.slice(0, 5) ?? '—'}
            </Text>
            {today?.punchInMethod ? (
              <StatusBadge label={today.punchInMethod} tone={today.punchInMethod === 'wifi' ? 'success' : 'warning'} />
            ) : null}
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.todayPunchBlock}>
            <Text style={[styles.punchLabel, { color: colors.textSecondary }]}>Punch Out</Text>
            <Text style={[styles.todayPunchTime, { color: colors.text }]}>
              {today?.punchOut?.slice(0, 5) ?? '—'}
            </Text>
            {today?.punchOutMethod ? (
              <StatusBadge label={today.punchOutMethod} tone="primary" />
            ) : null}
          </View>
        </View>
        {today?.hoursWorked ? (
          <Text style={[styles.hours, { color: colors.primary }]}>
            Hours worked: {today.hoursWorked}h
          </Text>
        ) : null}
      </Card>

      <View style={styles.actions}>
        {canPunchIn && (
          <>
            <Button
              title="Punch In via WiFi"
              onPress={handleWifiPunchIn}
              loading={loading}
              disabled={!wifiValid}
            />
            <Button
              title="Manual Punch In"
              variant="outline"
              onPress={handleManualPunchIn}
              loading={loading}
              style={styles.manualBtn}
            />
          </>
        )}
        {canPunchOut && (
          <Button title="Punch Out" variant="danger" onPress={handlePunchOut} loading={loading} />
        )}
        {!canPunchIn && !canPunchOut && (
          <Text style={[styles.doneText, { color: colors.textSecondary }]}>
            {today?.punchOut ? 'You have completed attendance for today.' : 'Loading...'}
          </Text>
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>History</Text>
      {attendance.slice(1).map((record) => (
        <Card key={record.id} style={styles.historyCard}>
          <Text style={[styles.historyDate, { color: colors.text }]}>
            {format(parseISO(record.date), 'MMM d, yyyy')}
          </Text>
          <View style={styles.historyPunchRow}>
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
  wifiCard: { marginBottom: 16, borderWidth: 2 },
  wifiHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  wifiIcon: { fontSize: 28 },
  wifiInfo: { flex: 1 },
  wifiTitle: { fontSize: 16, fontWeight: '700' },
  wifiMsg: { fontSize: 13, marginTop: 4 },
  todayCard: { marginBottom: 20 },
  todayLabel: { fontSize: 12, fontWeight: '500' },
  todayDate: { fontSize: 18, fontWeight: '700', marginTop: 4, marginBottom: 16 },
  punchTimes: { flexDirection: 'row', alignItems: 'center' },
  todayPunchBlock: { flex: 1, alignItems: 'center', gap: 6 },
  punchLabel: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
  todayPunchTime: { fontSize: 28, fontWeight: '700' },
  divider: { width: 1, height: 60, marginHorizontal: 12 },
  hours: { textAlign: 'center', marginTop: 16, fontSize: 15, fontWeight: '600' },
  actions: { gap: 10, marginBottom: 24 },
  manualBtn: { marginTop: 0 },
  doneText: { textAlign: 'center', fontSize: 14, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  historyCard: { marginBottom: 10 },
  historyDate: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  historyPunchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  punchBlock: { flex: 1 },
  punchTime: { fontSize: 20, fontWeight: '700' },
  punchArrow: { fontSize: 18, fontWeight: '600', marginHorizontal: 12 },
});
