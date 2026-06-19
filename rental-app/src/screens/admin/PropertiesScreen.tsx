import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PropertyCard } from '../../components/PropertyCard';
import { Input } from '../../components/Input';
import { properties } from '../../data/mockData';
import { PropertyType } from '../../types';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

const propertyTypes: (PropertyType | 'All')[] = ['All', 'House', 'Apartment', 'Villa', 'Shop', 'Commercial Unit'];

interface PropertiesScreenProps {
  navigation: any;
}

export function PropertiesScreen({ navigation }: PropertiesScreenProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PropertyType | 'All'>('All');

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('PropertyForm')}
        >
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Input
          placeholder="Search properties..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {propertyTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, filter === type && styles.filterChipActive]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        <Text style={styles.count}>{filtered.length} properties found</Text>
        {filtered.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onPress={() => navigation.navigate('PropertyDetail', { property })}
            showActions
            onEdit={() => navigation.navigate('PropertyForm', { property })}
          />
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  search: { marginBottom: 0 },
  filterScroll: { maxHeight: 48, marginTop: spacing.sm },
  filterContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.textInverse },
  list: { flex: 1 },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  count: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
});
