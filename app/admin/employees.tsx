import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';
import { getEmployeeDisplayName } from '@/services/employeeRegistry';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import type { Employee } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';
import { showAlert } from '@/utils/uiAlert';

export default function AdminEmployeesScreen() {
  const { allEmployees, updateSupervisor, getSupervisors, refreshData } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const [supervisors, setSupervisors] = useState<Employee[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [pickerEmployee, setPickerEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    getSupervisors().then(setSupervisors);
  }, [getSupervisors, allEmployees]);

  const handleAssign = (employee: Employee) => {
    const options = supervisors.filter((s) => s.employeeId !== employee.employeeId);
    if (options.length === 0) {
      showAlert('No supervisors', 'Add more employees first.');
      return;
    }
    setPickerEmployee(employee);
  };

  const handleSelectSupervisor = async (supervisor: Employee) => {
    if (!pickerEmployee) return;
    setAssigningId(pickerEmployee.employeeId);
    try {
      await updateSupervisor(pickerEmployee.employeeId, supervisor.employeeId);
      await refreshData();
      showAlert('Updated', `Supervisor set to ${getEmployeeDisplayName(supervisor)}`);
    } catch (error) {
      showAlert('Error', error instanceof Error ? error.message : 'Could not update supervisor');
    } finally {
      setAssigningId(null);
      setPickerEmployee(null);
    }
  };

  const supervisorOptions = pickerEmployee
    ? supervisors.filter((s) => s.employeeId !== pickerEmployee.employeeId)
    : [];

  return (
    <>
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
              <EmployeeAvatar
                firstName={emp.firstName}
                lastName={emp.lastName}
                avatar={emp.avatar}
                employeeId={emp.employeeId}
                size={48}
                borderRadius={16}
                borderWidth={0}
                backgroundColor={colors.primaryLight}
                textColor={colors.primary}
                fontSize={16}
              />
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{getEmployeeDisplayName(emp)}</Text>
                <Text style={[styles.position, { color: colors.textSecondary }]}>{emp.position}</Text>
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

      <Modal visible={!!pickerEmployee} transparent animationType="fade" onRequestClose={() => setPickerEmployee(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerEmployee(null)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.card }]} onPress={() => undefined}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Assign supervisor
            </Text>
            {pickerEmployee ? (
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                For {getEmployeeDisplayName(pickerEmployee)}
              </Text>
            ) : null}
            <ScrollView style={styles.modalList}>
              {supervisorOptions.map((sup) => (
                <Pressable
                  key={sup.employeeId}
                  style={[styles.modalOption, { borderColor: colors.borderLight }]}
                  onPress={() => handleSelectSupervisor(sup)}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    {getEmployeeDisplayName(sup)}
                  </Text>
                  <Text style={[styles.modalOptionMeta, { color: colors.textMuted }]}>{sup.position}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button title="Cancel" variant="outline" onPress={() => setPickerEmployee(null)} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  position: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  meta: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  supervisor: { fontSize: 12, marginTop: 6, fontWeight: '700' },
  assignBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  assignText: { fontSize: 13, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalSubtitle: { fontSize: 13, marginTop: 4, marginBottom: 12 },
  modalList: { maxHeight: 320, marginBottom: 12 },
  modalOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  modalOptionText: { fontSize: 15, fontWeight: '700' },
  modalOptionMeta: { fontSize: 12, marginTop: 2 },
});
