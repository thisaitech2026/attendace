import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Badge } from './Badge';
import { Property } from '../types';
import { formatCurrency } from '../data/mockData';
import { colors, propertyTypeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PropertyCard({ property, onPress, showActions, onEdit, onDelete }: PropertyCardProps) {
  const typeColor = propertyTypeColors[property.type] ?? colors.primary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.typeIcon, { backgroundColor: typeColor + '18' }]}>
            <Ionicons
              name={property.type === 'Shop' || property.type === 'Commercial Unit' ? 'storefront' : 'home'}
              size={20}
              color={typeColor}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{property.name}</Text>
            <Text style={styles.id}>{property.id}</Text>
          </View>
          <Badge label={property.status} variant={property.status} />
        </View>

        <Text style={styles.address} numberOfLines={1}>{property.address}</Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.rentLabel}>Monthly Rent</Text>
            <Text style={styles.rent}>{formatCurrency(property.monthlyRent)}</Text>
          </View>
          <Badge label={property.type} color={typeColor} backgroundColor={typeColor + '18'} />
        </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  id: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  address: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rentLabel: { fontSize: 11, color: colors.textMuted },
  rent: { fontSize: 16, fontWeight: '700', color: colors.primary },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  deleteBtn: {},
  actionText: { fontSize: 13, fontWeight: '600', color: colors.primary },
});
