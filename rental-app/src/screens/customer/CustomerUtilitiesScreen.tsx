import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { customerDashboard } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CustomerUtilitiesScreenProps {
  navigation: any;
}

export function CustomerUtilitiesScreen({ navigation }: CustomerUtilitiesScreenProps) {
  const { property } = customerDashboard;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Utility Information" subtitle="View-only access" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.note}>
          You can view your utility connection details below. Contact admin for any changes.
        </Text>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="flash" size={28} color={colors.warning} />
            </View>
            <Text style={styles.cardTitle}>Electricity (EB)</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>EB Service Number</Text>
            <Text style={styles.fieldValue}>{property.ebServiceNumber}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Consumer Name</Text>
            <Text style={styles.fieldValue}>{property.ebConsumerName}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: colors.infoLight }]}>
              <Ionicons name="water" size={28} color={colors.info} />
            </View>
            <Text style={styles.cardTitle}>Water Connection</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Water Connection Number</Text>
            <Text style={styles.fieldValue}>{property.waterConnectionNumber}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Consumer Name</Text>
            <Text style={styles.fieldValue}>{property.waterConsumerName}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  note: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 20 },
  card: { marginBottom: spacing.lg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md },
  iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  field: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  fieldValue: { fontSize: 16, fontWeight: '600', color: colors.text },
});
