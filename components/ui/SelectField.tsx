import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { SelectOption } from '@/constants/leaveOptions';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  cardColor: string;
  dangerColor: string;
  primaryColor: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  disabled = false,
  textColor,
  mutedColor,
  borderColor,
  cardColor,
  dangerColor,
  primaryColor,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const hasError = Boolean(error);
  const selected = options.find((option) => option.value === value);

  const fieldStyle = [
    styles.fieldWrap,
    {
      borderColor: hasError ? dangerColor : borderColor,
      backgroundColor: hasError ? 'rgba(220, 38, 38, 0.06)' : cardColor,
      borderWidth: hasError ? 2 : 1,
      opacity: disabled ? 0.6 : 1,
    },
  ];

  if (Platform.OS === 'web') {
    return (
      <View>
        <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
        <View style={fieldStyle}>
          <Ionicons name="chevron-down" size={18} color={hasError ? dangerColor : primaryColor} />
          <select
            aria-label={label}
            aria-invalid={hasError}
            disabled={disabled}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            style={{
              flex: 1,
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: selected ? textColor : mutedColor,
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'inherit',
              padding: '12px 0',
            }}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </View>
        {hasError ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        style={fieldStyle}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Ionicons name="chevron-down" size={18} color={hasError ? dangerColor : primaryColor} />
        <Text style={[styles.valueText, { color: selected ? textColor : mutedColor }]}>
          {selected?.label ?? placeholder}
        </Text>
      </Pressable>
      {hasError ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: cardColor, borderColor }]}>
          <View style={[styles.sheetHeader, { borderBottomColor: borderColor }]}>
            <Text style={[styles.sheetTitle, { color: textColor }]}>{label}</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={12}>
              <Ionicons name="close" size={24} color={mutedColor} />
            </Pressable>
          </View>
          <ScrollView>
            {options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.option,
                    {
                      backgroundColor: active ? `${primaryColor}14` : 'transparent',
                      borderBottomColor: borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.optionText, { color: active ? primaryColor : textColor }]}>
                    {option.label}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={18} color={primaryColor} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
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
  valueText: {
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    maxHeight: '55%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    paddingRight: 12,
  },
});
