import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { customerDashboard, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

interface CustomerDashboardScreenProps {
  navigation: any;
}

export function CustomerDashboardScreen({ navigation }: CustomerDashboardScreenProps) {
  const { customer, property, rental, outstandingAmount, fineAmount, totalPayable, daysOverdue } = customerDashboard;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {customer.name.split(' ')[0]}!</Text>
              <Text style={styles.subGreeting}>Your rental dashboard</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.profileInitial}>{customer.name.charAt(0)}</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.payableCard} padding="lg">
            <Text style={styles.payableLabel}>Total Payable Amount</Text>
            <Text style={styles.payableValue}>{formatCurrency(totalPayable)}</Text>
            {daysOverdue > 0 && (
              <Badge label={`${daysOverdue} days overdue`} variant="Failed" />
            )}
            <Button
              title="Pay Now"
              onPress={() => navigation.navigate('Payment')}
              style={styles.payBtn}
              size="lg"
            />
          </Card>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Amount Breakdown</Text>
          <View style={styles.breakdown}>
            <BreakdownItem label="Outstanding Rent" value={formatCurrency(outstandingAmount)} color={colors.danger} icon="cash" />
            <BreakdownItem label="Fine Amount" value={formatCurrency(fineAmount)} color={colors.warning} icon="warning" />
            <BreakdownItem label="Monthly Rent" value={formatCurrency(rental.monthlyRent)} color={colors.primary} icon="calendar" />
          </View>

          <Text style={styles.sectionTitle}>My Property</Text>
          <Card>
            <View style={styles.propertyHeader}>
              <View style={styles.propertyIcon}>
                <Ionicons name="home" size={24} color={colors.primary} />
              </View>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName}>{property.name}</Text>
                <Text style={styles.propertyAddress}>{property.address}</Text>
              </View>
              <Badge label={property.type} color={colors.primary} backgroundColor={colors.primaryLight} />
            </View>
            <View style={styles.propertyDetails}>
              <DetailRow label="Property ID" value={property.id} />
              <DetailRow label="Due Date" value={`${rental.dueDate}th of every month`} />
              <DetailRow label="Grace Period" value={`${rental.gracePeriod} days`} />
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.links}>
            {[
              { label: 'Utilities', icon: 'flash', screen: 'Utilities', color: colors.warning },
              { label: 'Payment History', icon: 'receipt', screen: 'PaymentHistory', color: colors.success },
              { label: 'Receipts', icon: 'document-text', screen: 'Receipts', color: colors.info },
              { label: 'My Profile', icon: 'person', screen: 'Profile', color: colors.secondary },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={styles.linkItem}
                onPress={() => navigation.navigate(link.screen)}
              >
                <View style={[styles.linkIcon, { backgroundColor: link.color + '18' }]}>
                  <Ionicons name={link.icon as any} size={22} color={link.color} />
                </View>
                <Text style={styles.linkLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BreakdownItem({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <Card style={styles.breakdownItem}>
      <View style={[styles.breakdownIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, { color }]}>{value}</Text>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, marginBottom: spacing.xl },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.textInverse },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  profileBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  profileInitial: { fontSize: 18, fontWeight: '700', color: colors.textInverse },
  payableCard: { alignItems: 'center' },
  payableLabel: { fontSize: 14, color: colors.textSecondary },
  payableValue: { fontSize: 36, fontWeight: '800', color: colors.text, marginVertical: spacing.sm },
  payBtn: { width: '100%', marginTop: spacing.md },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md, marginTop: spacing.lg },
  breakdown: { flexDirection: 'row', gap: spacing.md },
  breakdownItem: { flex: 1, alignItems: 'center' },
  breakdownIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  breakdownLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  breakdownValue: { fontSize: 14, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  propertyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  propertyIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  propertyInfo: { flex: 1 },
  propertyName: { fontSize: 16, fontWeight: '700', color: colors.text },
  propertyAddress: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  propertyDetails: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  detailLabel: { fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  linkItem: { width: '47%', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  linkIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  linkLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
});
