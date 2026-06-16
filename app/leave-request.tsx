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
import { DateInputField } from '@/components/ui/DateInputField';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { LEAVE_TYPE_LABELS } from '@/constants/config';
import type { LeaveType } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';
import {
  calculateLeaveDays,
  getDateInputError,
  shouldValidateDateField,
  validateLeaveForm,
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
  const { requestLeave, employee } = useApp();
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

  const startError = useMemo(() => {
    if (!shouldValidateDateField(startDate, touched.start, showErrors)) return undefined;
    return getDateInputError(startDate, {
      required: true,
      fieldLabel: 'Start date',
      rejectPast: true,
    });
  }, [startDate, touched.start, showErrors]);

  const endError = useMemo(() => {
    if (!shouldValidateDateField(endDate, touched.end, showErrors)) return undefined;

    const fieldError = getDateInputError(endDate, {
      required: true,
      fieldLabel: 'End date',
      minDate: startDate.length === 10 && !startError ? startDate : undefined,
    });
    if (fieldError) return fieldError;

    if (
      startDate.length === 10 &&
      endDate.length === 10 &&
      !startError &&
      formValidation.errors.end
    ) {
      return formValidation.errors.end;
    }

    return undefined;
  }, [endDate, touched.end, showErrors, startDate, startError, formValidation.errors.end]);

  const reasonError = (showErrors || touched.reason) && !reason.trim() ? 'Reason is required' : undefined;

  const datesValid = useMemo(
    () => validateLeaveDateRange(startDate, endDate, { rejectPastStart: true }).valid,
    [startDate, endDate]
  );

  const canSubmit = datesValid && reason.trim().length > 0 && Boolean(employee);
  const submitDisabled = submitting || !canSubmit;

  const markTouched = (field: 'start' | 'end' | 'reason') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleStartDateChange = (next: string) => {
    setStartDate(next);
    if (next.length > 0) {
      setTouched((prev) => ({ ...prev, start: true }));
    }
    if (endDate && next.length === 10 && endDate < next) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (next: string) => {
    setEndDate(next);
    if (next.length > 0) {
      setTouched((prev) => ({ ...prev, end: true }));
    }
  };

  const handleSubmit = async () => {
    setShowErrors(true);
    setTouched({ start: true, end: true, reason: true });

    const validation = validateLeaveForm(startDate, endDate, reason, { rejectPastStart: true });

    if (!validation.valid) {
      showAlert(
        'Please fix the form',
        validation.summary ?? 'Enter valid dates in YYYY-MM-DD format before submitting.'
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
        {(showErrors && !formValidation.valid && formValidation.summary) || startError || endError ? (
          <View style={[styles.validationBanner, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}>
            <Text style={[styles.validationTitle, { color: colors.danger }]}>
              {formValidation.valid ? 'Check the highlighted fields' : 'Fix these issues before submitting:'}
            </Text>
            <Text style={[styles.validationText, { color: colors.danger }]}>
              {[startError, endError, reasonError].filter(Boolean).join('\n') ||
                formValidation.summary ||
                'Enter valid YYYY-MM-DD dates.'}
            </Text>
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

        <DateInputField
          label="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChange={handleStartDateChange}
          onBlur={() => markTouched('start')}
          error={startError}
          textColor={colors.text}
          mutedColor={colors.textSecondary}
          borderColor={colors.border}
          cardColor={colors.card}
          dangerColor={colors.danger}
          primaryColor={colors.primary}
        />

        <DateInputField
          label="End Date (YYYY-MM-DD)"
          value={endDate}
          onChange={handleEndDateChange}
          onBlur={() => markTouched('end')}
          error={endError}
          textColor={colors.text}
          mutedColor={colors.textSecondary}
          borderColor={colors.border}
          cardColor={colors.card}
          dangerColor={colors.danger}
          primaryColor={colors.primary}
        />

        {datesValid && leaveDays > 0 ? (
          <Text style={[styles.hint, { color: colors.primary }]}>
            {leaveDays} day{leaveDays === 1 ? '' : 's'} requested
          </Text>
        ) : (
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Only numbers allowed. Example: 2026-07-01
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
              borderWidth: reasonError ? 2 : 1,
              backgroundColor: reasonError ? 'rgba(220, 38, 38, 0.06)' : colors.card,
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  error: { fontSize: 12, fontWeight: '700', marginTop: 6 },
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
