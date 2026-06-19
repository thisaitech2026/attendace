import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, statusColors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

interface BadgeProps {
  label: string;
  variant?: keyof typeof statusColors;
  color?: string;
  backgroundColor?: string;
}

export function Badge({ label, variant, color, backgroundColor }: BadgeProps) {
  const variantStyle = variant ? statusColors[variant] : null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: backgroundColor ?? variantStyle?.bg ?? colors.primaryLight,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: color ?? variantStyle?.text ?? colors.primary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
