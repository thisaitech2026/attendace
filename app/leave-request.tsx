import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { parseISO } from 'date-fns';

import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import {
  buildLeaveDateOptions,
  getLeaveReasonLabel,
  LEAVE_REASON_OPTIONS,
} from '@/constants/leaveOptions';
import type { LeaveType } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

const LEAVE_TYPES: LeaveType[] = ['annual', 'sick', 'personal', 'unpaid'];

function showAlert(title: string, message: string, onOk?: () => void) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    onOk?.();
    return;
  }
  Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
}

export default function LeaveRequestModal() {
  const router = useRouter();
  const { requestLeave, employee } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [type, setType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ start: false, end: false, reason: false });

  const dateOptions = useMemo(() => buildLeaveDateOptions(90), []);

  const endDateOptions = useMemo(() => {
    if (!startDate) return dateOptions;
    return dateOptions.filter((option) => option.value >= startDate);
  }, [dateOptions, startDate]);

  const startError = touched.start && !startDate ? 'Start date is required' : undefined;
  const endError = touched.end && !endDate ? 'End date is required' : undefined;
  const reasonError = touched.reason && !reason ? 'Reason is required' : undefined;

  const datesValid = Boolean(startDate && endDate && endDate >= startDate);
  const formComplete = datesValid && Boolean(reason);

  const leaveDays = useMemo(() => {
    if (!datesValid) return 0;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [datesValid, startDate, endDate]);

  const approverName = employee?.manager ?? 'Not assigned';

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setTouched((prev) => ({ ...prev, start: true }));
    if (endDate && value && endDate < value) {
      setEndDate('');
    }
  };

  const handleSubmit = async () => {
    setTouched({ start: true, end: true, reason: true });

    if (!startDate || !endDate || !reason) {
      showAlert('Please fix the form', 'Select start date, end date, and reason.');
      return;
    }

    if (!employee) {
      showAlert('Not signed in', 'Please log in as an employee to submit a leave request.');
      return;
    }

    setSubmitting(true);
    try {
      await requestLeave(type, startDate, endDate, getLeaveReasonLabel(reason));
      showAlert(
        'Submitted',
        `Your leave request has been sent to ${approverName} for approval.`,
        () => router.back()
      );
    } catch (e) {
      showAlert('Error', e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldColors = {
    textColor: colors.text,
    mutedColor: colors.textSecondary,
    borderColor: colors.border,
    cardColor: colors.card,
    dangerColor: colors.danger,
    primaryColor: colors.primary,
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.approverCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={[styles.approverLabel, { color: colors.primary }]}>Approver</Text>
          <Text style={[styles.approverName, { color: colors.text }]}>{approverName}</Text>
          <Text style={[styles.approverHint, { color: colors.textSecondary }]}>
            Your request will be reviewed by this manager.
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Leave Type</Text>
        <View style={styles.typeRow}>
          {LEAVE_TYPES.map((t) => (
            <Button
              key={t}
              title={LEAVE_TYPE_LABELS[t]}
              variant={type === t ? 'primary' : 'outline'}
              onPress={() => setType(t)}
              style={styles.typeBtn}
            />
          ))}
        </View>

        <SelectField
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          options={dateOptions}
          placeholder="Select start date"
          error={startError}
          {...fieldColors}
        />

        <SelectField
          label="End Date"
          value={endDate}
          onChange={(value) => {
            setEndDate(value);
            setTouched((prev) => ({ ...prev, end: true }));
          }}
          options={endDateOptions}
          placeholder={startDate ? 'Select end date' : 'Select start date first'}
          error={endError}
          disabled={!startDate}
          {...fieldColors}
        />

        {datesValid ? (
          <Text style={[styles.hint, { color: colors.primary }]}>
            {leaveDays} day{leaveDays === 1 ? '' : 's'} requested
          </Text>
        ) : (
          <Text style={[styles.hint, { color: colors.textMuted }]}>Select dates from the lists above</Text>
        )}

        <SelectField
          label="Reason"
          value={reason}
          onChange={(value) => {
            setReason(value);
            setTouched((prev) => ({ ...prev, reason: true }));
          }}
          options={LEAVE_REASON_OPTIONS}
          placeholder="Select a reason"
          error={reasonError}
          {...fieldColors}
        />

        <Button
          title="Submit Request"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || !formComplete}
          style={styles.submit}
        />
        <Button title="Cancel" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  approverCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },
  approverLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  approverName: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  approverHint: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { flexGrow: 1, minWidth: '45%', paddingVertical: 10 },
  hint: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  submit: { marginTop: 24, marginBottom: 10 },
});
