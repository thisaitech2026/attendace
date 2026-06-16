import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatLeaveDate, getTodayString, parseLeaveDate } from '@/utils/leaveValidation';

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;
  placeholder?: string;
  minimumDate?: string;
  error?: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  cardColor: string;
  dangerColor: string;
  primaryColor: string;
}

export function DatePickerField({
  value,
  onChange,
  onBlur,
  label,
  placeholder = 'Select date',
  minimumDate,
  error,
  textColor,
  mutedColor,
  borderColor,
  cardColor,
  dangerColor,
  primaryColor,
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const pickerDate = useMemo(() => {
    const parsed = parseLeaveDate(value);
    if (parsed) return parsed;
    const min = minimumDate ? parseLeaveDate(minimumDate) : null;
    return min ?? new Date();
  }, [minimumDate, value]);

  const minDate = useMemo(() => {
    if (minimumDate && parseLeaveDate(minimumDate)) {
      return parseLeaveDate(minimumDate)!;
    }
    return parseISO(getTodayString());
  }, [minimumDate]);

  const displayValue = value
    ? format(parseISO(value), 'MMM d, yyyy')
    : placeholder;

  const handleNativeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) {
      onBlur?.();
      return;
    }
    onChange(formatLeaveDate(selectedDate));
    onBlur?.();
  };

  if (Platform.OS === 'web') {
    return (
      <View>
        <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
        <View
          style={[
            styles.field,
            {
              borderColor: error ? dangerColor : borderColor,
              backgroundColor: cardColor,
            },
          ]}
        >
          {/* Web-only native date input prevents free-text invalid values */}
          <input
            type="date"
            aria-label={label}
            value={value}
            min={minimumDate ?? getTodayString()}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            onBlur={onBlur}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: textColor,
              fontSize: 16,
              fontFamily: 'inherit',
              padding: 0,
              minHeight: 24,
            }}
          />
        </View>
        {error ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={[
          styles.field,
          styles.pressableField,
          {
            borderColor: error ? dangerColor : borderColor,
            backgroundColor: cardColor,
          },
        ]}
      >
        <Text style={[styles.valueText, { color: value ? textColor : mutedColor }]}>{displayValue}</Text>
        <Ionicons name="calendar-outline" size={20} color={primaryColor} />
      </Pressable>
      {error ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
      {showPicker ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minDate}
          onChange={handleNativeChange}
        />
      ) : null}
      {Platform.OS === 'ios' && showPicker ? (
        <Pressable
          onPress={() => {
            setShowPicker(false);
            onBlur?.();
          }}
          style={[styles.doneBtn, { backgroundColor: primaryColor }]}
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  field: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  pressableField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  doneBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
