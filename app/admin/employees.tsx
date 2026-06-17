import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getEmployeeDisplayName } from '@/services/employeeRegistry';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import type { Employee } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

export default function AdminEmployeesScreen() {
  const { allEmployees, updateSupervisor, getSupervisors, refreshData } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const [supervisors, setSupervisors] = useState<Employee[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    getSupervisors().then(setSupervisors);
  }, [getSupervisors, allEmployees]);

  const handleAssign = (employee: Employee) => {
    const options = supervisors.filter((s) => s.employeeId !== employee.employeeId);
    if (options.length === 0) {
      Alert.alert('No supervisors', 'Add more employees first.');
      return;
    }
    setAssigningId(employee.employeeId);
    Alert.alert(
      'Assign supervisor',
      `Select supervisor for ${getEmployeeDisplayName(employee)}`,
      [
        ...options.map((sup) => ({
          text: getEmployeeDisplayName(sup),
          onPress: async () => {
            await updateSupervisor(employee.employeeId, sup.employeeId);
            await refreshData();
            setAssigningId(null);
            Alert.alert('Updated', `Supervisor set to ${getEmployeeDisplayName(sup)}`);
          },
        })),
        { text: 'Cancel', style: 'cancel', onPress: () => setAssigningId(null) },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Employees</Text>
        <Link href="/admin/new-hire" asChild>
          <Button title="+ New hire" size="sm" />
        </Link>
      </View>

      {allEmployees.map((emp) => (
        <Card key={emp.employeeId} style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.initials, { color: colors.primary }]}>
                {emp.firstName[0]}{emp.lastName[0]}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>{getEmployeeDisplayName(emp)}</Text>
              <Text style={[styles.position, { color: colors.textSecondary }]}>
                {emp.position} · {emp.department}
              </Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {emp.employeeId} · {emp.email}
              </Text>
              <Text style={[styles.supervisor, { color: colors.primary }]}>
                Supervisor: {emp.manager}
              </Text>
            </View>
          </View>
          <Pressable
            style={[styles.assignBtn, { borderColor: colors.borderLight }]}
            onPress={() => handleAssign(emp)}
            disabled={assigningId === emp.employeeId}
          >
            <Text style={[styles.assignText, { color: colors.primary }]}>Change supervisor</Text>
          </Pressable>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 16, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  position: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  meta: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  supervisor: { fontSize: 12, marginTop: 6, fontWeight: '700' },
  assignBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  assignText: { fontSize: 13, fontWeight: '700' },
});
