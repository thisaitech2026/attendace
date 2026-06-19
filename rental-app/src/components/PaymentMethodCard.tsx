import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

interface PaymentMethodCardProps {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress?: () => void;
}

export function PaymentMethodCard({ name, icon, selected, onPress }: PaymentMethodCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
        style={[styles.card, selected ? styles.selected : undefined]}
        padding="sm"
      >
        <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
          <Ionicons name={icon} size={24} color={selected ? colors.primary : colors.textSecondary} />
        </View>
        <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
        {selected && (
          <View style={styles.check}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconWrapSelected: {
    backgroundColor: colors.surface,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primary,
  },
  check: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
