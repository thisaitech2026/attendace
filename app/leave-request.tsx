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
import { DatePickerField } from '@/components/ui/DatePickerField';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import type { LeaveType } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';
import {
  calculateLeaveDays,
  getTodayString,
  validateLeaveForm,
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
  const [touched, setTouched] = useState({ start: false, end: false, reason: false });

  const formValidation = useMemo(
    () => validateLeaveForm(startDate, endDate, reason, { rejectPastStart: true }),
    [startDate, endDate, reason]
  );

  const leaveDays = useMemo(() => {
    if (!formValidation.valid) return 0;
    return calculateLeaveDays(startDate, endDate);
  }, [formValidation.valid, startDate, endDate]);

  const showFieldError = (field: 'start' | 'end' | 'reason'): string | undefined =>
    (showErrors || touched[field]) ? formValidation.errors[field] : undefined;

  const startError = showFieldError('start');
  const endError = showFieldError('end');
  const reasonError = showFieldError('reason');
  const submitDisabled = submitting || !formValidation.valid;

  const markTouched = (field: 'start' | 'end' | 'reason') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    setShowErrors(true);
    setTouched({ start: true, end: true, reason: true });

    if (!formValidation.valid) {
      showAlert(
        'Please fix the form',
        formValidation.summary ?? 'Complete all required fields with valid dates before submitting.'
      );
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {showErrors && !formValidation.valid && formValidation.summary ? (
          <View style={[styles.validationBanner, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}>
            <Text style={[styles.validationTitle, { color: colors.danger }]}>Fix these issues before submitting:</Text>
            <Text style={[styles.validationText, { color: colors.danger }]}>{formValidation.summary}</Text>
          </View>
        ) : null}

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

        <DatePickerField
          label="Start Date"
          value={startDate}
          onChange={(next) => {
            setStartDate(next);
            if (endDate && next > endDate) {
              setEndDate('');
            }
          }}
          onBlur={() => markTouched('start')}
          minimumDate={getTodayString()}
          error={startError}
          textColor={colors.text}
          mutedColor={colors.textSecondary}
          borderColor={colors.border}
          cardColor={colors.card}
          dangerColor={colors.danger}
          primaryColor={colors.primary}
        />

        <DatePickerField
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          onBlur={() => markTouched('end')}
          minimumDate={startDate || undefined}
          error={endError}
          textColor={colors.text}
          mutedColor={colors.textSecondary}
          borderColor={colors.border}
          cardColor={colors.card}
          dangerColor={colors.danger}
          primaryColor={colors.primary}
        />

        {formValidation.valid && leaveDays > 0 ? (
          <Text style={[styles.hint, { color: colors.primary }]}>
            {leaveDays} day{leaveDays === 1 ? '' : 's'} requested
          </Text>
        ) : (
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Select dates from the calendar. Past dates are not allowed.
          </Text>
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
          onBlur={() => markTouched('reason')}
          placeholder="Describe the reason for your leave..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />
        {reasonError ? <Text style={[styles.error, { color: colors.danger }]}>{reasonError}</Text> : null}

        {!formValidation.valid ? (
          <Text style={[styles.submitHint, { color: colors.textMuted }]}>
            Submit will be enabled once all fields are valid.
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  error: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  hint: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  submitHint: { fontSize: 12, marginTop: 16, fontWeight: '500' },
  validationBanner: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  validationTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  validationText: { fontSize: 13, fontWeight: '600', lineHeight: 20 },
  submit: { marginTop: 16, marginBottom: 10 },
});
