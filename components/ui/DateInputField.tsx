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

function sanitizeDateInput(text: string): string {
  return formatDateInput(text);
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

  const fieldStyle = [
    styles.fieldWrap,
    {
      borderColor: hasError ? dangerColor : borderColor,
      backgroundColor: hasError ? 'rgba(220, 38, 38, 0.06)' : cardColor,
      borderWidth: hasError ? 2 : 1,
    },
  ];

  if (Platform.OS === 'web') {
    return (
      <View>
        <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
        <View style={fieldStyle}>
          <Ionicons name="calendar-outline" size={20} color={hasError ? dangerColor : primaryColor} />
          <input
            type="text"
            inputMode="numeric"
            aria-label={label}
            aria-invalid={hasError}
            value={value}
            maxLength={10}
            placeholder={placeholder}
            onChange={(event) => {
              onChange(sanitizeDateInput(event.target.value));
            }}
            onBlur={onBlur}
            style={{
              flex: 1,
              width: '100%',
              border: 'none',
              outline: hasError ? `2px solid ${dangerColor}` : 'none',
              background: 'transparent',
              color: textColor,
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'inherit',
              padding: '12px 0',
            }}
          />
        </View>
        {hasError ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
      <View style={fieldStyle}>
        <Ionicons name="calendar-outline" size={20} color={hasError ? dangerColor : primaryColor} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={(text) => onChange(sanitizeDateInput(text))}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={mutedColor}
          keyboardType="number-pad"
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
