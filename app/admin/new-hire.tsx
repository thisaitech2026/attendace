import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { getEmployeeDisplayName } from '@/services/employeeRegistry';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import type { Employee } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

export default function NewHireScreen() {
  const router = useRouter();
  const { createHire, getSupervisors } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const [supervisors, setSupervisors] = useState<Employee[]>([]);
  const [supervisorId, setSupervisorId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    address: '',
    emergencyContact: '',
    joinDate: new Date().toISOString().split('T')[0],
    tempPassword: 'welcome123',
  });

  useEffect(() => {
    getSupervisors().then((list) => {
      setSupervisors(list);
      if (list[0]) setSupervisorId(list[0].employeeId);
    });
  }, [getSupervisors]);

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.department || !form.position || !supervisorId) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createHire({ ...form, supervisorId });
      Alert.alert(
        'New hire created',
        `${getEmployeeDisplayName(created)} added.\nLogin: ${created.email}\nTemp password: ${form.tempPassword}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not create hire');
    } finally {
      setSubmitting(false);
    }
  };

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'email', label: 'Work email' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department' },
    { key: 'position', label: 'Position' },
    { key: 'joinDate', label: 'Join date (YYYY-MM-DD)' },
    { key: 'address', label: 'Address' },
    { key: 'emergencyContact', label: 'Emergency contact' },
    { key: 'tempPassword', label: 'Temporary password' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Create New Hire', presentation: 'modal' }} />
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>New hire details</Text>

          {fields.map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>{field.label.toUpperCase()}</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.card }]}
                value={form[field.key]}
                onChangeText={(v) => update(field.key, v)}
                autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                keyboardType={field.key === 'email' ? 'email-address' : 'default'}
              />
            </View>
          ))}

          <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textMuted }]}>ASSIGN SUPERVISOR</Text>
          <View style={styles.supervisorList}>
            {supervisors.map((sup) => (
              <Pressable
                key={sup.employeeId}
                style={[
                  styles.supChip,
                  {
                    backgroundColor: supervisorId === sup.employeeId ? colors.primaryLight : colors.card,
                    borderColor: supervisorId === sup.employeeId ? colors.primary : colors.borderLight,
                  },
                ]}
                onPress={() => setSupervisorId(sup.employeeId)}
              >
                <Text style={[styles.supText, { color: supervisorId === sup.employeeId ? colors.primary : colors.text }]}>
                  {getEmployeeDisplayName(sup)} · {sup.position}
                </Text>
              </Pressable>
            ))}
          </View>
          </View>

          <Button title="Create employee account" onPress={handleSubmit} loading={submitting} size="lg" style={styles.submit} />
          <Button title="Cancel" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  fieldGroup: { marginBottom: 6 },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 4, letterSpacing: 0.6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, fontSize: 15 },
  supervisorList: { gap: 6 },
  supChip: { padding: 10, borderRadius: 12, borderWidth: 1.5 },
  supText: { fontSize: 13, fontWeight: '600' },
  submit: { marginTop: 16, marginBottom: 8 },
});
