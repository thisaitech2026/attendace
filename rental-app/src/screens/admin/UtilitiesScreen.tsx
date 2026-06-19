import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { properties } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function UtilitiesScreen() {
  const occupiedProperties = properties.filter((p) => p.status === 'Occupied');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Utilities</Text>
        <Text style={styles.subtitle}>EB & Water Information</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {occupiedProperties.map((property) => (
          <Card key={property.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="home" size={20} color={colors.primary} />
              <View style={styles.cardTitle}>
                <Text style={styles.name}>{property.name}</Text>
                <Text style={styles.id}>{property.id}</Text>
              </View>
            </View>

            <View style={styles.utilitySection}>
              <View style={styles.utilityHeader}>
                <Ionicons name="flash" size={18} color={colors.warning} />
                <Text style={styles.utilityTitle}>Electricity (EB)</Text>
              </View>
              <View style={styles.utilityRow}>
                <Text style={styles.utilityLabel}>Service Number</Text>
                <Text style={styles.utilityValue}>{property.ebServiceNumber}</Text>
              </View>
              <View style={styles.utilityRow}>
                <Text style={styles.utilityLabel}>Consumer Name</Text>
                <Text style={styles.utilityValue}>{property.ebConsumerName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.utilitySection}>
              <View style={styles.utilityHeader}>
                <Ionicons name="water" size={18} color={colors.info} />
                <Text style={styles.utilityTitle}>Water Connection</Text>
              </View>
              <View style={styles.utilityRow}>
                <Text style={styles.utilityLabel}>Connection Number</Text>
                <Text style={styles.utilityValue}>{property.waterConnectionNumber}</Text>
              </View>
              <View style={styles.utilityRow}>
                <Text style={styles.utilityLabel}>Consumer Name</Text>
                <Text style={styles.utilityValue}>{property.waterConsumerName}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md },
  cardTitle: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  id: { fontSize: 12, color: colors.textMuted },
  utilitySection: { marginBottom: spacing.sm },
  utilityHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  utilityTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  utilityRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  utilityLabel: { fontSize: 13, color: colors.textSecondary },
  utilityValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.md },
});
