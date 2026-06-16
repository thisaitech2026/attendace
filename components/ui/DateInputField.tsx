import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { formatDateInput } from '@/utils/leaveValidation';

interface DateInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label: string;
  placeholder?: string;
  error?: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  cardColor: string;
  dangerColor: string;
  primaryColor: string;
}

export function DateInputField({
  value,
  onChange,
  onBlur,
  label,
  placeholder = 'YYYY-MM-DD',
  error,
  textColor,
  mutedColor,
  borderColor,
  cardColor,
  dangerColor,
  primaryColor,
}: DateInputFieldProps) {
  const hasError = Boolean(error);

  return (
    <View>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
      <View
        style={[
          styles.fieldWrap,
          {
            borderColor: hasError ? dangerColor : borderColor,
            backgroundColor: cardColor,
            borderWidth: hasError ? 2 : 1,
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={20} color={hasError ? dangerColor : primaryColor} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={(text) => onChange(formatDateInput(text))}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={mutedColor}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'number-pad'}
          maxLength={10}
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel={label}
        />
      </View>
      {hasError ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
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
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 12,
  },
  error: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
});
