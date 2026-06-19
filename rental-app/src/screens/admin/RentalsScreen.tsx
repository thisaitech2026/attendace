import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { rentalMappings, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface RentalsScreenProps {
  navigation: any;
}

export function RentalsScreen({ navigation }: RentalsScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Rental Mappings</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('RentalForm')}>
          <Ionicons name="link" size={22} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {rentalMappings.map((rental) => (
          <Card key={rental.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.rentalId}>{rental.id}</Text>
              <Badge label="Active" color={colors.success} backgroundColor={colors.successLight} />
            </View>

            <View style={styles.mappingRow}>
              <View style={styles.mappingItem}>
                <Ionicons name="person" size={16} color={colors.primary} />
                <View>
                  <Text style={styles.mappingLabel}>Customer</Text>
                  <Text style={styles.mappingValue}>{rental.customerName}</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
              <View style={styles.mappingItem}>
                <Ionicons name="home" size={16} color={colors.secondary} />
                <View>
                  <Text style={styles.mappingLabel}>Property</Text>
                  <Text style={styles.mappingValue}>{rental.propertyName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.details}>
              <DetailItem label="Start Date" value={rental.rentStartDate} />
              <DetailItem label="Monthly Rent" value={formatCurrency(rental.monthlyRent)} />
              <DetailItem label="Due Date" value={`${rental.dueDate}th of month`} />
              <DetailItem label="Grace Period" value={`${rental.gracePeriod} days`} />
              <DetailItem label="Fine/Day" value={formatCurrency(rental.finePerDay)} />
              <DetailItem label="Deposit" value={formatCurrency(rental.depositAmount)} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  rentalId: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  mappingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.surfaceAlt, borderRadius: 12 },
  mappingItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  mappingLabel: { fontSize: 11, color: colors.textMuted },
  mappingValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  detailItem: { width: '47%', paddingVertical: spacing.sm },
  detailLabel: { fontSize: 11, color: colors.textMuted },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 2 },
});
