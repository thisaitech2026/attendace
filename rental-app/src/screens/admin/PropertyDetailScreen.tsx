import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Property } from '../../types';
import { formatCurrency } from '../../data/mockData';
import { colors, propertyTypeColors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface PropertyDetailScreenProps {
  navigation: any;
  route: { params: { property: Property } };
}

export function PropertyDetailScreen({ navigation, route }: PropertyDetailScreenProps) {
  const { property } = route.params;
  const typeColor = propertyTypeColors[property.type] ?? colors.primary;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Property Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroIcon, { backgroundColor: typeColor + '18' }]}>
          <Ionicons
            name={property.type === 'Shop' || property.type === 'Commercial Unit' ? 'storefront' : 'home'}
            size={48}
            color={typeColor}
          />
        </View>

        <Text style={styles.name}>{property.name}</Text>
        <Text style={styles.id}>{property.id}</Text>
        <View style={styles.badges}>
          <Badge label={property.status} variant={property.status} />
          <Badge label={property.type} color={typeColor} backgroundColor={typeColor + '18'} />
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <DetailRow label="Address" value={property.address} />
          <DetailRow label="Description" value={property.description} />
          <DetailRow label="Monthly Rent" value={formatCurrency(property.monthlyRent)} highlight />
          <DetailRow label="Security Deposit" value={formatCurrency(property.securityDeposit)} />
        </Card>

        {(property.ebServiceNumber || property.waterConnectionNumber) && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Utility Information</Text>
            {property.ebServiceNumber && (
              <>
                <DetailRow label="EB Service Number" value={property.ebServiceNumber} />
                <DetailRow label="EB Consumer" value={property.ebConsumerName ?? '-'} />
              </>
            )}
            {property.waterConnectionNumber && (
              <>
                <DetailRow label="Water Connection" value={property.waterConnectionNumber} />
                <DetailRow label="Water Consumer" value={property.waterConsumerName ?? '-'} />
              </>
            )}
          </Card>
        )}

        <Button
          title="Edit Property"
          onPress={() => navigation.navigate('PropertyForm', { property })}
          style={styles.editBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.highlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, alignItems: 'center', paddingBottom: spacing.xxxl * 2 },
  heroIcon: { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  id: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl },
  section: { width: '100%', marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  rowLabel: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' },
  highlight: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  editBtn: { width: '100%', marginTop: spacing.md },
});
