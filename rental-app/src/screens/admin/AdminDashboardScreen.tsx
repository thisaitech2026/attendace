import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import {
  dashboardStats,
  payments,
  overdueAccounts,
  formatCurrency,
} from '../../data/mockData';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

interface AdminDashboardScreenProps {
  navigation: any;
}

export function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const recentPayments = payments.slice(0, 4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Admin Dashboard</Text>
              <Text style={styles.date}>Friday, June 19, 2025</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.textInverse} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <Card style={styles.summaryCard} padding="lg">
            <Text style={styles.summaryLabel}>Monthly Collections</Text>
            <Text style={styles.summaryValue}>{formatCurrency(dashboardStats.monthlyCollections)}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Due</Text>
                <Text style={[styles.summaryItemValue, { color: colors.danger }]}>
                  {formatCurrency(dashboardStats.dueAmounts)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Fines</Text>
                <Text style={[styles.summaryItemValue, { color: colors.warning }]}>
                  {formatCurrency(dashboardStats.fineCollections)}
                </Text>
              </View>
            </View>
          </Card>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Property Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Total Properties" value={String(dashboardStats.totalProperties)} icon="business" />
            <StatCard title="Houses" value={String(dashboardStats.totalHouses)} icon="home" color={colors.success} />
            <StatCard title="Shops" value={String(dashboardStats.totalShops)} icon="storefront" color={colors.warning} />
            <StatCard
              title="Occupied"
              value={String(dashboardStats.occupiedProperties)}
              icon="checkmark-circle"
              color={colors.success}
            />
            <StatCard
              title="Vacant"
              value={String(dashboardStats.vacantProperties)}
              icon="close-circle"
              color={colors.danger}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overdue Accounts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Overdue')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <Card padding="sm">
            {overdueAccounts.map((account, index) => (
              <View
                key={index}
                style={[styles.overdueItem, index < overdueAccounts.length - 1 && styles.overdueBorder]}
              >
                <View style={styles.overdueLeft}>
                  <Text style={styles.overdueName}>{account.customerName}</Text>
                  <Text style={styles.overdueProperty}>{account.property}</Text>
                </View>
                <View style={styles.overdueRight}>
                  <Text style={styles.overdueAmount}>{formatCurrency(account.dueAmount)}</Text>
                  <Badge label={`${account.daysOverdue}d overdue`} variant="Failed" />
                </View>
              </View>
            ))}
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <Card padding="sm">
            {recentPayments.map((payment, index) => (
              <View
                key={payment.id}
                style={[styles.paymentItem, index < recentPayments.length - 1 && styles.paymentBorder]}
              >
                <View style={styles.paymentLeft}>
                  <Text style={styles.paymentName}>{payment.customerName}</Text>
                  <Text style={styles.paymentMeta}>{payment.rentMonth} · {payment.method}</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{formatCurrency(payment.totalPaid)}</Text>
                  <Badge label={payment.status} variant={payment.status} />
                </View>
              </View>
            ))}
          </Card>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {[
                { label: 'Add Property', icon: 'add-circle', screen: 'PropertyForm', color: colors.primary },
                { label: 'Add Customer', icon: 'person-add', screen: 'CustomerForm', color: colors.secondary },
                { label: 'Map Rental', icon: 'link', screen: 'RentalForm', color: colors.success },
                { label: 'Reports', icon: 'bar-chart', screen: 'Reports', color: colors.warning },
              ].map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.actionItem}
                  onPress={() => navigation.navigate(action.screen)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '18' }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl, paddingTop: spacing.md },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.textInverse },
  date: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  notifBtn: { position: 'relative', padding: spacing.sm },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  summaryCard: { marginTop: spacing.sm },
  summaryLabel: { fontSize: 13, color: colors.textSecondary },
  summaryValue: { fontSize: 32, fontWeight: '800', color: colors.text, marginVertical: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1 },
  summaryItemLabel: { fontSize: 12, color: colors.textMuted },
  summaryItemValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  content: { padding: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.md },
  seeAll: { fontSize: 14, fontWeight: '600', color: colors.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  overdueItem: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  overdueBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  overdueLeft: { flex: 1 },
  overdueName: { fontSize: 15, fontWeight: '600', color: colors.text },
  overdueProperty: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  overdueRight: { alignItems: 'flex-end', gap: spacing.xs },
  overdueAmount: { fontSize: 15, fontWeight: '700', color: colors.danger },
  paymentItem: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  paymentBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  paymentLeft: { flex: 1 },
  paymentName: { fontSize: 15, fontWeight: '600', color: colors.text },
  paymentMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  paymentRight: { alignItems: 'flex-end', gap: spacing.xs },
  paymentAmount: { fontSize: 15, fontWeight: '700', color: colors.success },
  quickActions: { marginTop: spacing.xl, marginBottom: spacing.xxxl },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionItem: { width: '47%', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  actionLabel: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' },
});
