import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { customers } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

interface CustomersScreenProps {
  navigation: any;
}

export function CustomersScreen({ navigation }: CustomersScreenProps) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CustomerForm')}>
          <Ionicons name="person-add" size={22} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Input placeholder="Search customers..." value={search} onChangeText={setSearch} style={styles.search} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            onPress={() => navigation.navigate('CustomerDetail', { customer })}
            activeOpacity={0.7}
          >
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{customer.name}</Text>
                  <Text style={styles.id}>{customer.id}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.meta}>
                <View style={styles.metaItem}>
                  <Ionicons name="call-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{customer.mobile}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{customer.email}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
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
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  search: { marginBottom: 0 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 20, fontWeight: '700', color: colors.primary },
  cardInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  id: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  meta: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight, gap: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaText: { fontSize: 13, color: colors.textSecondary },
});
