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

import { Button } from '@/components/ui/Button';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import type { LeaveType } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';
import {
  calculateLeaveDays,
  formatDateInput,
  validateLeaveDateRange,
} from '@/utils/leaveValidation';

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
  const { requestLeave } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const [type, setType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const dateValidation = useMemo(() => validateLeaveDateRange(startDate, endDate), [startDate, endDate]);
  const leaveDays = useMemo(() => {
    if (!dateValidation.valid) return 0;
    return calculateLeaveDays(startDate, endDate);
  }, [dateValidation.valid, startDate, endDate]);

  const reasonError = showErrors && !reason.trim() ? 'Reason is required' : undefined;
  const hasInvalidDates =
    Boolean(startDate) && Boolean(endDate) && !dateValidation.valid;
  const submitDisabled = submitting || hasInvalidDates;

  const handleStartDateChange = (text: string) => {
    setStartDate(formatDateInput(text));
    setShowErrors(false);
  };

  const handleEndDateChange = (text: string) => {
    setEndDate(formatDateInput(text));
    setShowErrors(false);
  };

  const handleSubmit = async () => {
    setShowErrors(true);

    if (!reason.trim()) {
      showAlert('Missing Reason', 'Please describe the reason for your leave.');
      return;
    }

    if (!dateValidation.valid) {
      const message =
        dateValidation.errors.end ??
        dateValidation.errors.start ??
        'Please enter valid dates in YYYY-MM-DD format.';
      showAlert('Invalid Dates', message);
      return;
    }

    setSubmitting(true);
    try {
      await requestLeave(type, startDate, endDate, reason.trim());
      showAlert('Submitted', 'Your leave request has been submitted for approval.', () => router.back());
    } catch (e) {
      showAlert('Error', e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const startError = showErrors ? dateValidation.errors.start : undefined;
  const endError = showErrors ? dateValidation.errors.end : undefined;

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

        <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: startError ? colors.danger : colors.border,
              backgroundColor: colors.card,
            },
          ]}
          value={startDate}
          onChangeText={handleStartDateChange}
          onBlur={() => setShowErrors(true)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={10}
        />
        {startError ? <Text style={[styles.error, { color: colors.danger }]}>{startError}</Text> : null}

        <Text style={[styles.label, { color: colors.textSecondary }]}>End Date</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: endError ? colors.danger : colors.border,
              backgroundColor: colors.card,
            },
          ]}
          value={endDate}
          onChangeText={handleEndDateChange}
          onBlur={() => setShowErrors(true)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={10}
        />
        {endError ? <Text style={[styles.error, { color: colors.danger }]}>{endError}</Text> : null}

        {dateValidation.valid && leaveDays > 0 ? (
          <Text style={[styles.hint, { color: colors.primary }]}>
            {leaveDays} day{leaveDays === 1 ? '' : 's'} requested
          </Text>
        ) : (
          <Text style={[styles.hint, { color: colors.textMuted }]}>Use format YYYY-MM-DD (example: 2026-07-01)</Text>
        )}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Reason</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              color: colors.text,
              borderColor: reasonError ? colors.danger : colors.border,
              backgroundColor: colors.card,
            },
          ]}
          value={reason}
          onChangeText={setReason}
          onBlur={() => setShowErrors(true)}
          placeholder="Describe the reason for your leave..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />
        {reasonError ? <Text style={[styles.error, { color: colors.danger }]}>{reasonError}</Text> : null}

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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  error: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  hint: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  submit: { marginTop: 24, marginBottom: 10 },
});
