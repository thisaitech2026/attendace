import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format, isBefore, isValid, parseISO, startOfDay } from 'date-fns';

import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import type { LeaveType } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

const LEAVE_TYPES: LeaveType[] = ['annual', 'sick', 'personal', 'unpaid'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INVALID_DATE_MSG = 'Enter a valid date (YYYY-MM-DD)';

function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function isValidYyyyMmDd(value: string): boolean {
  const trimmed = value.trim();
  if (!DATE_PATTERN.test(trimmed)) return false;

  const [year, month, day] = trimmed.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false;
  }

  const parsed = startOfDay(parseISO(trimmed));
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === trimmed;
}

function getStartDateError(value: string): string | undefined {
  if (!value.trim()) return 'Start date is required';
  if (value.length < 10) return 'Use format YYYY-MM-DD';
  if (!isValidYyyyMmDd(value)) return INVALID_DATE_MSG;
  if (isBefore(startOfDay(parseISO(value)), startOfDay(new Date()))) {
    return 'Start date cannot be in the past';
  }
  return undefined;
}

function getEndDateError(value: string, startValue: string, startValid: boolean): string | undefined {
  if (!value.trim()) return 'End date is required';
  if (value.length < 10) return 'Use format YYYY-MM-DD';
  if (!isValidYyyyMmDd(value)) return INVALID_DATE_MSG;
  if (startValid && isValidYyyyMmDd(startValue) && isBefore(parseISO(value), parseISO(startValue))) {
    return 'End date cannot be before start date';
  }
  return undefined;
}

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

  const startError = useMemo(() => {
    if (!touched.start && startDate.length < 10) return undefined;
    return getStartDateError(startDate);
  }, [startDate, touched.start]);

  const startDateValid = useMemo(() => !getStartDateError(startDate), [startDate]);

  const endError = useMemo(() => {
    if (!touched.end && endDate.length < 10) return undefined;
    return getEndDateError(endDate, startDate, startDateValid);
  }, [endDate, startDate, startDateValid, touched.end]);

  const endDateValid = useMemo(
    () => !getEndDateError(endDate, startDate, startDateValid),
    [endDate, startDate, startDateValid]
  );

  const reasonError = touched.reason && !reason.trim() ? 'Reason is required' : undefined;

  const datesValid = startDateValid && endDateValid && startDate.length === 10 && endDate.length === 10;
  const canSubmit = datesValid && reason.trim().length > 0 && Boolean(employee);
  const submitDisabled = submitting || !canSubmit;

  const leaveDays = useMemo(() => {
    if (!datesValid) return 0;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [datesValid, startDate, endDate]);

  const handleStartDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setStartDate(formatted);
    setTouched((prev) => ({ ...prev, start: true }));
    if (endDate && formatted.length === 10 && endDate < formatted) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (text: string) => {
    setEndDate(formatDateInput(text));
    setTouched((prev) => ({ ...prev, end: true }));
  };

  const handleSubmit = async () => {
    setTouched({ start: true, end: true, reason: true });

    const startErr = getStartDateError(startDate);
    const endErr = getEndDateError(endDate, startDate, startDateValid);

    if (startErr || endErr || !reason.trim()) {
      showAlert(
        'Please fix the form',
        [startErr, endErr, !reason.trim() ? 'Reason is required' : undefined].filter(Boolean).join('\n')
      );
      return;
    }

    if (!employee) {
      showAlert('Not signed in', 'Please log in as an employee to submit a leave request.');
      return;
    }

    setSubmitting(true);
    try {
      await requestLeave(type, startDate.trim(), endDate.trim(), reason.trim());
      showAlert('Submitted', 'Your leave request has been submitted for approval.', () => router.back());
    } catch (e) {
      showAlert('Error', e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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

        <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date (YYYY-MM-DD)</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: startError ? colors.danger : colors.border,
              borderWidth: startError ? 2 : 1,
              backgroundColor: startError ? 'rgba(220, 38, 38, 0.06)' : colors.card,
            },
          ]}
          value={startDate}
          onChangeText={handleStartDateChange}
          onBlur={() => setTouched((prev) => ({ ...prev, start: true }))}
          placeholder="2026-07-01"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={10}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {startError ? <Text style={[styles.error, { color: colors.danger }]}>{startError}</Text> : null}

        <Text style={[styles.label, { color: colors.textSecondary }]}>End Date (YYYY-MM-DD)</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: endError ? colors.danger : colors.border,
              borderWidth: endError ? 2 : 1,
              backgroundColor: endError ? 'rgba(220, 38, 38, 0.06)' : colors.card,
            },
          ]}
          value={endDate}
          onChangeText={handleEndDateChange}
          onBlur={() => setTouched((prev) => ({ ...prev, end: true }))}
          placeholder="2026-07-05"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={10}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {endError ? <Text style={[styles.error, { color: colors.danger }]}>{endError}</Text> : null}

        {datesValid ? (
          <Text style={[styles.hint, { color: colors.primary }]}>
            {leaveDays} day{leaveDays === 1 ? '' : 's'} requested
          </Text>
        ) : (
          <Text style={[styles.hint, { color: colors.textMuted }]}>Enter valid dates as YYYY-MM-DD</Text>
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Reason</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              color: colors.text,
              borderColor: reasonError ? colors.danger : colors.border,
              borderWidth: reasonError ? 2 : 1,
              backgroundColor: colors.card,
            },
          ]}
          value={reason}
          onChangeText={setReason}
          onBlur={() => setTouched((prev) => ({ ...prev, reason: true }))}
          placeholder="Describe the reason for your leave..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />
        {reasonError ? <Text style={[styles.error, { color: colors.danger }]}>{reasonError}</Text> : null}

        {!canSubmit ? (
          <Text style={[styles.submitHint, { color: colors.textMuted }]}>
            Submit is disabled until both dates are valid YYYY-MM-DD values and reason is filled.
          </Text>
        ) : null}

        <Button
          title="Submit Request"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitDisabled}
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
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { flexGrow: 1, minWidth: '45%', paddingVertical: 10 },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  error: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  hint: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  submitHint: { fontSize: 12, marginTop: 16, fontWeight: '500' },
  submit: { marginTop: 16, marginBottom: 10 },
});
