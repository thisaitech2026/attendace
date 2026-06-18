import { useEffect, useMemo, useState } from 'react';
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
import { SelectField } from '@/components/ui/SelectField';
import { getEmployeeDisplayName } from '@/services/employeeRegistry';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import {
  buildJoinDateOptions,
  DEPARTMENT_OPTIONS,
  POSITIONS_BY_DEPARTMENT,
} from '@/constants/hrOptions';
import type { Employee } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

function showAlert(title: string, message: string, onOk?: () => void) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    onOk?.();
    return;
  }
  Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
}

const TEXT_FIELDS: { key: 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'emergencyContact' | 'tempPassword'; label: string }[] = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'email', label: 'Work email' },
  { key: 'phone', label: 'Phone (10 digits)' },
  { key: 'address', label: 'Address' },
  { key: 'emergencyContact', label: 'Emergency contact (10 digits)' },
  { key: 'tempPassword', label: 'Temporary password' },
];

export default function NewHireScreen() {
  const router = useRouter();
  const { createHire, getSupervisors } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const [supervisors, setSupervisors] = useState<Employee[]>([]);
  const [supervisorId, setSupervisorId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const joinDateOptions = useMemo(() => buildJoinDateOptions(), []);

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

  const positionOptions = useMemo(
    () => (form.department ? POSITIONS_BY_DEPARTMENT[form.department] ?? [] : []),
    [form.department]
  );

  const fieldColors = {
    textColor: colors.text,
    mutedColor: colors.textMuted,
    borderColor: colors.borderLight,
    cardColor: colors.card,
    dangerColor: colors.danger,
    primaryColor: colors.primary,
  };

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFieldChange = (key: keyof typeof form, value: string) => {
    if (key === 'phone' || key === 'emergencyContact') {
      update(key, value.replace(/\D/g, '').slice(0, 10));
      return;
    }
    update(key, value);
  };

  const handleDepartmentChange = (value: string) => {
    setForm((prev) => ({ ...prev, department: value, position: '' }));
  };

  const handleSubmit = async () => {
    const missing: string[] = [];
    if (!form.firstName.trim()) missing.push('First name');
    if (!form.lastName.trim()) missing.push('Last name');
    if (!form.email.trim()) missing.push('Work email');
    if (!form.phone.trim()) missing.push('Phone');
    if (!form.department) missing.push('Department');
    if (!form.position) missing.push('Position');
    if (!form.joinDate) missing.push('Join date');
    if (!supervisorId) missing.push('Supervisor');

    if (missing.length > 0) {
      showAlert('Missing fields', `Please complete: ${missing.join(', ')}.`);
      return;
    }
    if (form.phone.length !== 10) {
      showAlert('Invalid phone', 'Phone number must be exactly 10 digits.');
      return;
    }
    if (form.emergencyContact && form.emergencyContact.length !== 10) {
      showAlert('Invalid emergency contact', 'Emergency contact number must be exactly 10 digits.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      showAlert('Invalid email', 'Please enter a valid work email address.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createHire({ ...form, supervisorId });
      showAlert(
        'New hire created',
        `${getEmployeeDisplayName(created)} added.\nLogin: ${created.email}\nTemp password: ${form.tempPassword}`,
        () => router.back()
      );
    } catch (e) {
      showAlert('Error', e instanceof Error ? e.message : 'Could not create employee account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Create New Hire', presentation: 'modal' }} />
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>New hire details</Text>

          {TEXT_FIELDS.slice(0, 4).map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>{field.label.toUpperCase()}</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.card }]}
                value={form[field.key]}
                onChangeText={(v) => handleFieldChange(field.key, v)}
                autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                keyboardType={
                  field.key === 'email' ? 'email-address' : field.key === 'phone' ? 'phone-pad' : 'default'
                }
                maxLength={field.key === 'phone' ? 10 : undefined}
              />
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <SelectField
              label="Department"
              value={form.department}
              onChange={handleDepartmentChange}
              options={DEPARTMENT_OPTIONS}
              placeholder="Select department"
              compact
              {...fieldColors}
            />
          </View>

          <View style={styles.fieldGroup}>
            <SelectField
              label="Position"
              value={form.position}
              onChange={(value) => update('position', value)}
              options={positionOptions}
              placeholder={form.department ? 'Select position' : 'Select department first'}
              disabled={!form.department}
              compact
              {...fieldColors}
            />
          </View>

          <View style={styles.fieldGroup}>
            <SelectField
              label="Join date"
              value={form.joinDate}
              onChange={(value) => update('joinDate', value)}
              options={joinDateOptions}
              placeholder="Select join date"
              compact
              {...fieldColors}
            />
          </View>

          {TEXT_FIELDS.slice(4).map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textMuted }]}>{field.label.toUpperCase()}</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.card }]}
                value={form[field.key]}
                onChangeText={(v) => handleFieldChange(field.key, v)}
                autoCapitalize="words"
                keyboardType={field.key === 'emergencyContact' ? 'phone-pad' : 'default'}
                maxLength={field.key === 'emergencyContact' ? 10 : undefined}
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

          {supervisors.length === 0 ? (
            <Text style={[styles.emptySupervisor, { color: colors.textSecondary }]}>
              No supervisors available. Add employees first.
            </Text>
          ) : null}
          <Button
            title="Create employee account"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || supervisors.length === 0}
            size="lg"
            style={styles.submit}
          />
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
  emptySupervisor: { fontSize: 12, marginBottom: 8, fontWeight: '500' },
  submit: { marginTop: 16, marginBottom: 8 },
});
